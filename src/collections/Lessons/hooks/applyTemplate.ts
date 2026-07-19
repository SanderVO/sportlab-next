import { CollectionBeforeChangeHook } from "payload";

/**
 * On lesson create, if a template is selected and certain fields are
 * empty, copies type / coaches / defaultExercises from the template.
 * This runs before resolveExercises so the copied exercises go through
 * the same externalId-resolution path.
 */
export const applyTemplate: CollectionBeforeChangeHook = async ({
    data,
    req,
    operation,
}) => {
    if (operation !== "create") return data;

    const templateId =
        typeof data?.template === "object" ? data.template?.id : data?.template;

    if (!templateId) return data;

    const template = await req.payload.findByID({
        collection: "lesson-templates",
        id: templateId,
        req,
        overrideAccess: true,
    });

    if (!template) return data;

    // Only fill fields that are absent / empty in the new lesson
    return {
        ...data,
        type: data.type || template.type,
        coaches:
            Array.isArray(data.coaches) && data.coaches.length > 0
                ? data.coaches
                : Array.isArray(template.coaches) && template.coaches.length > 0
                  ? template.coaches.map(
                        (c: { id: string | number } | string | number) =>
                            typeof c === "object" ? c.id : c,
                    )
                  : data.coaches,
        exercises:
            Array.isArray(data.exercises) && data.exercises.length > 0
                ? data.exercises
                : Array.isArray(template.defaultExercises) &&
                    template.defaultExercises.length > 0
                  ? template.defaultExercises.map(
                        (e: {
                            exercise: { id: string | number } | string | number;
                            sets?: number | null;
                            reps?: string | null;
                            notes?: string | null;
                        }) => ({
                            exercise:
                                typeof e.exercise === "object"
                                    ? e.exercise.id
                                    : e.exercise,
                            sets: e.sets ?? undefined,
                            reps: e.reps ?? undefined,
                            notes: e.notes ?? undefined,
                        }),
                    )
                  : data.exercises,
    };
};
