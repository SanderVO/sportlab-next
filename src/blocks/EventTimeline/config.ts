import type { Block } from "payload";

export const EventTimeline: Block = {
    slug: "eventTimeline",
    interfaceName: "EventTimelineBlock",
    labels: {
        singular: { en: "Event timeline", nl: "Evenementen tijdlijn" },
        plural: { en: "Event timelines", nl: "Evenementen tijdlijnen" },
    },
    fields: [
        {
            label: { en: "Background color", nl: "Achtergrondkleur" },
            name: "backgroundColor",
            type: "select",
            defaultValue: "backgroundWhite",
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
            admin: {
                description: {
                    en: "Title for block.",
                    nl: "Titel voor het blok.",
                },
            },
        },
        {
            label: { en: "Subtitle", nl: "Ondertitel" },
            name: "subtitle",
            type: "text",
            required: false,
            admin: {
                description: {
                    en: "Optional. The events come from Events; only upcoming events are shown.",
                    nl: "Optioneel. De evenementen komen uit Evenementen; alleen aankomende evenementen worden getoond.",
                },
            },
        },
    ],
};
