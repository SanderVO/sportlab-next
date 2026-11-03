"use server";

import { isLessonFull } from "@/collections/LessonEnrollments/waitlist";
import { message } from "@/utilities/messages";
import {
    actionError,
    getLessonActionContext,
    type ActionResult,
} from "./lessonActionContext";

/** Puts the signed-in user on the waitlist of a lesson that is full. */
export const joinLessonWaitlist = async (
    lessonId: number,
): Promise<ActionResult> => {
    const { payload, user, language } = await getLessonActionContext();

    if (!user) return { ok: false, error: message(language, "notSignedIn") };

    try {
        if (!(await isLessonFull({ payload }, lessonId))) {
            return { ok: false, error: message(language, "spotsAvailable") };
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

        if (existing && existing.status !== "cancelled") {
            return {
                ok: false,
                error: message(
                    language,
                    existing.status === "waitlisted"
                        ? "alreadyOnWaitlist"
                        : "alreadyEnrolled",
                ),
            };
        }

        if (existing) {
            await payload.update({
                collection: "lesson-enrollments",
                id: existing.id,
                data: { status: "waitlisted" },
                user,
                overrideAccess: true,
            });
        } else {
            await payload.create({
                collection: "lesson-enrollments",
                data: { user: user.id, lesson: lessonId, status: "waitlisted" },
                user,
                overrideAccess: true,
            });
        }

        return { ok: true };
    } catch (error) {
        return actionError(error, language);
    }
};

/** Takes the signed-in user off the waitlist of a lesson. */
export const leaveLessonWaitlist = async (
    lessonId: number,
): Promise<ActionResult> => {
    const { payload, user, language } = await getLessonActionContext();

    if (!user) return { ok: false, error: message(language, "notSignedIn") };

    try {
        // Cancelling (not deleting) keeps the record and frees an offered spot for the next in line.
        await payload.update({
            collection: "lesson-enrollments",
            where: {
                and: [
                    { user: { equals: user.id } },
                    { lesson: { equals: lessonId } },
                    { status: { equals: "waitlisted" } },
                ],
            },
            data: { status: "cancelled" },
            user,
            overrideAccess: true,
        });

        return { ok: true };
    } catch (error) {
        return actionError(error, language);
    }
};
