import { adminCoachOrSelf } from "@/access/adminCoachOrSelf";
import { isAdminOrCoach } from "@/access/isAdminOrCoach";
import type { CollectionBeforeChangeHook, CollectionConfig } from "payload";

const initializeWorkoutProgress: CollectionBeforeChangeHook = async ({
    data,
    req,
    operation,
}) => {
    if ((operation !== "create" && operation !== "update") || !data) {
        return data;
    }

    const lessonId =
        typeof data.lesson === "object" ? data.lesson?.id : data.lesson;

    if (!lessonId) {
        return data;
    }

    if (
        Array.isArray(data.workoutProgress) &&
        data.workoutProgress.length > 0
    ) {
        return data;
    }

    const lesson = await req.payload.findByID({
        collection: "lessons",
        id: lessonId,
        req,
        depth: 0,
        overrideAccess: true,
    });

    const workoutBlocks = Array.isArray(lesson?.workoutBlocks)
        ? lesson.workoutBlocks
        : [];

    const workoutProgress = [];

    for (const block of workoutBlocks) {
        const workoutId =
            typeof block?.workout === "object"
                ? block.workout?.id
                : block?.workout;

        if (!workoutId) continue;

        const lessonBlockExercises = Array.isArray((block as any)?.exercises)
            ? (block as any).exercises
            : [];

        let workoutExercises = lessonBlockExercises;

        if (workoutExercises.length === 0) {
            const workout = await req.payload.findByID({
                collection: "workouts",
                id: workoutId,
                req,
                depth: 0,
                overrideAccess: true,
            });

            workoutExercises = Array.isArray(workout?.exercises)
                ? workout.exercises
                : [];
        }

        workoutProgress.push({
            workout: workoutId,
            exercises: workoutExercises
                .filter((exercise: any) => Boolean(exercise?.name))
                .map((exercise: any) => ({
                    exerciseName: exercise.name,
                    exerciseExternalId: exercise.externalId || undefined,
                })),
        });
    }

    return {
        ...data,
        workoutProgress,
    };
};

export const LessonEnrollments: CollectionConfig = {
    slug: "lesson-enrollments",
    labels: {
        singular: "Les Deelname",
        plural: "Les Deelnames",
    },
    access: {
        create: isAdminOrCoach,
        delete: isAdminOrCoach,
        read: adminCoachOrSelf,
        update: adminCoachOrSelf,
    },
    admin: {
        useAsTitle: "id",
        defaultColumns: ["user", "lesson", "status", "updatedAt"],
    },
    hooks: {
        beforeChange: [initializeWorkoutProgress],
    },
    fields: [
        {
            label: "Gebruiker",
            name: "user",
            type: "relationship",
            relationTo: "users",
            required: true,
        },
        {
            label: "Les",
            name: "lesson",
            type: "relationship",
            relationTo: "lessons",
            required: true,
        },
        {
            label: "Status",
            name: "status",
            type: "select",
            required: true,
            defaultValue: "assigned",
            options: [
                { label: "Toegewezen", value: "assigned" },
                { label: "Gestart", value: "started" },
                { label: "Afgerond", value: "completed" },
                { label: "Geannuleerd", value: "cancelled" },
            ],
        },
        {
            label: "Workout voortgang",
            name: "workoutProgress",
            type: "array",
            required: false,
            admin: {
                description:
                    "Per gebruiker ingevulde reps, sets en notes per oefening. Wordt automatisch gevuld vanuit de les.",
            },
            fields: [
                {
                    label: "Workout",
                    name: "workout",
                    type: "relationship",
                    relationTo: "workouts",
                    required: true,
                },
                {
                    label: "Oefeningen",
                    name: "exercises",
                    type: "array",
                    required: false,
                    fields: [
                        {
                            label: "Oefening naam",
                            name: "exerciseName",
                            type: "text",
                            required: true,
                        },
                        {
                            label: "Externe ID",
                            name: "exerciseExternalId",
                            type: "text",
                            required: false,
                        },
                        {
                            label: "Sets",
                            name: "sets",
                            type: "number",
                            required: false,
                        },
                        {
                            label: "Reps",
                            name: "reps",
                            type: "text",
                            required: false,
                        },
                        {
                            label: "Notities",
                            name: "notes",
                            type: "textarea",
                            required: false,
                        },
                    ],
                },
            ],
        },
        {
            label: "Toegevoegd door",
            name: "addedBy",
            type: "relationship",
            relationTo: "users",
            required: false,
            admin: {
                readOnly: true,
                description: "Wordt automatisch gezet via een hook.",
            },
            hooks: {
                beforeChange: [
                    ({ req, value }) => {
                        if (value) return value;
                        return req.user?.id;
                    },
                ],
            },
        },
    ],
    indexes: [
        {
            fields: ["user", "lesson"],
            unique: true,
        },
    ],
};
