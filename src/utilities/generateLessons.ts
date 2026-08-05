import type { LessonTemplate } from "@/payload-types";
import { BasePayload } from "payload";

const DAY_MAP: Record<string, number> = {
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
};

const toNumericId = (
    value: { id: string | number } | string | number | null | undefined,
): number | undefined => {
    const raw = typeof value === "object" && value !== null ? value.id : value;

    if (typeof raw === "number") return raw;

    if (typeof raw === "string") {
        const parsed = Number(raw);
        return Number.isNaN(parsed) ? undefined : parsed;
    }

    return undefined;
};

/**
 * Generates lesson instances from active LessonTemplates for the next
 * `daysAhead` days. Idempotent — existing lessons for the same template
 * on the same calendar day are skipped.
 */
export async function generateLessons(
    payload: BasePayload,
    daysAhead = 31,
): Promise<{ created: number; skipped: number }> {
    const templates: LessonTemplate[] = [];
    let templatePage = 1;

    while (true) {
        const page = await payload.find({
            collection: "lesson-templates",
            where: { isActive: { equals: true } },
            page: templatePage,
            limit: 200,
            depth: 0,
            overrideAccess: true,
        });

        templates.push(...(page.docs as LessonTemplate[]));
        if (!page.hasNextPage) break;
        templatePage++;
    }

    const now = new Date();
    // Start from tomorrow so we never accidentally backfill today
    const startDate = new Date(now);
    startDate.setDate(startDate.getDate() + 1);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + daysAhead);

    let created = 0;
    let skipped = 0;

    for (const template of templates) {
        const scheduleRows = Array.isArray(template.schedule)
            ? (template.schedule as Array<{
                  dayOfWeek?: string;
                  time?: string;
                  endTime?: string;
              }>)
            : [];

        if (scheduleRows.length === 0) continue;

        for (const slot of scheduleRows) {
            if (!slot.dayOfWeek) continue;

            const targetDay = DAY_MAP[slot.dayOfWeek];
            if (targetDay === undefined) continue;

            // Date fields used as time-only inputs are stored as ISO dates. Use
            // the local components here so the selected wall-clock time is
            // preserved both locally and on the UTC runtime.
            const getTime = (value: string | undefined) => {
                if (!value) return undefined;

                const time = new Date(value);
                return Number.isNaN(time.getTime())
                    ? undefined
                    : {
                          hours: time.getHours(),
                          minutes: time.getMinutes(),
                      };
            };

            const startTime = getTime(slot.time) ?? { hours: 9, minutes: 0 };
            const endTime = getTime(slot.endTime);

            const cursor = new Date(startDate);

            while (cursor <= endDate) {
                if (cursor.getDay() === targetDay) {
                    const startDate = new Date(cursor);
                    startDate.setHours(
                        startTime.hours,
                        startTime.minutes,
                        0,
                        0,
                    );

                    const endDate = endTime ? new Date(cursor) : undefined;
                    endDate?.setHours(
                        endTime?.hours ?? 0,
                        endTime?.minutes ?? 0,
                        0,
                        0,
                    );

                    const existing = await payload.find({
                        collection: "lessons",
                        where: {
                            and: [
                                { template: { equals: template.id } },
                                {
                                    startDate: {
                                        equals: startDate.toISOString(),
                                    },
                                },
                            ],
                        },
                        limit: 1,
                        overrideAccess: true,
                    });

                    if (existing.docs.length > 0) {
                        skipped++;
                    } else {
                        const coaches = Array.isArray(template.coaches)
                            ? template.coaches
                                  .map((c) => toNumericId(c))
                                  .filter(
                                      (id): id is number =>
                                          typeof id === "number",
                                  )
                            : [];

                        const titleDate = startDate.toLocaleDateString(
                            "nl-NL",
                            {
                                weekday: "long",
                                day: "numeric",
                                month: "long",
                            },
                        );

                        await payload.create({
                            collection: "lessons",
                            data: {
                                title: `${template.title} – ${titleDate}`,
                                type: template.type,
                                startDate: startDate.toISOString(),
                                endDate: endDate?.toISOString(),
                                coaches,
                                template: template.id,
                                image: toNumericId(template.image),
                                status:
                                    template.type === "group" ||
                                    template.type === "open_gym"
                                        ? "open"
                                        : "closed",
                            },
                            overrideAccess: true,
                        });

                        created++;
                    }
                }

                cursor.setDate(cursor.getDate() + 1);
            }
        }
    }

    return { created, skipped };
}
