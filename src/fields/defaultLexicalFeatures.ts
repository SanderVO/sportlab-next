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
import { sizeField, variantField } from "./linkFields";

export const defaultLexicalFeatures = [
    ...defaultEditorFeatures.filter((feature) => feature.key !== "link"),
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
        enabledCollections: ["pages", "posts", "users"],
        fields: ({ defaultFields }) => {
            const defaultFieldsWithoutUrl = defaultFields
                .map((field) => {
                    // Add filterOptions to the doc field to only show coaches (users with slugs)
                    if (
                        "name" in field &&
                        field.name === "doc" &&
                        field.type === "relationship"
                    ) {
                        return {
                            ...field,
                            filterOptions: ({
                                relationTo,
                            }: {
                                relationTo: string;
                            }) => {
                                if (relationTo === "users") {
                                    return {
                                        slug: {
                                            exists: true,
                                        },
                                    };
                                }
                                return true;
                            },
                        } as typeof field;
                    }
                    return field;
                })
                .filter((field) => {
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
                variantField([
                    { label: "Inline text", value: "inline" },
                    { label: "Beige", value: "beige" },
                    { label: "Zwart", value: "black" },
                    { label: "Oranje", value: "orange" },
                ]),
                sizeField([
                    { label: "Small", value: "sm" },
                    { label: "Medium", value: "md" },
                    { label: "Large", value: "lg" },
                ]),
            ];
        },
    }),
    TextStateFeature({
        state: textState,
    }),
];
