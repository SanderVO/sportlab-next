import { link } from "@/fields/link";
import {
    AlignFeature,
    FixedToolbarFeature,
    lexicalEditor,
    ParagraphFeature,
} from "@payloadcms/richtext-lexical";
import type { GlobalConfig } from "payload";
import { revalidateFooter } from "./hooks/revalidateFooter";

export const Footer: GlobalConfig = {
    slug: "footer",
    access: {
        read: () => true,
    },
    fields: [
        {
            label: { en: "Title", nl: "Titel" },
            name: "title",
            type: "text",
            required: true,
        },
        {
            label: { en: "Subtitle", nl: "Subtitel" },
            name: "description",
            type: "text",
            required: true,
        },
        link({
            label: { en: "Contact link", nl: "Contactlink" },
        }),
        {
            label: { en: "Logo", nl: "Logo" },
            name: "footerLogo",
            type: "upload",
            relationTo: "media",
            required: true,
            filterOptions: {
                mimeType: { contains: "image" },
            },
        },
        {
            label: { en: "Contact information", nl: "Contact Informatie" },
            name: "contactText",
            type: "richText",
            editor: lexicalEditor(),
            required: false,
        },
        {
            label: { en: "Social media links", nl: "Social Media Links" },
            name: "socialMediaLinks",
            type: "array",
            required: false,
            fields: [
                {
                    label: { en: "Platform", nl: "Platform" },
                    name: "platform",
                    type: "select",
                    options: [
                        { label: { en: "Facebook", nl: "Facebook" }, value: "facebook" },
                        { label: { en: "Twitter/X", nl: "Twitter/X" }, value: "twitter" },
                        { label: { en: "Instagram", nl: "Instagram" }, value: "instagram" },
                        { label: { en: "YouTube", nl: "YouTube" }, value: "youtube" },
                        { label: { en: "TikTok", nl: "TikTok" }, value: "tiktok" },
                    ],
                    required: true,
                },
                {
                    label: { en: "URL", nl: "URL" },
                    name: "url",
                    type: "text",
                    required: true,
                },
            ],
        },
        {
            label: { en: "Footer columns", nl: "Footer Kolommen" },
            name: "footerColumns",
            type: "array",
            admin: {
                description:
                    { en: "Add columns with links or rich text to the footer", nl: "Voeg kolommen toe met links of rich text voor in de footer" },
            },
            fields: [
                {
                    label: { en: "Column title", nl: "Kolom Titel" },
                    name: "columnTitle",
                    type: "text",
                    required: true,
                },
                {
                    label: { en: "Content type", nl: "Inhoudstype" },
                    name: "contentType",
                    type: "radio",
                    defaultValue: "links",
                    options: [
                        { label: { en: "Links", nl: "Links" }, value: "links" },
                        { label: { en: "Rich Text", nl: "Rich Text" }, value: "richText" },
                    ],
                    required: true,
                },
                {
                    label: { en: "Links", nl: "Links" },
                    name: "links",
                    type: "array",
                    admin: {
                        description: { en: "Add links for this column", nl: "Voeg links toe voor deze kolom" },
                        condition: (_, siblingData) =>
                            siblingData?.contentType === "links",
                    },
                    fields: [link()],
                },
                {
                    label: { en: "Rich Text", nl: "Rich Text" },
                    name: "richText",
                    type: "richText",
                    editor: lexicalEditor({
                        features: () => [
                            ParagraphFeature(),
                            AlignFeature(),
                            FixedToolbarFeature(),
                        ],
                    }),
                    admin: {
                        condition: (_, siblingData) =>
                            siblingData?.contentType === "richText",
                    },
                    required: false,
                },
            ],
        },
    ],
    hooks: {
        afterChange: [revalidateFooter],
    },
};
