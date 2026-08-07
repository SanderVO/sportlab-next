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
    spots?: number | null;
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
        spots?: number | null;
        defaultWorkoutBlocks?: Array<{
            workout?: { id?: string | number } | string | number | null;
            duration?: number | null;
            exercises?: Array<{
                name?: string | null;
                description?: string | null;
                videoUrl?: string | null;
                externalId?: string | null;
            }>;
        }>;
    };

    let templateWorkoutBlocks = Array.isArray(templateData.defaultWorkoutBlocks)
        ? templateData.defaultWorkoutBlocks.map((block) => ({
              workout: normalizeRelationValue(block.workout),
              duration:
                  typeof block.duration === "number"
                      ? block.duration
                      : undefined,
              exercises: Array.isArray(block.exercises)
                  ? block.exercises
                        .filter((exercise) => Boolean(exercise?.name))
                        .map((exercise) => ({
                            name: exercise.name ?? "",
                            description: exercise.description ?? undefined,
                            videoUrl: exercise.videoUrl ?? undefined,
                            externalId: exercise.externalId ?? undefined,
                        }))
                  : [],
          }))
        : [];

    templateWorkoutBlocks = templateWorkoutBlocks.filter(
        (block) => block.workout != null,
    );

    return {
        ...data,
        title: template.title,
        type: data.type || template.type,
        spots: typeof data.spots === "number" ? data.spots : templateData.spots,
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
