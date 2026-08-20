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
        singular: { en: "Lesson", nl: "Les" },
        plural: { en: "Lessons", nl: "Lessen" },
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
            label: { en: "Template", nl: "Sjabloon" },
            name: "template",
            type: "relationship",
            relationTo: "lesson-templates",
            hasMany: false,
            required: false,
            admin: {
                description: {
                    en: "Select a template to automatically apply its type, coaches, and default exercises.",
                    nl: "Selecteer een sjabloon om type, coaches en standaard oefeningen automatisch over te nemen.",
                },
                position: "sidebar",
            },
        },
        {
            label: { en: "Title", nl: "Titel" },
            name: "title",
            type: "text",
            required: true,
            admin: {
                condition: (_, siblingData) => !siblingData?.template,
            },
        },
        {
            label: { en: "Type", nl: "Type" },
            name: "type",
            type: "select",
            required: true,
            admin: {
                condition: (_, siblingData) => !siblingData?.template,
            },
            options: [
                {
                    label: { en: "PT", nl: "PT" },
                    value: "pt",
                },
                {
                    label: { en: "Semi PT", nl: "Semi PT" },
                    value: "semi_pt",
                },
                {
                    label: { en: "Group lessons", nl: "Groepslessen" },
                    value: "group",
                },
                {
                    label: { en: "Open Gym", nl: "Open Gym" },
                    value: "open_gym",
                },
            ],
        },
        {
            label: { en: "Status", nl: "Status" },
            name: "status",
            type: "select",
            required: true,
            defaultValue: "closed",
            options: [
                {
                    label: { en: "Open", nl: "Open" },
                    value: "open",
                },
                {
                    label: { en: "Closed", nl: "Gesloten" },
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
                description: {
                    en: "PT and Semi PT lessons are always closed. Group lessons and Open Gym can be open or closed.",
                    nl: "PT en Semi PT lessen zijn altijd gesloten. Groepslessen en Open Gym kunnen open of gesloten zijn.",
                },
            },
        },
        {
            label: { en: "Start date & time", nl: "Startdatum & -tijd" },
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
            label: { en: "End date & time", nl: "Einddatum & -tijd" },
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
            label: { en: "Available spots", nl: "Aantal plekken" },
            name: "spots",
            type: "number",
            required: false,
            admin: {
                condition: (_, siblingData) => !siblingData?.template,
                description: {
                    en: "Optional: the number of available spots for this lesson.",
                    nl: "Optioneel: het aantal beschikbare plekken voor deze les.",
                },
            },
        },
        {
            label: { en: "Image", nl: "Afbeelding" },
            name: "image",
            type: "upload",
            relationTo: "media",
            required: false,
            admin: {
                description: {
                    en: "Optional: used in lesson cards. If left empty, the image from the linked template is used.",
                    nl: "Optioneel: gebruikt in lesson cards. Als leeg, wordt de afbeelding van het gekoppelde sjabloon gebruikt.",
                },
            },
        },
        {
            label: { en: "Coaches", nl: "Coaches" },
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
                description: {
                    en: "Link one or more coaches to this lesson.",
                    nl: "Koppel een of meerdere coaches aan deze les.",
                },
            },
        },
        {
            label: { en: "Workout blocks", nl: "Workoutblokken" },
            name: "workoutBlocks",
            type: "array",
            required: false,
            labels: {
                singular: { en: "Workout block", nl: "Workoutblok" },
                plural: { en: "Workout blocks", nl: "Workoutblokken" },
            },
            admin: {
                description: {
                    en: "Create workout blocks in the desired order and fill in each block's workout details and exercises.",
                    nl: "Maak workoutblokken aan in de gewenste volgorde en vul per blok de workoutgegevens en oefeningen in.",
                },
            },
            fields: [
                {
                    label: { en: "Workout name", nl: "Workout naam" },
                    name: "name",
                    type: "text",
                    required: true,
                },
                {
                    label: {
                        en: "Workout description",
                        nl: "Workout omschrijving",
                    },
                    name: "description",
                    type: "textarea",
                    required: false,
                },
                {
                    label: { en: "Time (minutes)", nl: "Tijd (in minuten)" },
                    name: "duration",
                    type: "number",
                    required: true,
                },
                {
                    label: { en: "Exercises", nl: "Oefeningen" },
                    name: "exercises",
                    type: "array",
                    required: false,
                    labels: {
                        singular: { en: "Exercise", nl: "Oefening" },
                        plural: { en: "Exercises", nl: "Oefeningen" },
                    },
                    fields: [
                        {
                            label: { en: "Name", nl: "Naam" },
                            name: "name",
                            type: "text",
                            required: true,
                        },
                        {
                            label: { en: "Description", nl: "Omschrijving" },
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
