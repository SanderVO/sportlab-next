import { lexicalEditor } from "@payloadcms/richtext-lexical";
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
    ],
    hooks: {
        afterChange: [revalidateFooter],
    },
};
