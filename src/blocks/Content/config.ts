import { link } from "@/fields/link";
import {
    BlocksFeature,
    FixedToolbarFeature,
    InlineToolbarFeature,
    lexicalEditor,
} from "@payloadcms/richtext-lexical";
import type { Block, Field } from "payload";
import { FormBlock } from "../Form/config";

const columnFields: Field[] = [
    {
        label: "Content Type",
        name: "contentPosition",
        type: "select",
        defaultValue: "contentRight",
        required: true,
        options: [
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
        label: "Afbeeldingsgrootte",
        name: "imageSize",
        type: "select",
        defaultValue: "imageCenter",
        required: false,
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
    },
    {
        label: "Title",
        name: "title",
        type: "text",
        required: false,
    },
    {
        label: "Content",
        name: "richText",
        type: "richText",
        required: true,
        editor: lexicalEditor({
            features: ({ rootFeatures }) => {
                return [
                    ...rootFeatures,
                    BlocksFeature({
                        blocks: [FormBlock],
                    }),
                    FixedToolbarFeature(),
                    InlineToolbarFeature(),
                ];
            },
        }),
    },
    {
        label: "Afbeelding",
        name: "media",
        type: "upload",
        relationTo: "media",
        required: false,
    },
    {
        label: "Heeft een link",
        name: "enableLink",
        type: "checkbox",
    },
    link({
        overrides: {
            admin: {
                condition: (_data, siblingData) => {
                    return Boolean(siblingData?.enableLink);
                },
            },
        },
    }),
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
