import type { BasePayload } from "payload";

export const TV_LESSON_PAGE_SIZE = 12;

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

export function getTvDateRange(referenceDate = new Date()) {
    return { today: toDateParam(referenceDate) };
}

export const tvLessonSelect = {
    title: true,
    type: true,
    status: true,
    startDate: true,
    endDate: true,
    image: true,
    program: {
        title: true,
    },
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
        poa: true,
        timerMode: true,
        intervalSeconds: true,
        rounds: true,
        workSeconds: true,
        restSeconds: true,
        exercises: {
            name: true,
            quantity: true,
            rotating: true,
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

export function parseTvMonthParam(value?: string | null) {
    if (!value || !/^\d{4}-(0[1-9]|1[0-2])$/.test(value)) {
        return null;
    }

    return value;
}

export type TvDaySummary = Record<
    string,
    Array<{ time: string; title: string }>
>;

/** Lessons of a whole month, grouped by day (same UTC day boundaries as getTvLessons). */
export async function getTvMonthSummary(
    payload: BasePayload,
    monthParam: string,
): Promise<TvDaySummary> {
    const monthStart = `${monthParam}-01`;
    const [year, month] = monthParam.split("-").map(Number);
    const nextMonthStart = toDateParam(new Date(Date.UTC(year, month, 1)));

    const result = await payload.find({
        collection: "lessons",
        depth: 0,
        limit: 500,
        pagination: false,
        overrideAccess: true,
        sort: "startDate",
        select: { title: true, startDate: true },
        where: {
            and: [
                {
                    startDate: {
                        greater_than_equal: `${monthStart}T00:00:00.000Z`,
                    },
                },
                { startDate: { less_than: `${nextMonthStart}T00:00:00.000Z` } },
            ],
        },
    });

    const summary: TvDaySummary = {};

    for (const lesson of result.docs) {
        if (!lesson.startDate) continue;

        const date = new Date(lesson.startDate);
        const key = toDateParam(date);
        const time = new Intl.DateTimeFormat("nl-NL", {
            hour: "2-digit",
            minute: "2-digit",
            timeZone: "Europe/Amsterdam",
        }).format(date);

        (summary[key] ??= []).push({
            time,
            title: lesson.title || `Les ${lesson.id}`,
        });
    }

    return summary;
}
