import {
    BoldFeature,
    defaultEditorFeatures,
    FixedToolbarFeature,
    HeadingFeature,
    HorizontalRuleFeature,
    InlineToolbarFeature,
    ItalicFeature,
    LinkFeature,
    LinkFields,
    ParagraphFeature,
    TextStateFeature,
    UnderlineFeature,
} from "@payloadcms/richtext-lexical";
import { TextFieldSingleValidation } from "payload";
import { textState } from "../utilities/textState";

export const defaultLexicalFeatures = [
    ...defaultEditorFeatures,
    FixedToolbarFeature(),
    InlineToolbarFeature(),
    HorizontalRuleFeature(),
    ParagraphFeature(),
    UnderlineFeature(),
    BoldFeature(),
    ItalicFeature(),
    HeadingFeature({
        enabledHeadingSizes: ["h1", "h2", "h3", "h4"],
    }),
    LinkFeature({
        enabledCollections: ["pages", "posts"],
        fields: ({ defaultFields }) => {
            const defaultFieldsWithoutUrl = defaultFields.filter((field) => {
                if ("name" in field && field.name === "url") return false;
                return true;
            });

            return [
                ...defaultFieldsWithoutUrl,
                {
                    name: "url",
                    type: "text",
                    admin: {
                        condition: (_data, siblingData) =>
                            siblingData?.linkType !== "internal",
                    },
                    label: ({ t }) => t("fields:enterURL"),
                    required: true,
                    validate: ((value, options) => {
                        if (
                            (options?.siblingData as LinkFields)?.linkType ===
                            "internal"
                        ) {
                            return true; // no validation needed, as no url should exist for internal links
                        }
                        return value ? true : "URL is required";
                    }) as TextFieldSingleValidation,
                },
                {
                    Label: "Type",
                    name: "type",
                    type: "select",
                    options: [
                        {
                            label: "Standaard",
                            value: "default",
                        },
                        {
                            label: "Zwart CTA",
                            value: "black",
                        },
                        {
                            label: "Beige CTA",
                            value: "beige",
                        },
                        {
                            label: "Oranje CTA",
                            value: "orange",
                        },
                    ],
                    defaultValue: "default",
                    required: true,
                    admin: {
                        description: "Selecteer de type van deze link.",
                    },
                },
            ];
        },
    }),
    TextStateFeature({
        state: textState,
    }),
];
