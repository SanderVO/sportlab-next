import { defaultLexicalFeatures } from "@/fields/defaultLexicalFeatures";
import { link } from "@/fields/link";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import type { Block, Field } from "payload";

const fields: Field[] = [
    {
        name: "backgroundColor",
        type: "select",
        label: { en: "Background color", nl: "Achtergrondkleur" },
        options: [
            {
                label: { en: "White", nl: "Wit" },
                value: "white",
            },
            {
                label: { en: "Beige", nl: "Beige" },
                value: "beige",
            },
            {
                label: { en: "Black", nl: "Zwart" },
                value: "black",
            },
        ],
        defaultValue: "white",
        required: true,
    },
    {
        name: "image",
        type: "upload",
        label: { en: "Image", nl: "Afbeelding" },
        relationTo: "media",
        required: true,
    },
    {
        name: "content",
        type: "richText",
        label: { en: "Content", nl: "Content" },
        editor: lexicalEditor({ features: [...defaultLexicalFeatures] }),
        required: true,
    },
    {
        name: "priceType",
        type: "text",
        label: { en: "Price type", nl: "Prijstype" },
        required: true,
    },
    {
        name: "price",
        type: "number",
        label: { en: "Price", nl: "Prijs" },
        required: true,
    },
    {
        name: "priceAlignment",
        type: "select",
        label: { en: "Price section alignment", nl: "Uitlijning prijssectie" },
        options: [
            { label: { en: "Left", nl: "Links" }, value: "left" },
            { label: { en: "Center", nl: "Midden" }, value: "center" },
            { label: { en: "Right", nl: "Rechts" }, value: "right" },
        ],
        defaultValue: "left",
        required: true,
    },
    link(),
];

export const ServiceCardBlock: Block = {
    slug: "serviceCardBlock",
    interfaceName: "ServiceCardBlock",
    labels: {
        singular: { en: "Service block", nl: "Service Blok" },
        plural: { en: "Service blocks", nl: "Service Blokken" },
    },
    fields: [
        {
            name: "arrowBackgroundColor",
            type: "select",
            label: { en: "Arrow background color", nl: "Achtergrondkleur pijlen" },
            options: [
                { label: { en: "White", nl: "Wit" }, value: "white" },
                { label: { en: "Beige", nl: "Beige" }, value: "beige" },
                { label: { en: "Black", nl: "Zwart" }, value: "black" },
            ],
            defaultValue: "black",
            required: true,
        },
        {
            name: "footerText",
            type: "text",
            label: { en: "Footer text", nl: "Footertekst" },
        },
        {
            name: "columns",
            type: "array",
            label: { en: "Columns", nl: "Kolommen" },
            required: true,
            fields: fields,
        },
    ],
};
