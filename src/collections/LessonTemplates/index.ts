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
            beforeList: [
                "./collections/LessonTemplates/components/GenerateLessonsButton#GenerateLessonsButton",
            ],
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
            label: "Vaste momenten",
            name: "schedule",
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
                        date: { pickerAppearance: "timeOnly" },
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
            label: "Standaard oefeningen",
            name: "defaultExercises",
            type: "array",
            required: false,
            admin: {
                description:
                    "Optioneel: standaard oefeningen die worden overgenomen bij nieuwe lessen op basis van dit sjabloon.",
            },
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
    ],
};
