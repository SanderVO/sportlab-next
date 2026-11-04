import type { Block, Field } from "payload";

const carouselItemFields: Field[] = [
    {
        label: { en: "Avatar", nl: "Avatar" },
        name: "media",
        type: "upload",
        relationTo: "media",
        required: false,
    },
    {
        label: { en: "Text", nl: "Tekst" },
        name: "text",
        type: "textarea",
        required: true,
    },
    {
        label: { en: "Name", nl: "Naam" },
        name: "name",
        type: "text",
        required: true,
    },
    {
        label: { en: "Google Review URL", nl: "Google Review URL" },
        name: "google_url",
        type: "text",
        required: false,
    },
];

export const Carousel: Block = {
    slug: "carousel",
    interfaceName: "CarouselBlock",
    fields: [
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
            required: true,
        },
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
            name: "carouselItems",
            type: "array",
            admin: {
                initCollapsed: true,
            },
            fields: carouselItemFields,
        },
    ],
};
