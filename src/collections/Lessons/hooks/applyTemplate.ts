import { resolveLessonImage } from "@/utilities/resolveLessonImage";
import {
    CollectionBeforeChangeHook,
    CollectionBeforeValidateHook,
} from "payload";

type TemplateRelation =
    | { id?: string | number }
    | string
    | number
    | null
    | undefined;

type LessonData = {
    template?: TemplateRelation;
    title?: string;
    type?: string;
    image?: unknown;
    coaches?: unknown;
    workoutBlocks?: unknown;
};

type HookArgs = {
    data?: LessonData;
    req: Parameters<CollectionBeforeChangeHook>[0]["req"];
    operation: Parameters<CollectionBeforeChangeHook>[0]["operation"];
};

/**
 * On lesson create, if a template is selected and certain fields are empty,
 * copies title / type / image / coaches / default workout blocks from the
 * template.
 * This runs before resolveExercises so the copied exercises go through the
 * same externalId-resolution path.
 */
const applyTemplateValues = async ({ data, req, operation }: HookArgs) => {
    if (operation !== "create" || !data) return data;

    const normalizeRelationValue = (
        value: { id?: string | number } | string | number | null | undefined,
    ) => {
        if (value == null) return undefined;
        return typeof value === "object" ? value.id : value;
    };

    const templateId =
        typeof data.template === "object" ? data.template?.id : data.template;

    if (!templateId) return data;

    const template = await req.payload.findByID({
        collection: "lesson-templates",
        id: templateId,
        req,
        depth: 0,
        overrideAccess: true,
    });

    if (!template) return data;

    const resolvedImage = resolveLessonImage({
        lessonImage: data.image as Parameters<
            typeof resolveLessonImage
        >[0]["lessonImage"],
        templateImage: template.image,
    });

    const templateData = template as {
        defaultWorkoutBlocks?: Array<{
            workout?: { id?: string | number } | string | number | null;
            exercises?: Array<{
                exercise?: { id?: string | number } | string | number | null;
            }>;
        }>;
        defaultExercises?: Array<{
            workout?: { id?: string | number } | string | number | null;
            exercise: { id?: string | number } | string | number;
        }>;
    };

    let templateWorkoutBlocks = Array.isArray(templateData.defaultWorkoutBlocks)
        ? templateData.defaultWorkoutBlocks.map((block) => ({
              workout: normalizeRelationValue(block.workout),
              exercises: Array.isArray(block.exercises)
                  ? block.exercises
                        .map((item) => ({
                            exercise: normalizeRelationValue(item.exercise),
                        }))
                        .filter((item) => item.exercise != null)
                  : [],
          }))
        : [];

    // Backward compatibility for templates created with the old flat
    // defaultExercises field.
    if (
        templateWorkoutBlocks.length === 0 &&
        Array.isArray(templateData.defaultExercises)
    ) {
        const workoutBlocksMap = new Map<
            string | number,
            {
                workout: string | number;
                exercises: Array<{
                    exercise: string | number | undefined;
                }>;
            }
        >();

        for (const item of templateData.defaultExercises) {
            const workoutId = normalizeRelationValue(item.workout);
            if (!workoutId) continue;

            const current = workoutBlocksMap.get(workoutId) ?? {
                workout: workoutId,
                exercises: [],
            };

            current.exercises.push({
                exercise: normalizeRelationValue(item.exercise),
            });

            workoutBlocksMap.set(workoutId, current);
        }

        templateWorkoutBlocks = Array.from(workoutBlocksMap.values());
    }

    return {
        ...data,
        title: template.title,
        type: data.type || template.type,
        image: normalizeRelationValue(
            resolvedImage as { id?: string | number } | string | number,
        ),
        coaches:
            Array.isArray(data.coaches) && data.coaches.length > 0
                ? data.coaches
                : Array.isArray(template.coaches) && template.coaches.length > 0
                  ? template.coaches.map(
                        (c: { id?: string | number } | string | number) =>
                            typeof c === "object" ? c.id : c,
                    )
                  : data.coaches,
        workoutBlocks:
            Array.isArray(data.workoutBlocks) && data.workoutBlocks.length > 0
                ? data.workoutBlocks
                : templateWorkoutBlocks.length > 0
                  ? templateWorkoutBlocks
                  : data.workoutBlocks,
    };
};

export const applyTemplateBeforeValidate: CollectionBeforeValidateHook = async (
    args,
) => applyTemplateValues(args as HookArgs);

export const applyTemplate: CollectionBeforeChangeHook = async (args) =>
    applyTemplateValues(args as HookArgs);
