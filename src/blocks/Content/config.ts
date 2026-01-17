import { defaultLexical } from "@/fields/defaultLexical";
import type { Block, Field } from "payload";

const columnFields: Field[] = [
    {
        label: "Content Type",
        name: "contentPosition",
        type: "select",
        defaultValue: "contentRight",
        required: true,
        options: [
            {
                label: "Alleen content",
                value: "contentOnly",
            },
            {
                label: "Afbeelding Boven, Tekst Onder",
                value: "contentBottom",
            },
            {
                label: "Afbeelding Links, Tekst Rechts",
                value: "contentRight",
            },
            {
                label: "Afbeelding Rechts, Tekst Links",
                value: "contentLeft",
            },
        ],
    },
    {
        label: "Afbeelding",
        name: "media",
        type: "upload",
        relationTo: "media",
        required: true,
        admin: {
            condition: (_data, siblingData) => {
                return siblingData?.contentPosition !== "contentOnly";
            },
        },
    },
    {
        label: "Afbeeldingsgrootte",
        name: "imageSize",
        type: "select",
        defaultValue: "imageCenter",
        required: true,
        options: [
            {
                label: "Volledig (Top Gecropt)",
                value: "imageTopCut",
            },
            {
                label: "Volledig",
                value: "imageFull",
            },
            {
                label: "Gecentreerd",
                value: "imageCenter",
            },
        ],
        admin: {
            condition: (_data, siblingData) => {
                return siblingData?.contentPosition !== "contentOnly";
            },
        },
    },
    {
        label: "Content",
        name: "richText",
        type: "richText",
        required: true,
        editor: defaultLexical,
    },
];

export const Content: Block = {
    slug: "content",
    interfaceName: "ContentBlock",
    fields: [
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
            label: "Kolommen",
            name: "columns",
            type: "array",
            admin: {
                initCollapsed: true,
            },
            fields: columnFields,
        },
    ],
};
