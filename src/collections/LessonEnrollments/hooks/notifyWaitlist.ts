import {
    waitlistLessonFallback,
    waitlistSpotAvailableEmail,
    waitlistSpotAvailableSubject,
} from "@/emails/waitlistSpotAvailable";
import { getLessonCreditBalance } from "@/utilities/credits";
import { languageOf } from "@/utilities/messages";
import { getServerSideURL } from "@/utilities/getURL";
import type {
    CollectionAfterChangeHook,
    CollectionAfterDeleteHook,
    Payload,
    PayloadRequest,
} from "payload";
import { countTakenSpots, getLessonSpots, lockLesson, toId } from "../waitlist";

/**
 * Offers free spots of a lesson to the next users on the waitlist (first come, first served):
 * they get an email, in their own language, and the spot is reserved for them until they take it
 * or are cancelled. Members who don't have a credit for the lesson are skipped: they stay on the
 * waitlist and are offered a spot the next time one is free (or as soon as they get credits).
 * Safe to call at any time; it only notifies for spots that are free and not yet offered.
 */
export const notifyWaitlist = async (
    payload: Payload,
    lessonId: number,
    req?: PayloadRequest,
): Promise<void> => {
    // Keeps two simultaneous cancellations from offering the same spot twice.
    await lockLesson({ payload, req }, lessonId);

    const spots = await getLessonSpots({ payload, req }, lessonId);

    if (spots === null) return;

    const freeSpots =
        spots - (await countTakenSpots({ payload, req }, lessonId));

    if (freeSpots <= 0) return;

    const { docs: waiting } = await payload.find({
        collection: "lesson-enrollments",
        where: {
            and: [
                { lesson: { equals: lessonId } },
                { status: { equals: "waitlisted" } },
                { waitlistNotifiedAt: { exists: false } },
            ],
        },
        sort: "waitlistedAt",
        pagination: false,
        depth: 1,
        overrideAccess: true,
        req,
    });

    if (waiting.length === 0) return;

    const lesson = await payload.findByID({
        collection: "lessons",
        id: lessonId,
        depth: 0,
        select: { title: true, startDate: true, type: true },
        overrideAccess: true,
        req,
    });

    let offered = 0;

    for (const enrollment of waiting) {
        if (offered >= freeSpots) break;

        const user =
            typeof enrollment.user === "object" ? enrollment.user : null;
        const userId = toId(enrollment.user);

        // A spot costs a credit once it is taken, so don't offer it to someone who can't take it.
        if (userId) {
            const balance = await getLessonCreditBalance(
                { payload, req },
                { userId, lesson, excludeEnrollmentId: enrollment.id },
            );

            if (balance && balance.left < 1) continue;
        }

        offered++;

        await payload.update({
            collection: "lesson-enrollments",
            id: enrollment.id,
            data: { waitlistNotifiedAt: new Date().toISOString() },
            overrideAccess: true,
            req,
        });

        if (!user?.email) continue;

        const language = languageOf(user);

        try {
            await payload.sendEmail({
                to: user.email,
                subject: waitlistSpotAvailableSubject(language),
                html: waitlistSpotAvailableEmail({
                    name: user.firstName ?? user.name,
                    lessonTitle:
                        lesson.title ?? waitlistLessonFallback(language),
                    language,
                    lessonDate: lesson.startDate
                        ? new Date(lesson.startDate).toLocaleString(
                              language === "en" ? "en-GB" : "nl-NL",
                              {
                                  dateStyle: "full",
                                  timeStyle: "short",
                                  timeZone: "Europe/Amsterdam",
                              },
                          )
                        : null,
                    url: `${getServerSideURL()}/dashboard`,
                }),
            });
        } catch (error) {
            payload.logger.error({
                err: error,
                msg: `Could not send waitlist email for enrollment ${enrollment.id}`,
            });
        }
    }
};

export const notifyWaitlistOnEnrollmentChange: CollectionAfterChangeHook =
    async ({ doc, previousDoc, operation, req }) => {
        // Only a status change can free a spot; the notification update itself keeps the status.
        if (operation !== "update" || previousDoc?.status === doc.status)
            return doc;

        const lessonId = toId(doc.lesson);

        if (lessonId) await notifyWaitlist(req.payload, lessonId, req);

        return doc;
    };

export const notifyWaitlistOnEnrollmentDelete: CollectionAfterDeleteHook =
    async ({ doc, req }) => {
        const lessonId = toId(doc.lesson);

        if (lessonId) await notifyWaitlist(req.payload, lessonId, req);

        return doc;
    };

/**
 * Offers free spots to a member who was skipped for lack of credits, now that their credits
 * may have changed (a credit adjustment, a subscription that became active).
 */
export const notifyWaitlistsOfUser = async (
    payload: Payload,
    userId: number,
    req?: PayloadRequest,
): Promise<void> => {
    const { docs } = await payload.find({
        collection: "lesson-enrollments",
        where: {
            and: [
                { user: { equals: userId } },
                { status: { equals: "waitlisted" } },
                { waitlistNotifiedAt: { exists: false } },
            ],
        },
        pagination: false,
        depth: 0,
        select: { lesson: true },
        overrideAccess: true,
        req,
    });
    const lessonIds = new Set(
        docs.flatMap((enrollment) => {
            const lessonId = toId(enrollment.lesson);

            return lessonId ? [lessonId] : [];
        }),
    );

    for (const lessonId of lessonIds) {
        await notifyWaitlist(payload, lessonId, req);
    }
};
