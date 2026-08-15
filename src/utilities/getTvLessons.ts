import type { BasePayload } from "payload";

export const TV_LESSON_PAGE_SIZE = 12;
export const TV_DATE_WINDOW_DAYS = 14;

type TvDateRange = {
    today: string;
    min: string;
    max: string;
};

function toDateParam(date: Date) {
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function addDays(dateParam: string, days: number) {
    const date = new Date(`${dateParam}T00:00:00.000Z`);
    date.setUTCDate(date.getUTCDate() + days);
    return toDateParam(date);
}

export function parseTvDateParam(value?: string | null) {
    if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return null;
    }

    const date = new Date(`${value}T00:00:00.000Z`);

    if (Number.isNaN(date.getTime())) {
        return null;
    }

    // Reject malformed dates like 2026-02-31 that overflow into another day.
    if (toDateParam(date) !== value) {
        return null;
    }

    return value;
}

export function getTvDateRange(
    referenceDate = new Date(),
    windowDays = TV_DATE_WINDOW_DAYS,
): TvDateRange {
    const today = toDateParam(referenceDate);

    return {
        today,
        min: addDays(today, -windowDays),
        max: addDays(today, windowDays),
    };
}

export function clampTvDateParam(dateParam: string, range: TvDateRange) {
    if (dateParam < range.min) {
        return range.min;
    }

    if (dateParam > range.max) {
        return range.max;
    }

    return dateParam;
}

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
        name: true,
        description: true,
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
        dateParam?: string;
    },
) {
    const page = args?.page ?? 1;
    const dateParam = args?.dateParam ?? getTvDateRange().today;
    const dayStart = `${dateParam}T00:00:00.000Z`;
    const dayEnd = `${addDays(dateParam, 1)}T00:00:00.000Z`;

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
            and: [
                {
                    startDate: {
                        greater_than_equal: dayStart,
                    },
                },
                {
                    startDate: {
                        less_than: dayEnd,
                    },
                },
            ],
        },
    });
}
