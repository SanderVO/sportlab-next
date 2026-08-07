import { authenticated } from "@/access/authenticated";
import { isAdminOrCoach } from "@/access/isAdminOrCoach";
import { type CollectionConfig } from "payload";

export const LessonTemplates: CollectionConfig = {
    slug: "lesson-templates",
    labels: {
        singular: "Lessjabloon",
        plural: "Lessjablonen",
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
        description:
            "Sjablonen voor terugkerende lessen. Maak een sjabloon aan voor elke vaste les (bijv. 'Maandag PT 09:00') en koppel het aan individuele lessen.",
        components: {
            views: {
                list: {
                    actions: [
                        "./collections/LessonTemplates/components/GenerateLessonsButton#GenerateLessonsButton",
                    ],
                },
            },
        },
    },
    fields: [
        {
            label: "Actief",
            name: "isActive",
            type: "checkbox",
            defaultValue: true,
            required: false,
            admin: {
                description:
                    "Alleen actieve sjablonen worden gebruikt bij het automatisch aanmaken van lessen.",
                position: "sidebar",
            },
        },
        {
            label: "Naam",
            name: "title",
            type: "text",
            required: true,
            admin: {
                description: "bijv. 'PT' of 'Groepsles Maandag/Woensdag'",
            },
        },
        {
            label: "Type",
            name: "type",
            type: "select",
            required: true,
            options: [
                { label: "PT", value: "pt" },
                { label: "Semi PT", value: "semi_pt" },
                { label: "Groepslessen", value: "group" },
                { label: "Open Gym", value: "open_gym" },
            ],
        },
        {
            label: "Aantal plekken",
            name: "spots",
            type: "number",
            required: false,
            admin: {
                description:
                    "Optioneel: standaard aantal plekken voor lessen op basis van dit sjabloon.",
            },
        },
        {
            label: "Vaste momenten",
            name: "schedule",
            labels: {
                singular: "vast moment",
                plural: "Vaste momenten",
            },
            type: "array",
            required: true,
            minRows: 1,
            admin: {
                description:
                    "Voeg één rij toe per dag/tijd combinatie (bijv. Maandag 09:00 én Woensdag 14:00).",
            },
            fields: [
                {
                    label: "Dag van de week",
                    name: "dayOfWeek",
                    type: "select",
                    required: true,
                    options: [
                        { label: "Maandag", value: "monday" },
                        { label: "Dinsdag", value: "tuesday" },
                        { label: "Woensdag", value: "wednesday" },
                        { label: "Donderdag", value: "thursday" },
                        { label: "Vrijdag", value: "friday" },
                        { label: "Zaterdag", value: "saturday" },
                        { label: "Zondag", value: "sunday" },
                    ],
                },
                {
                    label: "Starttijd",
                    name: "time",
                    type: "date",
                    required: false,
                    admin: {
                        date: {
                            pickerAppearance: "timeOnly",
                            displayFormat: "HH:mm",
                            timeFormat: "HH:mm",
                        },
                    },
                },
                {
                    label: "Eindtijd",
                    name: "endTime",
                    type: "date",
                    required: false,
                    admin: {
                        date: {
                            pickerAppearance: "timeOnly",
                            displayFormat: "HH:mm",
                            timeFormat: "HH:mm",
                        },
                    },
                },
            ],
        },
        {
            label: "Coaches",
            name: "coaches",
            type: "relationship",
            relationTo: "users",
            hasMany: true,
            required: false,
            filterOptions: {
                isCoach: { equals: true },
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
                    "Optioneel: standaard afbeelding voor lesson cards van lessen die op dit sjabloon gebaseerd zijn.",
            },
        },
        {
            label: "Standaard workoutblokken",
            name: "defaultWorkoutBlocks",
            type: "array",
            required: false,
            labels: {
                singular: "Workoutblok",
                plural: "Workoutblokken",
            },
            admin: {
                description:
                    "Optioneel: standaard workoutblokken met oefeningen die worden overgenomen bij nieuwe lessen op basis van dit sjabloon.",
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
                    required: false,
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
                        {
                            label: "Video URL",
                            name: "videoUrl",
                            type: "text",
                            required: false,
                        },
                        {
                            label: "Externe ID",
                            name: "externalId",
                            type: "text",
                            required: false,
                        },
                    ],
                },
            ],
        },
    ],
};
