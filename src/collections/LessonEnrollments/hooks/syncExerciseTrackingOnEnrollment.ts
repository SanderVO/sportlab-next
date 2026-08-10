import type { CollectionAfterChangeHook } from "payload";

const toRelationId = (
    value: { id?: string | number } | string | number | null | undefined,
): string | number | undefined => {
    if (value == null) return undefined;
    return typeof value === "object" ? value.id : value;
};

export const syncExerciseTrackingOnEnrollment: CollectionAfterChangeHook =
    async ({ doc, req, operation }) => {
        if (operation !== "create" && operation !== "update") {
            return doc;
        }

        const userId = toRelationId(
            (doc as { user?: { id?: string | number } | string | number }).user,
        );
        const lessonId = toRelationId(
            (doc as { lesson?: { id?: string | number } | string | number })
                .lesson,
        );

        if (!userId || !lessonId) {
            return doc;
        }

        const existing = await req.payload.find({
            collection: "lesson-exercise-tracking",
            where: {
                and: [
                    { user: { equals: userId } },
                    { lesson: { equals: lessonId } },
                ],
            },
            limit: 1,
            depth: 0,
            overrideAccess: true,
            req,
        });

        if (existing.docs.length === 0) {
            await req.payload.create({
                collection: "lesson-exercise-tracking",
                data: {
                    user: userId,
                    lesson: lessonId,
                },
                overrideAccess: true,
                req,
            });
        }

        return doc;
    };
