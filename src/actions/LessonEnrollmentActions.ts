"use server";

import { isOccupyingStatus } from "@/collections/LessonEnrollments/waitlist";
import { message } from "@/utilities/messages";
import {
    actionError,
    getLessonActionContext,
    type ActionResult,
} from "./lessonActionContext";

/**
 * Enrols the signed-in user in a lesson. Also covers confirming a spot that was offered from the
 * waitlist and taking up a cancelled enrollment again. The enrollment hooks decide whether it is
 * allowed (spots left, credits left) and answer in the user's language.
 */
export const enrollInLesson = async (
    lessonId: number,
): Promise<ActionResult> => {
    const { payload, user, language } = await getLessonActionContext();

    if (!user) return { ok: false, error: message(language, "notSignedIn") };

    try {
        const lesson = await payload
            .findByID({
                collection: "lessons",
                id: lessonId,
                depth: 0,
                select: { endDate: true },
                overrideAccess: true,
            })
            .catch(() => null);

        if (!lesson) {
            return { ok: false, error: message(language, "lessonNotFound") };
        }

        if (lesson.endDate && new Date(lesson.endDate).getTime() < Date.now()) {
            return { ok: false, error: message(language, "lessonOver") };
        }

        const { docs } = await payload.find({
            collection: "lesson-enrollments",
            where: {
                and: [
                    { user: { equals: user.id } },
                    { lesson: { equals: lessonId } },
                ],
            },
            limit: 1,
            depth: 0,
            overrideAccess: true,
        });
        const existing = docs[0];

        if (existing && isOccupyingStatus(existing.status)) {
            return { ok: false, error: message(language, "alreadyEnrolled") };
        }

        // Access rules don't let members create enrollments themselves, so this runs with full
        // access but as the member: the hooks still see who is asking.
        if (existing) {
            await payload.update({
                collection: "lesson-enrollments",
                id: existing.id,
                data: { status: "assigned" },
                user,
                overrideAccess: true,
            });
        } else {
            await payload.create({
                collection: "lesson-enrollments",
                data: { user: user.id, lesson: lessonId, status: "assigned" },
                user,
                overrideAccess: true,
            });
        }

        return { ok: true };
    } catch (error) {
        return actionError(error, language);
    }
};
