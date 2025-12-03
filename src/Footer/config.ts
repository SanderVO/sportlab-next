import { defaultLexical } from "@/fields/defaultLexical";
import type { GlobalConfig } from "payload";
import { revalidateFooter } from "./hooks/revalidateFooter";

export const Footer: GlobalConfig = {
    slug: "footer",
    access: {
        read: () => true,
    },
    fields: [
        {
            label: "Title",
            name: "title",
            type: "text",
            required: true,
        },
        {
            label: "Description",
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
            label: "Contact Information",
            name: "contactText",
            type: "richText",
            editor: defaultLexical,
            required: false,
        },
    ],
    hooks: {
        afterChange: [revalidateFooter],
    },
};
