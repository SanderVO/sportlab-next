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
        name: "imageSize",
        type: "select",
        defaultValue: "imageCenter",
        required: false,
        options: [
            {
                label: "Top Gecropt",
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
        label: false,
    },
    {
        name: "media",
        type: "upload",
        relationTo: "media",
        required: false,
    },
    {
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
            name: "columns",
            type: "array",
            admin: {
                initCollapsed: true,
            },
            fields: columnFields,
        },
    ],
};
