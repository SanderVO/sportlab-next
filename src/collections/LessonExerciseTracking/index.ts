import { adminCoachOrSelf } from "@/access/adminCoachOrSelf";
import { isAdminOrCoach } from "@/access/isAdminOrCoach";
import { buildTrackingWorkoutBlocks } from "@/utilities/lessonExerciseTracking";
import type { CollectionBeforeChangeHook, CollectionConfig } from "payload";

const initializeExerciseTracking: CollectionBeforeChangeHook = async ({
    data,
    req,
    operation,
}) => {
    if ((operation !== "create" && operation !== "update") || !data) {
        return data;
    }

    if (
        Array.isArray((data as { workoutBlocks?: unknown[] }).workoutBlocks) &&
        (data as { workoutBlocks?: unknown[] }).workoutBlocks!.length > 0
    ) {
        return data;
    }

    const lessonId =
        typeof data.lesson === "object" ? data.lesson?.id : data.lesson;

    if (!lessonId) {
        return data;
    }

    const lesson = await req.payload.findByID({
        collection: "lessons",
        id: lessonId,
        req,
        depth: 0,
        overrideAccess: true,
    });

    const workoutBlocks = buildTrackingWorkoutBlocks(
        (lesson as { workoutBlocks?: unknown[] })?.workoutBlocks,
    );

    return {
        ...data,
        workoutBlocks,
    };
};

export const LessonExerciseTracking: CollectionConfig = {
    slug: "lesson-exercise-tracking",
    labels: {
        singular: {
            en: "Lesson exercise progress",
            nl: "Les oefening voortgang",
        },
        plural: {
            en: "Lesson exercise progress",
            nl: "Les oefening voortgang",
        },
    },
    access: {
        create: isAdminOrCoach,
        delete: isAdminOrCoach,
        read: adminCoachOrSelf,
        update: adminCoachOrSelf,
    },
    admin: {
        useAsTitle: "id",
        defaultColumns: ["user", "lesson", "updatedAt"],
    },
    hooks: {
        beforeChange: [initializeExerciseTracking],
    },
    fields: [
        {
            label: { en: "User", nl: "Gebruiker" },
            name: "user",
            type: "relationship",
            relationTo: "users",
            required: true,
        },
        {
            label: { en: "Lesson", nl: "Les" },
            name: "lesson",
            type: "relationship",
            relationTo: "lessons",
            required: true,
        },
        {
            label: { en: "Workout blocks", nl: "Workoutblokken" },
            name: "workoutBlocks",
            type: "array",
            required: false,
            admin: {
                description: {
                    en: "Sets, reps, and notes entered by the user for each exercise in a lesson.",
                    nl: "Per gebruiker ingevulde sets, reps en notities per oefening in een les.",
                },
            },
            fields: [
                {
                    label: {
                        en: "Lesson workout block ID",
                        nl: "Les workoutblok ID",
                    },
                    name: "lessonBlockId",
                    type: "text",
                    required: true,
                    admin: {
                        readOnly: true,
                    },
                },
                {
                    label: { en: "Workout name", nl: "Workout naam" },
                    name: "workoutName",
                    type: "text",
                    required: true,
                    admin: {
                        readOnly: true,
                    },
                },
                {
                    label: {
                        en: "Workout description",
                        nl: "Workout omschrijving",
                    },
                    name: "workoutDescription",
                    type: "textarea",
                    required: false,
                    admin: {
                        readOnly: true,
                    },
                },
                {
                    label: { en: "Time (minutes)", nl: "Tijd (in minuten)" },
                    name: "duration",
                    type: "number",
                    required: false,
                    admin: {
                        readOnly: true,
                    },
                },
                {
                    label: { en: "Exercises", nl: "Oefeningen" },
                    name: "exercises",
                    type: "array",
                    required: false,
                    fields: [
                        {
                            label: {
                                en: "Lesson exercise ID",
                                nl: "Les oefening ID",
                            },
                            name: "lessonExerciseId",
                            type: "text",
                            required: true,
                            admin: {
                                readOnly: true,
                            },
                        },
                        {
                            label: { en: "Exercise name", nl: "Oefening naam" },
                            name: "exerciseName",
                            type: "text",
                            required: true,
                            admin: {
                                readOnly: true,
                            },
                        },
                        {
                            label: {
                                en: "Exercise description",
                                nl: "Oefening omschrijving",
                            },
                            name: "exerciseDescription",
                            type: "textarea",
                            required: false,
                            admin: {
                                readOnly: true,
                            },
                        },
                        {
                            label: { en: "Sets", nl: "Sets" },
                            name: "sets",
                            type: "number",
                            required: false,
                        },
                        {
                            label: { en: "Reps", nl: "Reps" },
                            name: "reps",
                            type: "text",
                            required: false,
                        },
                        {
                            label: { en: "Notes", nl: "Notities" },
                            name: "notes",
                            type: "textarea",
                            required: false,
                        },
                        {
                            label: { en: "Completed", nl: "Afgerond" },
                            name: "completed",
                            type: "checkbox",
                            required: false,
                            defaultValue: false,
                        },
                    ],
                },
            ],
        },
        {
            label: { en: "Updated at", nl: "Bijgewerkt op" },
            name: "lastLoggedAt",
            type: "date",
            required: false,
            admin: {
                date: {
                    pickerAppearance: "dayAndTime",
                },
                description: {
                    en: "Optional: the last time this user updated their progress.",
                    nl: "Optioneel: laatste keer dat deze gebruiker progressie heeft bijgewerkt.",
                },
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
