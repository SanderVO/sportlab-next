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
        defaultColumns: ["title", "startDate", "type", "updatedAt"],
    },
    hooks: {
        afterChange: [syncExerciseTrackingOnLessonUpdate],
        afterRead: [resolveCardImage],
        beforeValidate: [applyTemplateBeforeValidate],
        beforeChange: [applyTemplate],
    },
    fields: [
        {
            name: "importCsv",
            type: "ui",
            admin: {
                components: {
                    Field: "./collections/Lessons/components/ImportCsvField#ImportCsvField",
                },
            },
        },
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
            label: { en: "Program", nl: "Programma" },
            name: "program",
            type: "relationship",
            relationTo: "programs",
            hasMany: false,
            required: false,
            index: true,
            admin: {
                description: {
                    en: "Optional: the program this lesson belongs to. Selected automatically based on the start date.",
                    nl: "Optioneel: het programma waar deze les bij hoort. Wordt automatisch gekozen op basis van de startdatum.",
                },
                position: "sidebar",
                components: {
                    Field: "./collections/Lessons/components/ProgramField#ProgramField",
                },
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
            // Queried on every /tv render (range filter); needs an index to avoid a full table scan.
            index: true,
            admin: {
                condition: (_, siblingData) => !siblingData?.template,
                components: {
                    Cell: "./collections/Lessons/components/StartDateCell#StartDateCell",
                },
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
                components: {
                    RowLabel:
                        "./collections/Lessons/components/WorkoutBlockRowLabel#WorkoutBlockRowLabel",
                },
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
