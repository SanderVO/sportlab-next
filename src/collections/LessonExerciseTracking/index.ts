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
        singular: "Les Oefening Voortgang",
        plural: "Les Oefening Voortgang",
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
            label: "Workoutblokken",
            name: "workoutBlocks",
            type: "array",
            required: false,
            admin: {
                description:
                    "Per gebruiker ingevulde sets, reps en notities per oefening in een les.",
            },
            fields: [
                {
                    label: "Les workoutblok ID",
                    name: "lessonBlockId",
                    type: "text",
                    required: true,
                    admin: {
                        readOnly: true,
                    },
                },
                {
                    label: "Workout naam",
                    name: "workoutName",
                    type: "text",
                    required: true,
                    admin: {
                        readOnly: true,
                    },
                },
                {
                    label: "Workout omschrijving",
                    name: "workoutDescription",
                    type: "textarea",
                    required: false,
                    admin: {
                        readOnly: true,
                    },
                },
                {
                    label: "Tijd (in minuten)",
                    name: "duration",
                    type: "number",
                    required: false,
                    admin: {
                        readOnly: true,
                    },
                },
                {
                    label: "Oefeningen",
                    name: "exercises",
                    type: "array",
                    required: false,
                    fields: [
                        {
                            label: "Les oefening ID",
                            name: "lessonExerciseId",
                            type: "text",
                            required: true,
                            admin: {
                                readOnly: true,
                            },
                        },
                        {
                            label: "Oefening naam",
                            name: "exerciseName",
                            type: "text",
                            required: true,
                            admin: {
                                readOnly: true,
                            },
                        },
                        {
                            label: "Oefening omschrijving",
                            name: "exerciseDescription",
                            type: "textarea",
                            required: false,
                            admin: {
                                readOnly: true,
                            },
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
                        {
                            label: "Afgerond",
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
            label: "Bijgewerkt op",
            name: "lastLoggedAt",
            type: "date",
            required: false,
            admin: {
                date: {
                    pickerAppearance: "dayAndTime",
                },
                description:
                    "Optioneel: laatste keer dat deze gebruiker progressie heeft bijgewerkt.",
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
