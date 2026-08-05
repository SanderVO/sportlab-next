import type { Lesson } from "@/payload-types";
import {
    getRelationId,
    getTemplateImageFromRelation,
    resolveLessonImage,
} from "@/utilities/resolveLessonImage";
import type { CollectionAfterReadHook } from "payload";

type LessonImage = Lesson["image"];
type LessonTemplateRelation = Lesson["template"];

/**
 * Ensures lesson cards always have an image:
 * lesson.image takes precedence, otherwise fallback to template.image.
 */
export const resolveCardImage: CollectionAfterReadHook = async ({
    doc,
    req,
}) => {
    if (!doc) return doc;

    const lessonImage = (doc as { image?: LessonImage }).image;
    const templateValue = (doc as { template?: LessonTemplateRelation })
        .template;

    const imageFromPopulatedTemplate = resolveLessonImage({
        lessonImage,
        templateImage: getTemplateImageFromRelation(templateValue),
    });

    if (imageFromPopulatedTemplate) {
        return {
            ...doc,
            image: imageFromPopulatedTemplate,
        };
    }

    if (!templateValue) return doc;

    const templateId = getRelationId(templateValue);
    if (!templateId) return doc;

    try {
        const template = await req.payload.findByID({
            collection: "lesson-templates",
            id: templateId,
            req,
            overrideAccess: true,
            depth: 0,
        });

        const resolvedImage = resolveLessonImage({
            lessonImage,
            templateImage: template?.image,
        });

        if (resolvedImage) {
            return {
                ...doc,
                image: resolvedImage,
            };
        }
    } catch {
        // Swallow fallback resolution errors; lessons can render without image.
    }

    return doc;
};
