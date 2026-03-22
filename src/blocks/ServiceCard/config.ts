import { defaultLexicalFeatures } from "@/fields/defaultLexicalFeatures";
import { link } from "@/fields/link";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import type { Block, Field } from "payload";

const fields: Field[] = [
    {
        name: "backgroundColor",
        type: "select",
        label: "Achtergrondkleur",
        options: [
            {
                label: "Wit",
                value: "white",
            },
            {
                label: "Beige",
                value: "beige",
            },
            {
                label: "Zwart",
                value: "black",
            },
        ],
        defaultValue: "white",
        required: true,
    },
    {
        name: "image",
        type: "upload",
        label: "Afbeelding",
        relationTo: "media",
        required: true,
    },
    {
        name: "content",
        type: "richText",
        label: "Content",
        editor: lexicalEditor({ features: [...defaultLexicalFeatures] }),
        required: true,
    },
    {
        name: "priceType",
        type: "text",
        label: "Prijstype",
        required: true,
    },
    {
        name: "price",
        type: "number",
        label: "Prijs",
        required: true,
    },
    {
        name: "priceAlignment",
        type: "select",
        label: "Uitlijning prijssectie",
        options: [
            { label: "Links", value: "left" },
            { label: "Midden", value: "center" },
            { label: "Rechts", value: "right" },
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
        singular: "Service Blok",
        plural: "Service Blokken",
    },
    fields: [
        {
            name: "arrowBackgroundColor",
            type: "select",
            label: "Achtergrondkleur pijlen",
            options: [
                { label: "Wit", value: "white" },
                { label: "Beige", value: "beige" },
                { label: "Zwart", value: "black" },
            ],
            defaultValue: "black",
            required: true,
        },
        {
            name: "columns",
            type: "array",
            label: "Kolommen",
            required: true,
            fields: fields,
        },
    ],
};
