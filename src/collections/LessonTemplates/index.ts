import { authenticated } from "@/access/authenticated";
import { isAdminOrCoach } from "@/access/isAdminOrCoach";
import { type CollectionConfig } from "payload";

export const LessonTemplates: CollectionConfig = {
    slug: "lesson-templates",
    labels: {
        singular: { en: "Lesson template", nl: "Les sjabloon" },
        plural: { en: "Lesson templates", nl: "Les sjablonen" },
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
        description: {
            en: "Templates for recurring lessons. Create a template for each fixed lesson (e.g. 'Monday PT 09:00') and link it to individual lessons.",
            nl: "Sjablonen voor terugkerende lessen. Maak een sjabloon aan voor elke vaste les (bijv. 'Maandag PT 09:00') en koppel het aan individuele lessen.",
        },
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
            label: { en: "Active", nl: "Actief" },
            name: "isActive",
            type: "checkbox",
            defaultValue: true,
            required: false,
            admin: {
                description: {
                    en: "Only active templates are used when automatically creating lessons.",
                    nl: "Alleen actieve sjablonen worden gebruikt bij het automatisch aanmaken van lessen.",
                },
                position: "sidebar",
            },
        },
        {
            label: { en: "Name", nl: "Naam" },
            name: "title",
            type: "text",
            required: true,
            admin: {
                description: {
                    en: "e.g. 'PT' or 'Group class Monday/Wednesday'",
                    nl: "bijv. 'PT' of 'Groepsles Maandag/Woensdag'",
                },
            },
        },
        {
            label: { en: "Type", nl: "Type" },
            name: "type",
            type: "select",
            required: true,
            options: [
                { label: { en: "PT", nl: "PT" }, value: "pt" },
                { label: { en: "Semi PT", nl: "Semi PT" }, value: "semi_pt" },
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
            label: { en: "Available spots", nl: "Aantal plekken" },
            name: "spots",
            type: "number",
            required: false,
            admin: {
                description: {
                    en: "Optional: default number of spots for lessons based on this template.",
                    nl: "Optioneel: standaard aantal plekken voor lessen op basis van dit sjabloon.",
                },
            },
        },
        {
            label: { en: "Fixed times", nl: "Vaste momenten" },
            name: "schedule",
            labels: {
                singular: { en: "Fixed time", nl: "vast moment" },
                plural: { en: "Fixed times", nl: "Vaste momenten" },
            },
            type: "array",
            required: true,
            minRows: 1,
            admin: {
                description: {
                    en: "Add one row per day/time combination (e.g. Monday 09:00 and Wednesday 14:00).",
                    nl: "Voeg één rij toe per dag/tijd combinatie (bijv. Maandag 09:00 én Woensdag 14:00).",
                },
            },
            fields: [
                {
                    label: { en: "Day of the week", nl: "Dag van de week" },
                    name: "dayOfWeek",
                    type: "select",
                    required: true,
                    options: [
                        {
                            label: { en: "Monday", nl: "Maandag" },
                            value: "monday",
                        },
                        {
                            label: { en: "Tuesday", nl: "Dinsdag" },
                            value: "tuesday",
                        },
                        {
                            label: { en: "Wednesday", nl: "Woensdag" },
                            value: "wednesday",
                        },
                        {
                            label: { en: "Thursday", nl: "Donderdag" },
                            value: "thursday",
                        },
                        {
                            label: { en: "Friday", nl: "Vrijdag" },
                            value: "friday",
                        },
                        {
                            label: { en: "Saturday", nl: "Zaterdag" },
                            value: "saturday",
                        },
                        {
                            label: { en: "Sunday", nl: "Zondag" },
                            value: "sunday",
                        },
                    ],
                },
                {
                    label: { en: "Start time", nl: "Starttijd" },
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
                    label: { en: "End time", nl: "Eindtijd" },
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
            label: { en: "Coaches", nl: "Coaches" },
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
            label: { en: "Image", nl: "Afbeelding" },
            name: "image",
            type: "upload",
            relationTo: "media",
            required: false,
            admin: {
                description: {
                    en: "Optional: default image for lesson cards of lessons based on this template.",
                    nl: "Optioneel: standaard afbeelding voor lesson cards van lessen die op dit sjabloon gebaseerd zijn.",
                },
            },
        },
        {
            label: {
                en: "Default workout blocks",
                nl: "Standaard workoutblokken",
            },
            name: "defaultWorkoutBlocks",
            type: "array",
            required: false,
            labels: {
                singular: { en: "Workout block", nl: "Workoutblok" },
                plural: { en: "Workout blocks", nl: "Workoutblokken" },
            },
            admin: {
                description: {
                    en: "Optional: default workout blocks with exercises that are copied to new lessons based on this template.",
                    nl: "Optioneel: standaard workoutblokken met oefeningen die worden overgenomen bij nieuwe lessen op basis van dit sjabloon.",
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
                    required: false,
                },
                {
                    label: { en: "Timer mode", nl: "Timermodus" },
                    name: "timerMode",
                    type: "select",
                    required: false,
                    defaultValue: "countdown",
                    options: [
                        {
                            label: { en: "Countdown", nl: "Aftellen" },
                            value: "countdown",
                        },
                        { label: { en: "EMOM", nl: "EMOM" }, value: "emom" },
                        { label: { en: "AMRAP", nl: "AMRAP" }, value: "amrap" },
                        {
                            label: { en: "Rounds", nl: "Rondes" },
                            value: "rounds",
                        },
                        {
                            label: {
                                en: "Intervals (work / rest)",
                                nl: "Intervallen (werk / rust)",
                            },
                            value: "intervals",
                        },
                    ],
                    admin: {
                        description: {
                            en: "How the TV timer runs. EMOM: every exercise gets its own interval. AMRAP: count rounds within the time. Rounds: a fixed number of rounds. Intervals: every exercise gets a work and a rest period, then the next exercise starts.",
                            nl: "Hoe de timer op de TV loopt. EMOM: elke oefening krijgt een eigen interval. AMRAP: tel rondes binnen de tijd. Rondes: een vast aantal rondes. Intervallen: elke oefening krijgt een werk- en rustperiode, daarna volgt de volgende oefening.",
                        },
                    },
                },
                {
                    label: {
                        en: "Interval (seconds)",
                        nl: "Interval (seconden)",
                    },
                    name: "intervalSeconds",
                    type: "number",
                    required: false,
                    min: 1,
                    admin: {
                        condition: (_, siblingData) =>
                            siblingData?.timerMode === "emom",
                        description: {
                            en: "EMOM only. Default 60 (every minute). Use 120 for every 2 minutes.",
                            nl: "Alleen voor EMOM. Standaard 60 (elke minuut). Gebruik 120 voor elke 2 minuten.",
                        },
                    },
                },
                {
                    label: { en: "Number of rounds", nl: "Aantal rondes" },
                    name: "rounds",
                    type: "number",
                    required: false,
                    min: 1,
                    admin: {
                        condition: (_, siblingData) =>
                            siblingData?.timerMode === "rounds" ||
                            siblingData?.timerMode === "intervals",
                        description: {
                            en: "Intervals: how many times the whole exercise list is repeated. Leave empty to repeat until the time (minutes) runs out.",
                            nl: "Intervallen: hoe vaak de hele lijst met oefeningen wordt herhaald. Laat leeg om te herhalen tot de tijd (minuten) op is.",
                        },
                    },
                },
                {
                    label: { en: "Work (seconds)", nl: "Werk (seconden)" },
                    name: "workSeconds",
                    type: "number",
                    required: false,
                    min: 1,
                    admin: {
                        condition: (_, siblingData) =>
                            siblingData?.timerMode === "intervals",
                        description: {
                            en: "Intervals only, e.g. 40.",
                            nl: "Alleen voor intervallen, bijv. 40.",
                        },
                    },
                },
                {
                    label: { en: "Rest (seconds)", nl: "Rust (seconden)" },
                    name: "restSeconds",
                    type: "number",
                    required: false,
                    min: 0,
                    admin: {
                        condition: (_, siblingData) =>
                            siblingData?.timerMode === "intervals",
                        description: {
                            en: "Intervals only, e.g. 20.",
                            nl: "Alleen voor intervallen, bijv. 20.",
                        },
                    },
                },
                {
                    label: { en: "Points of attention", nl: "POA's" },
                    name: "poa",
                    type: "text",
                    required: false,
                    admin: {
                        description: {
                            en: "Optional. Shown on the TV in the workout block popup, not on the lesson page.",
                            nl: "Optioneel. Getoond op de TV in het workoutblok-venster, niet op de lespagina.",
                        },
                    },
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
                            label: { en: "Quantity", nl: "Hoeveelheid" },
                            name: "quantity",
                            type: "text",
                            required: false,
                            admin: {
                                description: {
                                    en: 'Optional. Short, e.g. "3x15-20", "30 sec" or "10x per kant".',
                                    nl: 'Optioneel. Kort, bijv. "3x15-20", "30 sec" of "10x per kant".',
                                },
                            },
                        },
                        {
                            label: { en: "Description", nl: "Omschrijving" },
                            name: "description",
                            type: "textarea",
                            required: false,
                        },
                        {
                            label: {
                                en: "Changes every round",
                                nl: "Wisselt per ronde",
                            },
                            name: "rotating",
                            type: "checkbox",
                            defaultValue: false,
                            admin: {
                                description: {
                                    en: 'AMRAP / rounds: exercises with this checked take turns, one per round ("Elke ronde wisselend"). The others are done every round.',
                                    nl: 'AMRAP / rondes: oefeningen met dit vinkje wisselen elkaar af, één per ronde ("Elke ronde wisselend"). De overige worden elke ronde gedaan.',
                                },
                            },
                        },
                    ],
                },
            ],
        },
    ],
};
