import { rolesOf } from "@/access/rolesOf";
import { RolesEnum } from "@/collections/Users/roles";
import { creditTypeForLessonType } from "@/utilities/creditPeriod";
import {
    creditPeriodLabel,
    languageOf,
    message,
    type Language,
} from "@/utilities/messages";
import {
    getCreditBalance,
    isCreditUsed,
    lockMemberCredits,
    type CreditBalance,
} from "@/utilities/credits";
import { APIError, type CollectionBeforeChangeHook } from "payload";
import { isOccupyingStatus, toId } from "../waitlist";

/** The reason a booking is refused, in the words (and language) the member sees. */
const refusalMessage = (balance: CreditBalance, language: Language): string => {
    if (balance.access === "none") {
        return message(language, "notInSubscription");
    }

    if (balance.access === "inactive") {
        return message(language, "subscriptionInactive");
    }

    if (balance.planCredits === 0 && balance.adjustments <= 0) {
        return message(language, "notInSubscription");
    }

    return message(
        language,
        balance.creditType === "group" ? "noGroupCredits" : "noPtCredits",
        {
            period: creditPeriodLabel(
                language,
                balance.creditType,
                balance.period.start,
            ),
        },
    );
};

/**
 * Refuses a booking that would use a credit the member doesn't have.
 * - A credit is used when an enrollment takes a spot: a new enrollment, a waitlisted member
 *   confirming the offered spot, or a cancelled enrollment that is taken up again.
 *   Joining the waitlist costs nothing.
 * - Open gym needs no credit.
 * - Admins and coaches may book a member in without credits; the credit is then used as usual.
 * Runs after the capacity check, so the lesson lock is always taken before the member lock.
 */
export const enforceCredits: CollectionBeforeChangeHook = async ({
    data,
    originalDoc,
    req,
}) => {
    const status: string = data.status ?? originalDoc?.status ?? "assigned";
    const previousStatus: string | undefined = originalDoc?.status;

    if (!isOccupyingStatus(status) || isOccupyingStatus(previousStatus)) {
        return data;
    }

    const roles = rolesOf(req.user);

    if (roles.includes(RolesEnum.ADMIN) || roles.includes(RolesEnum.COACH)) {
        return data;
    }

    const lessonId = toId(data.lesson ?? originalDoc?.lesson);
    const userId = toId(data.user ?? originalDoc?.user);

    if (!lessonId || !userId) return data;

    const lesson = await req.payload.findByID({
        collection: "lessons",
        id: lessonId,
        depth: 0,
        select: { type: true, startDate: true },
        overrideAccess: true,
        req,
    });
    const creditType = lesson.type
        ? creditTypeForLessonType(lesson.type)
        : null;

    if (!creditType || !lesson.startDate) return data;

    // Taking up a late-cancelled enrollment again: its credit was never given back.
    if (
        previousStatus === "cancelled" &&
        isCreditUsed({
            status: "cancelled",
            cancelledAt: originalDoc?.cancelledAt,
            lessonStart: lesson.startDate,
        })
    ) {
        return data;
    }

    const context = { payload: req.payload, req };

    await lockMemberCredits(context, userId);

    const balance = await getCreditBalance(context, {
        userId,
        creditType,
        at: lesson.startDate,
        excludeEnrollmentId: toId(originalDoc?.id),
    });

    if (balance.left < 1) {
        throw new APIError(
            refusalMessage(balance, languageOf(req.user, req.headers)),
            400,
            undefined,
            true,
        );
    }

    return data;
};
