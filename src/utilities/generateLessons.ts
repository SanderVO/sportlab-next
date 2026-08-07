import type { Lesson, LessonTemplate } from "@/payload-types";
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

type TemplateScheduleRow = {
    dayOfWeek?: string;
    time?: string;
    endTime?: string;
};

const getLocalTime = (value: string | undefined) => {
    if (!value) return undefined;

    const time = new Date(value);
    return Number.isNaN(time.getTime())
        ? undefined
        : {
              hours: time.getHours(),
              minutes: time.getMinutes(),
          };
};

const buildWorkoutBlocks = (
    blocks: LessonTemplate["defaultWorkoutBlocks"],
): Lesson["workoutBlocks"] => {
    if (!Array.isArray(blocks)) return undefined;

    const normalizedBlocks = blocks
        .map((block) => ({
            workout: toNumericId(block.workout),
            duration:
                typeof block.duration === "number" ? block.duration : undefined,
            exercises: Array.isArray(block.exercises)
                ? block.exercises
                      .filter((exercise) => Boolean(exercise?.name))
                      .map((exercise) => ({
                          name: exercise.name ?? "",
                          description: exercise.description ?? undefined,
                          videoUrl: exercise.videoUrl ?? undefined,
                      }))
                : [],
        }))
        .filter((block) => block.workout != null)
        .map((block) => ({
            workout: block.workout as number,
            duration: block.duration,
            exercises: block.exercises,
        }));

    return normalizedBlocks.length > 0
        ? (normalizedBlocks as Lesson["workoutBlocks"])
        : undefined;
};

const getTemplateBackfillData = ({
    lesson,
    template,
    titleDate,
}: {
    lesson: Lesson;
    template: LessonTemplate;
    titleDate: string;
}) => {
    const lessonImage = toNumericId(lesson.image);
    const templateImage = toNumericId(template.image);
    const templateCoaches = Array.isArray(template.coaches)
        ? template.coaches
              .map((coach) => toNumericId(coach))
              .filter((id): id is number => typeof id === "number")
        : undefined;

    const templateWorkoutBlocks = buildWorkoutBlocks(
        template.defaultWorkoutBlocks,
    );

    const backfillData: Partial<Lesson> = {};

    if (!lesson.template && template.id) {
        backfillData.template = template.id;
    }

    if (!lesson.title) {
        backfillData.title = `${template.title} – ${titleDate}`;
    }

    if (!lesson.type) {
        backfillData.type = template.type;
    }

    if (
        typeof lesson.spots !== "number" &&
        typeof template.spots === "number"
    ) {
        backfillData.spots = template.spots;
    }

    if (lessonImage == null && templateImage != null) {
        backfillData.image = templateImage;
    }

    if (
        (!Array.isArray(lesson.coaches) || lesson.coaches.length === 0) &&
        templateCoaches &&
        templateCoaches.length > 0
    ) {
        backfillData.coaches = templateCoaches;
    }

    if (
        (!Array.isArray(lesson.workoutBlocks) ||
            lesson.workoutBlocks.length === 0) &&
        templateWorkoutBlocks
    ) {
        backfillData.workoutBlocks = templateWorkoutBlocks;
    }

    if (!lesson.status && lesson.type) {
        backfillData.status =
            lesson.type === "group" || lesson.type === "open_gym"
                ? "open"
                : "closed";
    } else if (!lesson.status && !lesson.type) {
        backfillData.status =
            template.type === "group" || template.type === "open_gym"
                ? "open"
                : "closed";
    }

    return backfillData;
};

/**
 * Generates lesson instances from active LessonTemplates for the next
 * `daysAhead` days. Idempotent — existing lessons for the same template
 * on the same calendar day are skipped.
 */
export async function generateLessons(
    payload: BasePayload,
    daysAhead = 31,
): Promise<{ created: number; updated: number; skipped: number }> {
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
    let updated = 0;
    let skipped = 0;

    for (const template of templates) {
        const scheduleRows = Array.isArray(template.schedule)
            ? (template.schedule as TemplateScheduleRow[])
            : [];

        if (scheduleRows.length === 0) continue;

        for (const slot of scheduleRows) {
            if (!slot.dayOfWeek) continue;

            const targetDay = DAY_MAP[slot.dayOfWeek];
            if (targetDay === undefined) continue;

            // Date fields used as time-only inputs are stored as ISO dates. Use
            // the local components here so the selected wall-clock time is
            // preserved both locally and on the UTC runtime.
            const startTime = getLocalTime(slot.time) ?? {
                hours: 9,
                minutes: 0,
            };
            const endTime = getLocalTime(slot.endTime);

            const cursor = new Date(startDate);

            while (cursor <= endDate) {
                if (cursor.getDay() === targetDay) {
                    const titleDate = cursor.toLocaleDateString("nl-NL", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                    });

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
                        const currentLesson = existing.docs[0] as Lesson;
                        const backfillData = getTemplateBackfillData({
                            lesson: currentLesson,
                            template,
                            titleDate,
                        });

                        if (Object.keys(backfillData).length > 0) {
                            await payload.update({
                                collection: "lessons",
                                id: currentLesson.id,
                                data: backfillData,
                                overrideAccess: true,
                            });
                            updated++;
                        } else {
                            skipped++;
                        }
                    } else {
                        const coaches = Array.isArray(template.coaches)
                            ? template.coaches
                                  .map((c) => toNumericId(c))
                                  .filter(
                                      (id): id is number =>
                                          typeof id === "number",
                                  )
                            : [];

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

    return { created, updated, skipped };
}
