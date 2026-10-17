import type { BasePayload, SelectType } from "payload";

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
        position: true,
    },
    workoutBlocks: {
        name: true,
        description: true,
        duration: true,
        poa: true,
        timerMode: true,
        highlightExercises: true,
        intervalSeconds: true,
        rounds: true,
        roundTypes: {
            type: true,
            seconds: true,
        },
        exercises: {
            name: true,
            quantity: true,
            rotating: true,
            description: true,
            videoUrl: true,
        },
    },
} as const;

/** Fields the lesson detail page renders; keeps coach emails out of the page payload. */
export const tvLessonDetailSelect = {
    title: true,
    startDate: true,
    image: true,
    program: { title: true },
    coaches: { name: true },
    workoutBlocks: true,
} as const;

/** Drops row ids so two lessons with the same content produce the same string. */
function withoutIds(value: unknown): unknown {
    if (Array.isArray(value)) return value.map(withoutIds);

    if (value && typeof value === "object") {
        return Object.fromEntries(
            Object.entries(value)
                .filter(([key]) => key !== "id")
                .map(([key, entry]) => [key, withoutIds(entry)]),
        );
    }

    return value;
}

/**
 * Lessons on one day that only differ by time (morning / evening) carry the
 * same workout. The TV shows the earliest of each; enrolment keeps both.
 * Input must be sorted by startDate.
 */
export function dedupeTvLessons<
    T extends { title?: string | null; type?: string | null },
>(lessons: T[]): T[] {
    const seen = new Set<string>();

    return lessons.filter((lesson) => {
        const key = JSON.stringify([
            lesson.title,
            lesson.type,
            withoutIds((lesson as { workoutBlocks?: unknown }).workoutBlocks),
        ]);

        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });
}

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

    // A day has a handful of lessons, so dedupe first and paginate in memory.
    const result = await payload.find({
        collection: "lessons",
        depth: 1,
        limit: 100,
        pagination: false,
        overrideAccess: true,
        sort: "startDate",
        select: tvLessonSelect as SelectType,
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

    const unique = dedupeTvLessons(result.docs);
    const start = (page - 1) * TV_LESSON_PAGE_SIZE;
    const hasNextPage = start + TV_LESSON_PAGE_SIZE < unique.length;

    return {
        docs: unique.slice(start, start + TV_LESSON_PAGE_SIZE),
        hasNextPage,
        nextPage: hasNextPage ? page + 1 : null,
        page,
    };
}

export function parseTvMonthParam(value?: string | null) {
    if (!value || !/^\d{4}-(0[1-9]|1[0-2])$/.test(value)) {
        return null;
    }

    return value;
}

export type TvDaySummary = Record<string, Array<{ title: string }>>;

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
        select: {
            title: true,
            type: true,
            startDate: true,
            workoutBlocks: true,
        },
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

    const byDay: Record<string, typeof result.docs> = {};

    for (const lesson of result.docs) {
        if (!lesson.startDate) continue;

        (byDay[toDateParam(new Date(lesson.startDate))] ??= []).push(lesson);
    }

    for (const [key, lessons] of Object.entries(byDay)) {
        summary[key] = dedupeTvLessons(lessons).map((lesson) => ({
            title: lesson.title || `Les ${lesson.id}`,
        }));
    }

    return summary;
}
