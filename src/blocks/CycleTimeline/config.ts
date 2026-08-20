import type { Block, Field } from "payload";

const stageFields: Field[] = [
    {
        label: "Weeklabel",
        name: "weekLabel",
        type: "text",
        required: true,
    },
    {
        label: "Fase titel",
        name: "phaseTitle",
        type: "text",
        required: true,
    },
    {
        label: "Beschrijving",
        name: "description",
        type: "textarea",
        required: true,
    },
];

export const CycleTimeline: Block = {
    slug: "cycleTimeline",
    interfaceName: "CycleTimelineBlock",
    labels: {
        singular: "Cycle timeline",
        plural: "Cycle timelines",
    },
    fields: [
        {
            label: "Achtergrondkleur",
            name: "backgroundColor",
            type: "select",
            defaultValue: "backgroundDark",
            required: true,
            options: [
                {
                    label: "Zwart",
                    value: "backgroundDark",
                },
                {
                    label: "Beige",
                    value: "backgroundLight",
                },
                {
                    label: "Wit",
                    value: "backgroundWhite",
                },
            ],
        },
        {
            label: "Titel",
            name: "title",
            type: "text",
            required: true,
        },
        {
            label: "Subtitel",
            name: "subtitle",
            type: "text",
            required: false,
        },
        {
            label: "Fases",
            name: "stages",
            type: "array",
            minRows: 2,
            maxRows: 10,
            required: true,
            admin: {
                initCollapsed: true,
            },
            fields: stageFields,
        },
        {
            label: "Voettekst",
            name: "footerText",
            type: "text",
            required: false,
        },
    ],
};
