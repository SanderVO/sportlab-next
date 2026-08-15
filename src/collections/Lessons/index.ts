import { authenticated } from "@/access/authenticated";
import { isAdminOrCoach } from "@/access/isAdminOrCoach";
import { type CollectionConfig } from "payload";
import {
    applyTemplate,
    applyTemplateBeforeValidate,
} from "./hooks/applyTemplate";
import { resolveCardImage } from "./hooks/resolveCardImage";
import { syncExerciseTrackingOnLessonUpdate } from "./hooks/syncExerciseTrackingOnLessonUpdate";

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
        afterChange: [syncExerciseTrackingOnLessonUpdate],
        afterRead: [resolveCardImage],
        beforeValidate: [applyTemplateBeforeValidate],
        beforeChange: [applyTemplate],
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
            label: "Aantal plekken",
            name: "spots",
            type: "number",
            required: false,
            admin: {
                condition: (_, siblingData) => !siblingData?.template,
                description:
                    "Optioneel: het aantal beschikbare plekken voor deze les.",
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
                    "Maak workoutblokken aan in de gewenste volgorde en vul per blok de workoutgegevens en oefeningen in.",
            },
            fields: [
                {
                    label: "Workout naam",
                    name: "name",
                    type: "text",
                    required: true,
                },
                {
                    label: "Workout omschrijving",
                    name: "description",
                    type: "textarea",
                    required: false,
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
                    required: false,
                    labels: {
                        singular: "Oefening",
                        plural: "Oefeningen",
                    },
                    fields: [
                        {
                            label: "Naam",
                            name: "name",
                            type: "text",
                            required: true,
                        },
                        {
                            label: "Omschrijving",
                            name: "description",
                            type: "textarea",
                            required: false,
                        },
                    ],
                },
            ],
        },
    ],
};
