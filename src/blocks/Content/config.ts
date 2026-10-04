import { defaultLexical } from "@/fields/defaultLexical";
import type { Block, Field } from "payload";

const columnFields: Field[] = [
    {
        label: { en: "Background color", nl: "Achtergrondkleur" },
        name: "backgroundColor",
        type: "select",
        required: false,
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
        label: { en: "Content Type", nl: "Content Type" },
        name: "contentPosition",
        type: "select",
        defaultValue: "contentRight",
        required: true,
        options: [
            {
                label: { en: "Content only", nl: "Alleen content" },
                value: "contentOnly",
            },
            {
                label: { en: "Image top, text bottom", nl: "Afbeelding Boven, Tekst Onder" },
                value: "contentBottom",
            },
            {
                label: { en: "Image left, text right", nl: "Afbeelding Links, Tekst Rechts" },
                value: "contentRight",
            },
            {
                label: { en: "Image right, text left", nl: "Afbeelding Rechts, Tekst Links" },
                value: "contentLeft",
            },
        ],
    },
    {
        label: { en: "Image", nl: "Afbeelding" },
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
        label: { en: "Image size", nl: "Afbeeldingsgrootte" },
        name: "imageSize",
        type: "select",
        defaultValue: "imageCenter",
        required: true,
        options: [
            {
                label: { en: "Full (top cropped)", nl: "Volledig (Top Gecropt)" },
                value: "imageTopCut",
            },
            {
                label: { en: "Full", nl: "Volledig" },
                value: "imageFull",
            },
            {
                label: { en: "Centered", nl: "Gecentreerd" },
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
        label: { en: "Content", nl: "Content" },
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
            label: { en: "Height", nl: "Hoogte" },
            name: "blockHeight",
            type: "select",
            defaultValue: "fixed",
            required: true,
            options: [
                {
                    label: { en: "Fixed", nl: "Vast" },
                    value: "fixed",
                },
                {
                    label: { en: "Automatic (based on content)", nl: "Automatisch (op basis van inhoud)" },
                    value: "auto",
                },
            ],
            admin: {
                description:
                    { en: "Fixed uses the default block height. Automatic adjusts the height to the content.", nl: "Vast gebruikt de standaard blokhoogte. Automatisch past de hoogte aan op de inhoud." },
            },
        },
        {
            label: { en: "Title", nl: "Titel" },
            name: "title",
            type: "text",
            required: false,
            admin: {
                description:
                    { en: "Optional: add a title above the columns. Leave empty if you don't want a title.", nl: "Optioneel: Voeg een titel toe boven de kolommen. Laat leeg als je geen titel wilt." },
            },
        },
        {
            label: { en: "Introduction", nl: "Introductie" },
            name: "introduction",
            type: "richText",
            required: false,
            editor: defaultLexical,
            admin: {
                description:
                    { en: "Optional: add an introduction above the columns. Leave empty if you don't want an introduction.", nl: "Optioneel: Voeg een introductie toe boven de kolommen. Laat leeg als je geen introductie wilt." },
            },
        },
        {
            label: { en: "Columns", nl: "Kolommen" },
            name: "columns",
            type: "array",
            labels: {
                singular: { en: "Column", nl: "Kolom" },
                plural: { en: "Columns", nl: "Kolommen" },
            },
            admin: {
                initCollapsed: true,
                description:
                    { en: "Add columns and configure the content for each column.", nl: "Voeg kolommen toe en configureer de inhoud voor elke kolom." },
            },
            fields: columnFields,
        },
    ],
};
