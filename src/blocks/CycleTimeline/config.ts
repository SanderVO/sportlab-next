import { defaultLexical } from "@/fields/defaultLexical";
import type { Block, Field } from "payload";

const stageFields: Field[] = [
    {
        label: { en: "Image", nl: "Afbeelding" },
        name: "image",
        type: "upload",
        relationTo: "media",
        required: false,
    },
    {
        label: { en: "Week label", nl: "Weeklabel" },
        name: "weekLabel",
        type: "text",
        required: true,
    },
    {
        label: { en: "Phase title", nl: "Fase titel" },
        name: "phaseTitle",
        type: "text",
        required: true,
    },
    {
        label: { en: "Description", nl: "Beschrijving" },
        name: "description",
        type: "textarea",
        required: true,
    },
];

export const CycleTimeline: Block = {
    slug: "cycleTimeline",
    interfaceName: "CycleTimelineBlock",
    labels: {
        singular: { en: "Cycle timeline", nl: "Cycle timeline" },
        plural: { en: "Cycle timelines", nl: "Cycle timelines" },
    },
    fields: [
        {
            label: { en: "Background color", nl: "Achtergrondkleur" },
            name: "backgroundColor",
            type: "select",
            defaultValue: "backgroundDark",
            required: true,
            options: [
                {
                    label: { en: "Black", nl: "Zwart" },
                    value: "backgroundDark",
                },
                {
                    label: { en: "Beige", nl: "Beige" },
                    value: "backgroundLight",
                },
                {
                    label: { en: "White", nl: "Wit" },
                    value: "backgroundWhite",
                },
            ],
        },
        {
            label: { en: "Title", nl: "Titel" },
            name: "title",
            type: "text",
            required: true,
        },
        {
            label: { en: "Subtitle", nl: "Subtitel" },
            name: "subtitle",
            type: "text",
            required: false,
        },
        {
            label: { en: "Phases", nl: "Fases" },
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
            label: { en: "Footer", nl: "Voettekst" },
            name: "footerText",
            type: "text",
            required: false,
        },
        {
            label: { en: "Footer content", nl: "Voettekst content" },
            name: "footerContent",
            type: "richText",
            editor: defaultLexical,
            required: false,
        },
    ],
};
