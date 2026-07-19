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

/**
 * Generates lesson instances from active LessonTemplates for the next
 * `daysAhead` days. Idempotent — existing lessons for the same template
 * on the same calendar day are skipped.
 */
export async function generateLessons(
    payload: BasePayload,
    daysAhead = 31,
): Promise<{ created: number; skipped: number }> {
    const templates = await payload.find({
        collection: "lesson-templates",
        where: { isActive: { equals: true } },
        limit: 200,
        overrideAccess: true,
    });

    const now = new Date();
    // Start from tomorrow so we never accidentally backfill today
    const startDate = new Date(now);
    startDate.setDate(startDate.getDate() + 1);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + daysAhead);

    let created = 0;
    let skipped = 0;

    for (const template of templates.docs) {
        const scheduleRows = Array.isArray(template.schedule)
            ? (template.schedule as Array<{
                  dayOfWeek?: string;
                  time?: string;
              }>)
            : [];

        if (scheduleRows.length === 0) continue;

        for (const slot of scheduleRows) {
            if (!slot.dayOfWeek) continue;

            const targetDay = DAY_MAP[slot.dayOfWeek];
            if (targetDay === undefined) continue;

            // Extract hours/minutes from the stored time ISO string (UTC)
            let hours = 9;
            let minutes = 0;
            if (slot.time) {
                const t = new Date(slot.time);
                hours = t.getUTCHours();
                minutes = t.getUTCMinutes();
            }

            const cursor = new Date(startDate);

            while (cursor <= endDate) {
                if (cursor.getDay() === targetDay) {
                    const lessonDate = new Date(cursor);
                    lessonDate.setHours(hours, minutes, 0, 0);

                    // Check for an existing lesson tied to this template on this day at this time
                    const dayStart = new Date(lessonDate);
                    dayStart.setHours(0, 0, 0, 0);
                    const dayEnd = new Date(lessonDate);
                    dayEnd.setHours(23, 59, 59, 999);

                    const existing = await payload.find({
                        collection: "lessons",
                        where: {
                            and: [
                                { template: { equals: template.id } },
                                {
                                    date: {
                                        greater_than_equal:
                                            dayStart.toISOString(),
                                    },
                                },
                                {
                                    date: {
                                        less_than_equal: dayEnd.toISOString(),
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
                            ? template.coaches.map((c) =>
                                  typeof c === "object" && c !== null
                                      ? (c as { id: string | number }).id
                                      : c,
                              )
                            : [];

                        const titleDate = lessonDate.toLocaleDateString(
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
                                type: template.type as string,
                                date: lessonDate.toISOString(),
                                coaches,
                                template: template.id,
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
