import type { Block, Field } from "payload";

const galleryImageFields: Field[] = [
    {
        label: { en: "Image", nl: "Afbeelding" },
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
        label: { en: "Description", nl: "Beschrijving" },
        name: "caption",
        type: "text",
        required: false,
    },
];

export const MediaCarousel: Block = {
    slug: "mediaCarousel",
    interfaceName: "MediaCarouselBlock",
    labels: {
        singular: { en: "Media carousel", nl: "Media carousel" },
        plural: { en: "Media carousels", nl: "Media carousels" },
    },
    fields: [
        {
            label: { en: "Background color", nl: "Achtergrondkleur" },
            name: "backgroundColor",
            type: "select",
            defaultValue: "backgroundLight",
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
            label: { en: "Main media (video or image)", nl: "Hoofdmedia (video of afbeelding)" },
            name: "mainMedia",
            type: "upload",
            relationTo: "media",
            required: true,
        },
        {
            label: { en: "Carousel images", nl: "Carousel afbeeldingen" },
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
            label: { en: "Quote (optional)", nl: "Quote (optioneel)" },
            name: "quote",
            type: "group",
            fields: [
                {
                    label: { en: "Quote", nl: "Quote" },
                    name: "text",
                    type: "textarea",
                    required: false,
                },
                {
                    label: { en: "Author", nl: "Auteur" },
                    name: "author",
                    type: "text",
                    required: false,
                },
            ],
        },
    ],
};
