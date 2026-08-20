import type { Block, Field } from "payload";

const galleryImageFields: Field[] = [
    {
        label: "Afbeelding",
        name: "media",
        type: "upload",
        relationTo: "media",
        required: true,
        filterOptions: {
            mimeType: {
                contains: "image",
            },
        },
    },
    {
        label: "Beschrijving",
        name: "caption",
        type: "text",
        required: false,
    },
];

export const MediaCarousel: Block = {
    slug: "mediaCarousel",
    interfaceName: "MediaCarouselBlock",
    labels: {
        singular: "Media carousel",
        plural: "Media carousels",
    },
    fields: [
        {
            label: "Achtergrondkleur",
            name: "backgroundColor",
            type: "select",
            defaultValue: "backgroundLight",
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
            label: "Hoofdmedia (video of afbeelding)",
            name: "mainMedia",
            type: "upload",
            relationTo: "media",
            required: true,
        },
        {
            label: "Carousel afbeeldingen",
            name: "galleryImages",
            type: "array",
            required: true,
            minRows: 1,
            admin: {
                initCollapsed: true,
            },
            fields: galleryImageFields,
        },
        {
            label: "Quote (optioneel)",
            name: "quote",
            type: "group",
            fields: [
                {
                    label: "Quote",
                    name: "text",
                    type: "textarea",
                    required: false,
                },
                {
                    label: "Auteur",
                    name: "author",
                    type: "text",
                    required: false,
                },
            ],
        },
    ],
};
