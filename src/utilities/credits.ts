import { sql } from "@payloadcms/db-postgres";
import type { Payload, PayloadRequest } from "payload";
import {
    creditTypeForLessonType,
    getCreditPeriod,
    type CreditPeriod,
    type CreditType,
    type LessonType,
} from "./creditPeriod";
import { relationshipID } from "./relationshipID";

/**
 * Credit balance of a member for one credit type in one period.
 *
 * left = the plan's credits + the credit adjustments of the period - the credits used
 * - Only an `active` or `trialing` subscription gives its plan's credits.
 * - Used = enrollments that took a spot (assigned, started, completed), plus enrollments cancelled
 *   less than 5 minutes before the start (no refund). Waitlisted enrollments cost nothing.
 * - A credit belongs to the period of the lesson (group: calendar month, PT: week), not of the booking.
 */

/** Cancelling at least this long before the start gives the credit back. */
export const FREE_CANCELLATION_MS = 5 * 60 * 1000;

/** Subscription statuses whose plan gives credits. */
export const CREDIT_GIVING_STATUSES = ["active", "trialing"] as const;

const SPOT_STATUSES = ["assigned", "started", "completed"];

export const lessonTypesForCredit = (creditType: CreditType): LessonType[] =>
    creditType === "group" ? ["group"] : ["pt", "semi_pt"];

export const givesCredits = (status: string | null | undefined): boolean =>
    CREDIT_GIVING_STATUSES.some((giving) => giving === status);

type EnrollmentForCredits = {
    status: string;
    cancelledAt?: string | null;
    lessonStart: string;
};

/** Whether an enrollment uses a credit of its lesson's period. */
export const isCreditUsed = ({
    status,
    cancelledAt,
    lessonStart,
}: EnrollmentForCredits): boolean => {
    if (SPOT_STATUSES.includes(status)) return true;
    // Cancelled before `cancelledAt` existed: treated as refunded.
    if (status !== "cancelled" || !cancelledAt) return false;

    const start = new Date(lessonStart).getTime();
    const cancelled = new Date(cancelledAt).getTime();

    if (Number.isNaN(start) || Number.isNaN(cancelled)) return false;

    return start - cancelled < FREE_CANCELLATION_MS;
};

export type SubscriptionAccess =
    /** An active or trialing subscription gives the plan's credits. */
    | "active"
    /** The member's latest subscription exists but doesn't give credits (past due, paused, ended ...). */
    | "inactive"
    /** The member has no subscription. */
    | "none";

export type CreditBalance = {
    creditType: CreditType;
    period: CreditPeriod;
    access: SubscriptionAccess;
    /** Status of the subscription behind `access`, null without a subscription. */
    subscriptionStatus: string | null;
    /** Credits of the plan for this period; 0 when the plan doesn't include this type or the subscription doesn't give credits. */
    planCredits: number;
    /** Sum of the credit adjustments of the period (can be negative). */
    adjustments: number;
    used: number;
    left: number;
};

type Context = { payload: Payload; req?: Partial<PayloadRequest> };

const asRequest = (req: Context["req"]): PayloadRequest | undefined =>
    req as PayloadRequest | undefined;

type TransactionDb = {
    execute: (query: ReturnType<typeof sql>) => Promise<unknown>;
};

/**
 * Locks the member's row until the current transaction ends (`SELECT ... FOR UPDATE`), so two
 * bookings of the same member can't both spend the last credit. Always take it after the lesson
 * lock. Without a transaction there is nothing to hold the lock, so it does nothing.
 */
export const lockMemberCredits = async (
    { payload, req }: Context,
    userId: number,
): Promise<void> => {
    const transactionID = await req?.transactionID;

    if (!transactionID) return;

    const sessions = (
        payload.db as unknown as {
            sessions?: Record<string, { db: TransactionDb }>;
        }
    ).sessions;

    await sessions?.[transactionID]?.db.execute(
        sql`SELECT 1 FROM "users" WHERE "id" = ${userId} FOR UPDATE`,
    );
};

/** The plan credits for a type, from a populated subscription plan. */
const planCreditsFor = (plan: unknown, creditType: CreditType): number => {
    if (!plan || typeof plan !== "object") return 0;

    const record = plan as {
        groupCreditsPerMonth?: number | null;
        ptCreditsPerWeek?: number | null;
    };
    const credits =
        creditType === "group"
            ? record.groupCreditsPerMonth
            : record.ptCreditsPerWeek;

    return typeof credits === "number" ? credits : 0;
};

type Args = {
    userId: number;
    creditType: CreditType;
    /** Any moment in the period, normally the start of the lesson. */
    at: Date | string;
    /** An enrollment to leave out of the count (the one being changed). */
    excludeEnrollmentId?: number;
};

export const getCreditBalance = async (
    { payload, req }: Context,
    { userId, creditType, at, excludeEnrollmentId }: Args,
): Promise<CreditBalance> => {
    const period = getCreditPeriod(creditType, at);
    const startIso = period.start.toISOString();
    const endIso = period.end.toISOString();
    const request = asRequest(req);

    // Subscription: the most recent one that gives credits, else the most recent one at all.
    const subscriptions = await payload.find({
        collection: "subscriptions",
        where: { user: { equals: userId } },
        sort: "-createdAt",
        limit: 20,
        depth: 1,
        overrideAccess: true,
        req: request,
    });
    const giving = subscriptions.docs.find((subscription) =>
        givesCredits(subscription.status),
    );
    const latest = giving ?? subscriptions.docs[0];
    const access: SubscriptionAccess = giving
        ? "active"
        : latest
          ? "inactive"
          : "none";
    const planCredits = giving ? planCreditsFor(giving.plan, creditType) : 0;

    // Credit adjustments of this period and type (periodStart is the first moment of the period).
    const adjustmentDocs = await payload.find({
        collection: "credit-adjustments",
        where: {
            and: [
                { user: { equals: userId } },
                { creditType: { equals: creditType } },
                { periodStart: { greater_than_equal: startIso } },
                { periodStart: { less_than_equal: endIso } },
            ],
        },
        pagination: false,
        depth: 0,
        select: { amount: true },
        overrideAccess: true,
        req: request,
    });
    const adjustments = adjustmentDocs.docs.reduce(
        (sum, adjustment) => sum + (adjustment.amount ?? 0),
        0,
    );

    // Lessons of this credit type in the period, then this member's enrollments in them.
    const lessons = await payload.find({
        collection: "lessons",
        where: {
            and: [
                { type: { in: lessonTypesForCredit(creditType) } },
                { startDate: { greater_than_equal: startIso } },
                { startDate: { less_than_equal: endIso } },
            ],
        },
        pagination: false,
        depth: 0,
        select: { startDate: true },
        overrideAccess: true,
        req: request,
    });
    const lessonStarts = new Map<number, string>(
        lessons.docs.flatMap((lesson) =>
            lesson.startDate ? [[lesson.id, lesson.startDate] as const] : [],
        ),
    );

    let used = 0;

    if (lessonStarts.size > 0) {
        const enrollments = await payload.find({
            collection: "lesson-enrollments",
            where: {
                and: [
                    { user: { equals: userId } },
                    { lesson: { in: [...lessonStarts.keys()] } },
                    { status: { in: [...SPOT_STATUSES, "cancelled"] } },
                    ...(excludeEnrollmentId
                        ? [{ id: { not_equals: excludeEnrollmentId } }]
                        : []),
                ],
            },
            pagination: false,
            depth: 0,
            select: { status: true, cancelledAt: true, lesson: true },
            overrideAccess: true,
            req: request,
        });

        used = enrollments.docs.filter((enrollment) => {
            const lessonId = Number(relationshipID(enrollment.lesson));
            const lessonStart = lessonStarts.get(lessonId);

            return (
                lessonStart !== undefined &&
                isCreditUsed({
                    status: enrollment.status,
                    cancelledAt: enrollment.cancelledAt,
                    lessonStart,
                })
            );
        }).length;
    }

    return {
        creditType,
        period,
        access,
        subscriptionStatus: latest?.status ?? null,
        planCredits,
        adjustments,
        used,
        left: planCredits + adjustments - used,
    };
};

/**
 * The member's balance for the credit a lesson would use, or null when the lesson needs no credit
 * (open gym). A member can take a spot when this is null or `left` is at least 1.
 */
export const getLessonCreditBalance = async (
    context: Context,
    {
        userId,
        lesson,
        excludeEnrollmentId,
    }: {
        userId: number;
        lesson: { type?: LessonType | null; startDate?: string | null };
        excludeEnrollmentId?: number;
    },
): Promise<CreditBalance | null> => {
    const creditType = lesson.type
        ? creditTypeForLessonType(lesson.type)
        : null;

    if (!creditType || !lesson.startDate) return null;

    return getCreditBalance(context, {
        userId,
        creditType,
        at: lesson.startDate,
        excludeEnrollmentId,
    });
};
