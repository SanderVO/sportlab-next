import { authenticated } from "@/access/authenticated";
import { isAdminOrCoach } from "@/access/isAdminOrCoach";
import { type CollectionConfig } from "payload";
import {
    applyTemplate,
    applyTemplateBeforeValidate,
} from "./hooks/applyTemplate";
import { resolveExercises } from "./hooks/parseExercisesCSV";
import { resolveCardImage } from "./hooks/resolveCardImage";

export const Lessons: CollectionConfig = {
    slug: "lessons",
    labels: {
        singular: "Les",
        plural: "Lessen",
    },
    access: {
        create: isAdminOrCoach,
        delete: isAdminOrCoach,
        read: authenticated,
        update: isAdminOrCoach,
    },
    admin: {
        useAsTitle: "title",
        defaultColumns: ["title", "type", "updatedAt", "startDate"],
    },
    hooks: {
        afterRead: [resolveCardImage],
        beforeValidate: [applyTemplateBeforeValidate],
        beforeChange: [applyTemplate, resolveExercises],
    },
    fields: [
        {
            label: "Sjabloon",
            name: "template",
            type: "relationship",
            relationTo: "lesson-templates",
            hasMany: false,
            required: false,
            admin: {
                description:
                    "Selecteer een sjabloon om type, coaches en standaard oefeningen automatisch over te nemen.",
                position: "sidebar",
            },
        },
        {
            label: "Titel",
            name: "title",
            type: "text",
            required: true,
            admin: {
                condition: (_, siblingData) => !siblingData?.template,
            },
        },
        {
            label: "Type",
            name: "type",
            type: "select",
            required: true,
            admin: {
                condition: (_, siblingData) => !siblingData?.template,
            },
            options: [
                {
                    label: "PT",
                    value: "pt",
                },
                {
                    label: "Semi PT",
                    value: "semi_pt",
                },
                {
                    label: "Groepslessen",
                    value: "group",
                },
                {
                    label: "Open Gym",
                    value: "open_gym",
                },
            ],
        },
        {
            label: "Status",
            name: "status",
            type: "select",
            required: true,
            defaultValue: "closed",
            options: [
                {
                    label: "Open",
                    value: "open",
                },
                {
                    label: "Closed",
                    value: "closed",
                },
            ],
            hooks: {
                beforeValidate: [
                    ({ data, value }) => {
                        if (data?.type === "pt" || data?.type === "semi_pt") {
                            return "closed";
                        }
                        return value;
                    },
                ],
            },
            admin: {
                condition: (_, siblingData) => {
                    return (
                        siblingData?.type === "group" ||
                        siblingData?.type === "open_gym"
                    );
                },
                description:
                    "PT en Semi PT lessen zijn altijd gesloten. Groepslessen en Open Gym kunnen open of gesloten zijn.",
            },
        },
        {
            label: "Startdatum & -tijd",
            name: "startDate",
            type: "date",
            required: false,
            admin: {
                condition: (_, siblingData) => !siblingData?.template,
                date: {
                    pickerAppearance: "dayAndTime",
                },
            },
        },
        {
            label: "Einddatum & -tijd",
            name: "endDate",
            type: "date",
            required: false,
            admin: {
                condition: (_, siblingData) => !siblingData?.template,
                date: {
                    pickerAppearance: "dayAndTime",
                },
            },
        },
        {
            label: "Afbeelding",
            name: "image",
            type: "upload",
            relationTo: "media",
            required: false,
            admin: {
                description:
                    "Optioneel: gebruikt in lesson cards. Als leeg, wordt de afbeelding van het gekoppelde sjabloon gebruikt.",
            },
        },
        {
            label: "Coaches",
            name: "coaches",
            type: "relationship",
            relationTo: "users",
            hasMany: true,
            required: false,
            filterOptions: {
                isCoach: {
                    equals: true,
                },
            },
            admin: {
                description: "Koppel een of meerdere coaches aan deze les.",
            },
        },
        {
            label: "Workoutblokken",
            name: "workoutBlocks",
            type: "array",
            required: false,
            labels: {
                singular: "Workoutblok",
                plural: "Workoutblokken",
            },
            admin: {
                description:
                    "Maak eerst workoutblokken aan in de gewenste volgorde. Voeg daarna oefeningen toe binnen elk blok.",
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
                    label: "Tijd (in minuten)",
                    name: "duration",
                    type: "number",
                    required: true,
                },
                {
                    label: "Oefeningen",
                    name: "exercises",
                    type: "array",
                    required: true,
                    fields: [
                        {
                            label: "Oefening",
                            name: "exercise",
                            type: "relationship",
                            relationTo: "exercises",
                            required: true,
                        },
                    ],
                },
            ],
        },
        {
            type: "ui",
            name: "exerciseImport",
            admin: {
                components: {
                    Field: "./collections/Lessons/components/ExerciseImportField#ExerciseImportField",
                },
                condition: (_, siblingData) =>
                    Array.isArray(siblingData?.workoutBlocks) &&
                    siblingData.workoutBlocks.length > 0,
            },
        },
        {
            // Hidden field: stores raw CSV text; rendered only by the UI component above.
            // The beforeChange hook reads and processes it on save.
            name: "exercisesCSVImport",
            type: "textarea",
            required: false,
            admin: {
                condition: () => false,
            },
        },
        {
            label: "Externe ID",
            name: "externalId",
            type: "text",
            unique: true,
            required: false,
            admin: {
                description:
                    "Gebruik dit veld om lessen idempotent te importeren via CSV.",
            },
        },
    ],
};
