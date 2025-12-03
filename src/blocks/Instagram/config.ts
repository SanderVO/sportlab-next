import type { Block } from "payload";

export const Instagram: Block = {
    slug: "instagram",
    interfaceName: "InstagramBlock",
    fields: [
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
            required: true,
        },
        {
            label: "Type",
            name: "type",
            type: "select",
            defaultValue: "carousel",
            required: true,
            options: [
                {
                    label: "Carousel",
                    value: "carousel",
                },
                {
                    label: "Grid",
                    value: "grid",
                },
            ],
        },
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
    ],
};
