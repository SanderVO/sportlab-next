import type { Block, Field } from "payload";

const carouselItemFields: Field[] = [
    {
        label: "Avatar",
        name: "media",
        type: "upload",
        relationTo: "media",
        required: false,
    },
    {
        label: "Tekst",
        name: "text",
        type: "textarea",
        required: true,
    },
    {
        label: "Naam",
        name: "name",
        type: "text",
        required: true,
    },
];

export const Carousel: Block = {
    slug: "carousel",
    interfaceName: "CarouselBlock",
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
            name: "carouselItems",
            type: "array",
            admin: {
                initCollapsed: true,
            },
            fields: carouselItemFields,
        },
    ],
};
