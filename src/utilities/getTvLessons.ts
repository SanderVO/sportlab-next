import type { BasePayload } from "payload";

export const TV_LESSON_PAGE_SIZE = 12;

export const tvLessonSelect = {
    title: true,
    type: true,
    status: true,
    startDate: true,
    endDate: true,
    image: true,
    coaches: {
        name: true,
        slug: true,
        avatar: true,
        position: true,
    },
    workoutBlocks: {
        workout: true,
        duration: true,
        exercises: {
            name: true,
            description: true,
            videoUrl: true,
        },
    },
} as const;

export async function getTvLessons(
    payload: BasePayload,
    args?: {
        page?: number;
    },
) {
    const now = new Date().toISOString();
    const page = args?.page ?? 1;

    return payload.find({
        collection: "lessons",
        depth: 2,
        limit: TV_LESSON_PAGE_SIZE,
        page,
        pagination: true,
        overrideAccess: true,
        sort: "startDate",
        select: tvLessonSelect as any,
        where: {
            startDate: {
                greater_than: now,
            },
        },
    });
}
