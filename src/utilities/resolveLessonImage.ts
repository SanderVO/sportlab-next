import type { Lesson, LessonTemplate } from "@/payload-types";

type RelationValue =
    | { id: string | number }
    | string
    | number
    | null
    | undefined;

type TemplateRelation = Lesson["template"];
type LessonImage = Lesson["image"];

/**
 * Returns the lesson image when set, otherwise the template image.
 * This is the single source of truth for lesson-card image precedence.
 */
export const resolveLessonImage = ({
    lessonImage,
    templateImage,
}: {
    lessonImage: LessonImage | null | undefined;
    templateImage: LessonImage | null | undefined;
}): LessonImage | undefined => {
    return lessonImage || templateImage || undefined;
};

/**
 * Extracts template image when a template relationship is populated.
 */
export const getTemplateImageFromRelation = (
    template:
        | TemplateRelation
        | Pick<LessonTemplate, "image">
        | null
        | undefined,
): LessonImage | undefined => {
    if (!template || typeof template !== "object") return undefined;

    if (!("image" in template)) return undefined;

    return template.image;
};

/**
 * Extracts the relation ID from string/number/object relationship values.
 */
export const getRelationId = (
    value: RelationValue,
): string | number | undefined => {
    if (value == null) return undefined;
    return typeof value === "object" ? value.id : value;
};
