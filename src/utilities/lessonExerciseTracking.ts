type LessonExercise = {
    id?: string;
    name?: string | null;
    description?: string | null;
    videoUrl?: string | null;
};

type LessonWorkoutBlock = {
    id?: string;
    name?: string | null;
    description?: string | null;
    duration?: number | null;
    exercises?: LessonExercise[];
};

type TrackingExercise = {
    lessonExerciseId: string;
    exerciseName: string;
    exerciseDescription?: string;
    videoUrl?: string;
    sets?: number;
    reps?: string;
    notes?: string;
    completed?: boolean;
};

type TrackingWorkoutBlock = {
    lessonBlockId: string;
    workoutName: string;
    workoutDescription?: string;
    duration?: number;
    exercises: TrackingExercise[];
};

export function buildTrackingWorkoutBlocks(
    lessonWorkoutBlocks: unknown,
): TrackingWorkoutBlock[] {
    const blocks = Array.isArray(lessonWorkoutBlocks)
        ? (lessonWorkoutBlocks as LessonWorkoutBlock[])
        : [];

    return blocks
        .filter((block) => Boolean(block?.name))
        .map((block, blockIndex) => ({
            lessonBlockId: block.id || `block-${blockIndex + 1}`,
            workoutName: block.name || "Workout",
            workoutDescription: block.description || undefined,
            duration:
                typeof block.duration === "number" ? block.duration : undefined,
            exercises: Array.isArray(block.exercises)
                ? block.exercises
                      .filter((exercise) => Boolean(exercise?.name))
                      .map((exercise, exerciseIndex) => ({
                          lessonExerciseId:
                              exercise.id ||
                              `${block.id || `block-${blockIndex + 1}`}-exercise-${exerciseIndex + 1}`,
                          exerciseName: exercise.name || "Oefening",
                          exerciseDescription:
                              exercise.description || undefined,
                          videoUrl: exercise.videoUrl || undefined,
                      }))
                : [],
        }));
}

export function mergeTrackingWorkoutBlocks(
    nextBlocks: TrackingWorkoutBlock[],
    existingBlocks: unknown,
): TrackingWorkoutBlock[] {
    const existing = Array.isArray(existingBlocks)
        ? (existingBlocks as TrackingWorkoutBlock[])
        : [];

    const existingByBlock = new Map(
        existing.map((block) => [block.lessonBlockId, block]),
    );

    return nextBlocks.map((nextBlock) => {
        const existingBlock = existingByBlock.get(nextBlock.lessonBlockId);
        const existingExercises = Array.isArray(existingBlock?.exercises)
            ? existingBlock.exercises
            : [];

        const existingByExercise = new Map(
            existingExercises.map((exercise) => [
                exercise.lessonExerciseId,
                exercise,
            ]),
        );

        return {
            ...nextBlock,
            exercises: nextBlock.exercises.map((exercise) => {
                const existingExercise = existingByExercise.get(
                    exercise.lessonExerciseId,
                );

                if (!existingExercise) {
                    return exercise;
                }

                return {
                    ...exercise,
                    sets: existingExercise.sets,
                    reps: existingExercise.reps,
                    notes: existingExercise.notes,
                    completed: existingExercise.completed,
                };
            }),
        };
    });
}
