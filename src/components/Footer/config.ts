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
            label: "Titel",
            name: "title",
            type: "text",
            required: true,
        },
        {
            label: "Subtitel",
            name: "description",
            type: "text",
            required: true,
        },
        link({
            label: "Contactlink",
        }),
        {
            label: "Logo",
            name: "footerLogo",
            type: "upload",
            relationTo: "media",
            required: true,
            filterOptions: {
                mimeType: { contains: "image" },
            },
        },
        {
            label: "Contact Informatie",
            name: "contactText",
            type: "richText",
            editor: lexicalEditor(),
            required: false,
        },
        {
            label: "Social Media Links",
            name: "socialMediaLinks",
            type: "array",
            required: false,
            fields: [
                {
                    label: "Platform",
                    name: "platform",
                    type: "select",
                    options: [
                        { label: "Facebook", value: "facebook" },
                        { label: "Twitter/X", value: "twitter" },
                        { label: "Instagram", value: "instagram" },
                        { label: "YouTube", value: "youtube" },
                        { label: "TikTok", value: "tiktok" },
                    ],
                    required: true,
                },
                {
                    label: "URL",
                    name: "url",
                    type: "text",
                    required: true,
                },
            ],
        },
        {
            label: "Footer Kolommen",
            name: "footerColumns",
            type: "array",
            admin: {
                description:
                    "Voeg kolommen toe met links of rich text voor in de footer",
            },
            fields: [
                {
                    label: "Kolom Titel",
                    name: "columnTitle",
                    type: "text",
                    required: true,
                },
                {
                    label: "Inhoudstype",
                    name: "contentType",
                    type: "radio",
                    defaultValue: "links",
                    options: [
                        { label: "Links", value: "links" },
                        { label: "Rich Text", value: "richText" },
                    ],
                    required: true,
                },
                {
                    label: "Links",
                    name: "links",
                    type: "array",
                    admin: {
                        description: "Voeg links toe voor deze kolom",
                        condition: (_, siblingData) =>
                            siblingData?.contentType === "links",
                    },
                    fields: [link()],
                },
                {
                    label: "Rich Text",
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
