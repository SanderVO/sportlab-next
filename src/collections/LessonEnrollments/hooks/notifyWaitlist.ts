import { waitlistSpotAvailableEmail, waitlistSpotAvailableSubject } from "@/emails/waitlistSpotAvailable";
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
 * they get an email and the spot is reserved for them until they take it or are cancelled.
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

    const freeSpots = spots - (await countTakenSpots({ payload, req }, lessonId));

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
        limit: freeSpots,
        depth: 1,
        overrideAccess: true,
        req,
    });

    if (waiting.length === 0) return;

    const lesson = await payload.findByID({
        collection: "lessons",
        id: lessonId,
        depth: 0,
        select: { title: true, startDate: true },
        overrideAccess: true,
        req,
    });

    for (const enrollment of waiting) {
        const user = typeof enrollment.user === "object" ? enrollment.user : null;

        await payload.update({
            collection: "lesson-enrollments",
            id: enrollment.id,
            data: { waitlistNotifiedAt: new Date().toISOString() },
            overrideAccess: true,
            req,
        });

        if (!user?.email) continue;

        try {
            await payload.sendEmail({
                to: user.email,
                subject: waitlistSpotAvailableSubject,
                html: waitlistSpotAvailableEmail({
                    name: user.firstName ?? user.name,
                    lessonTitle: lesson.title ?? "de les",
                    lessonDate: lesson.startDate
                        ? new Date(lesson.startDate).toLocaleString("nl-NL", {
                              dateStyle: "full",
                              timeStyle: "short",
                              timeZone: "Europe/Amsterdam",
                          })
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

export const notifyWaitlistOnEnrollmentChange: CollectionAfterChangeHook = async ({
    doc,
    previousDoc,
    operation,
    req,
}) => {
    // Only a status change can free a spot; the notification update itself keeps the status.
    if (operation !== "update" || previousDoc?.status === doc.status) return doc;

    const lessonId = toId(doc.lesson);

    if (lessonId) await notifyWaitlist(req.payload, lessonId, req);

    return doc;
};

export const notifyWaitlistOnEnrollmentDelete: CollectionAfterDeleteHook = async ({
    doc,
    req,
}) => {
    const lessonId = toId(doc.lesson);

    if (lessonId) await notifyWaitlist(req.payload, lessonId, req);

    return doc;
};
