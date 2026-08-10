import {
    buildTrackingWorkoutBlocks,
    mergeTrackingWorkoutBlocks,
} from "@/utilities/lessonExerciseTracking";
import type { CollectionAfterChangeHook } from "payload";

export const syncExerciseTrackingOnLessonUpdate: CollectionAfterChangeHook =
    async ({ doc, previousDoc, req, operation }) => {
        if (operation !== "update") {
            return doc;
        }

        const lessonId = doc.id;

        if (!lessonId) {
            return doc;
        }

        const workoutBlocksChanged =
            JSON.stringify(
                (doc as { workoutBlocks?: unknown[] }).workoutBlocks ?? [],
            ) !==
            JSON.stringify(
                (previousDoc as { workoutBlocks?: unknown[] } | undefined)
                    ?.workoutBlocks ?? [],
            );

        if (!workoutBlocksChanged) {
            return doc;
        }

        const nextWorkoutBlocks = buildTrackingWorkoutBlocks(
            (doc as { workoutBlocks?: unknown[] }).workoutBlocks,
        );

        let page = 1;

        while (true) {
            const trackingPage = await req.payload.find({
                collection: "lesson-exercise-tracking",
                where: {
                    lesson: {
                        equals: lessonId,
                    },
                },
                page,
                limit: 100,
                depth: 0,
                overrideAccess: true,
                req,
            });

            for (const trackingDoc of trackingPage.docs) {
                const mergedWorkoutBlocks = mergeTrackingWorkoutBlocks(
                    nextWorkoutBlocks,
                    (trackingDoc as { workoutBlocks?: unknown[] })
                        .workoutBlocks,
                );

                await req.payload.update({
                    collection: "lesson-exercise-tracking",
                    id: trackingDoc.id,
                    data: {
                        workoutBlocks: mergedWorkoutBlocks,
                    },
                    overrideAccess: true,
                    req,
                });
            }

            if (!trackingPage.hasNextPage) {
                break;
            }

            page += 1;
        }

        return doc;
    };
