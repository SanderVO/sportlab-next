"use server";

import { isLessonFull } from "@/collections/LessonEnrollments/waitlist";
import config from "@payload-config";
import { headers } from "next/headers";
import { getPayload } from "payload";

type WaitlistResult = { ok: true } | { ok: false; error: string };

const getContext = async () => {
    const payload = await getPayload({ config });
    const { user } = await payload.auth({ headers: await headers() });

    return { payload, user };
};

/** Puts the signed-in user on the waitlist of a lesson that is full. */
export const joinLessonWaitlist = async (
    lessonId: number,
): Promise<WaitlistResult> => {
    const { payload, user } = await getContext();

    if (!user) return { ok: false, error: "Je bent niet ingelogd." };

    if (!(await isLessonFull({ payload }, lessonId))) {
        return { ok: false, error: "Er zijn nog plekken beschikbaar in deze les." };
    }

    const { docs } = await payload.find({
        collection: "lesson-enrollments",
        where: {
            and: [{ user: { equals: user.id } }, { lesson: { equals: lessonId } }],
        },
        limit: 1,
        depth: 0,
        overrideAccess: true,
    });
    const existing = docs[0];

    if (existing && existing.status !== "cancelled") {
        return {
            ok: false,
            error:
                existing.status === "waitlisted"
                    ? "Je staat al op de wachtlijst."
                    : "Je bent al ingeschreven voor deze les.",
        };
    }

    if (existing) {
        await payload.update({
            collection: "lesson-enrollments",
            id: existing.id,
            data: { status: "waitlisted" },
            overrideAccess: true,
        });
    } else {
        await payload.create({
            collection: "lesson-enrollments",
            data: { user: user.id, lesson: lessonId, status: "waitlisted" },
            overrideAccess: true,
        });
    }

    return { ok: true };
};

/** Takes the signed-in user off the waitlist of a lesson. */
export const leaveLessonWaitlist = async (
    lessonId: number,
): Promise<WaitlistResult> => {
    const { payload, user } = await getContext();

    if (!user) return { ok: false, error: "Je bent niet ingelogd." };

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
        overrideAccess: true,
    });

    return { ok: true };
};
