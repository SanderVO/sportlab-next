import { sql } from "@payloadcms/db-postgres";
import type { Payload, PayloadRequest } from "payload";

/** Statuses that take up a spot in a lesson. */
export const OCCUPYING_STATUSES = ["assigned", "started", "completed"] as const;

export const isOccupyingStatus = (status: string | null | undefined): boolean =>
    OCCUPYING_STATUSES.some((occupying) => occupying === status);

export const toId = (
    value: { id?: string | number } | string | number | null | undefined,
): number | undefined => {
    const id = typeof value === "object" && value ? value.id : value;
    const parsed = typeof id === "string" ? Number(id) : id;

    return typeof parsed === "number" && !Number.isNaN(parsed)
        ? parsed
        : undefined;
};

type Context = { payload: Payload; req?: Partial<PayloadRequest> };

type TransactionDb = { execute: (query: ReturnType<typeof sql>) => Promise<unknown> };

/**
 * Locks the lesson row until the current transaction ends (`SELECT ... FOR UPDATE`), so
 * concurrent claims on the same lesson run one after the other: the capacity check that follows
 * then sees the enrollments the previous claim committed. Without a transaction there is nothing
 * to hold the lock, so it does nothing.
 */
export const lockLesson = async (
    { payload, req }: Context,
    lessonId: number,
): Promise<void> => {
    const transactionID = await req?.transactionID;

    if (!transactionID) return;

    const sessions = (
        payload.db as unknown as {
            sessions?: Record<string, { db: TransactionDb }>;
        }
    ).sessions;

    await sessions?.[transactionID]?.db.execute(
        sql`SELECT 1 FROM "lessons" WHERE "id" = ${lessonId} FOR UPDATE`,
    );
};

/** The number of spots of a lesson, or null when the lesson has no limit. */
export const getLessonSpots = async (
    { payload, req }: Context,
    lessonId: number,
): Promise<number | null> => {
    const lesson = await payload.findByID({
        collection: "lessons",
        id: lessonId,
        depth: 0,
        select: { spots: true },
        overrideAccess: true,
        req: req as PayloadRequest,
    });

    return typeof lesson.spots === "number" ? lesson.spots : null;
};

/**
 * How many spots are taken: enrollments that occupy a spot, plus waitlisted users who were
 * offered a free spot (it is reserved for them). `excludeId` leaves one enrollment out.
 */
export const countTakenSpots = async (
    { payload, req }: Context,
    lessonId: number,
    excludeId?: number,
): Promise<number> => {
    const { totalDocs } = await payload.count({
        collection: "lesson-enrollments",
        where: {
            and: [
                { lesson: { equals: lessonId } },
                ...(excludeId ? [{ id: { not_equals: excludeId } }] : []),
                {
                    or: [
                        { status: { in: [...OCCUPYING_STATUSES] } },
                        {
                            and: [
                                { status: { equals: "waitlisted" } },
                                { waitlistNotifiedAt: { exists: true } },
                            ],
                        },
                    ],
                },
            ],
        },
        overrideAccess: true,
        req: req as PayloadRequest,
    });

    return totalDocs;
};

export const isLessonFull = async (
    context: Context,
    lessonId: number,
    excludeId?: number,
): Promise<boolean> => {
    const spots = await getLessonSpots(context, lessonId);

    if (spots === null) return false;

    return (await countTakenSpots(context, lessonId, excludeId)) >= spots;
};
