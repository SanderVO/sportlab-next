import { defaultLexical } from "@/fields/defaultLexical";
import { link } from "@/fields/link";
import type { Block, Field } from "payload";

const fields: Field[] = [
    {
        label: { en: "Image", nl: "Afbeelding" },
        name: "media",
        type: "upload",
        relationTo: "media",
        required: false,
    },
    {
        label: { en: "Has a link", nl: "Heeft een link" },
        name: "enableLink",
        type: "checkbox",
    },
    link({
        admin: {
            condition: (_data, siblingData) => {
                return Boolean(siblingData?.enableLink);
            },
        },
    }),
];

export const Instagram: Block = {
    slug: "instagram",
    labels: {
        singular: { en: "Photo gallery", nl: "Foto gallerij" },
        plural: { en: "Photo galleries", nl: "Foto gallerijen" },
    },
    interfaceName: "InstagramBlock",
    fields: [
        {
            label: { en: "Title", nl: "Titel" },
            name: "title",
            type: "text",
            required: true,
        },
        {
            label: { en: "Content", nl: "Content" },
            name: "content",
            type: "richText",
            editor: defaultLexical,
            required: true,
        },
        {
            label: { en: "Type", nl: "Type" },
            name: "type",
            type: "select",
            defaultValue: "carousel",
            required: true,
            options: [
                {
                    label: { en: "Carousel", nl: "Carousel" },
                    value: "carousel",
                },
                {
                    label: { en: "Grid", nl: "Grid" },
                    value: "grid",
                },
            ],
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
            label: { en: "Photos", nl: "Foto's" },
            name: "images",
            type: "array",
            admin: {
                initCollapsed: true,
            },
            fields: fields,
        },
    ],
};
