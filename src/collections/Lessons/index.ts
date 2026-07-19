import { authenticated } from "@/access/authenticated";
import { isAdminOrCoach } from "@/access/isAdminOrCoach";
import { slugField, type CollectionConfig } from "payload";
import { applyTemplate } from "./hooks/applyTemplate";
import { resolveExercises } from "./hooks/parseExercisesCSV";

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
        defaultColumns: ["title", "type", "updatedAt"],
    },
    hooks: {
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
        },
        {
            label: "Type",
            name: "type",
            type: "select",
            required: true,
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
                    ({ data }) => {
                        if (data?.type === "pt" || data?.type === "semi_pt") {
                            data.status = "closed";
                        }
                        return data;
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
            label: "Datum & Tijd",
            name: "date",
            type: "date",
            required: false,
            admin: {
                date: {
                    pickerAppearance: "dayAndTime",
                },
            },
        },
        {
            label: "Coaches",
            name: "coaches",
            type: "relationship",
            relationTo: "users",
            hasMany: true,
            required: true,
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
            type: "ui",
            name: "exerciseImport",
            admin: {
                components: {
                    Field: "./collections/Lessons/components/ExerciseImportField#ExerciseImportField",
                },
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
            label: "Oefeningen",
            name: "exercises",
            type: "array",
            required: false,
            fields: [
                {
                    label: "Oefening",
                    name: "exercise",
                    type: "relationship",
                    relationTo: "exercises",
                    required: true,
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
        slugField({
            required: false,
            useAsSlug: "title",
        }),
    ],
};
