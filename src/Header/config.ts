import { link } from "@/fields/link";
import type { GlobalConfig } from "payload";
import { revalidateHeader } from "./hooks/revalidateHeader";

export const Header: GlobalConfig = {
    slug: "header",
    access: {
        read: () => true,
    },
    fields: [
        {
            label: "Logo",
            name: "headerLogo",
            type: "upload",
            relationTo: "media",
            required: true,
            filterOptions: {
                mimeType: { contains: "image" },
            },
        },
        {
            name: "navItems",
            type: "array",
            fields: [
                link({
                    appearances: false,
                }),
            ],
            maxRows: 6,
            admin: {
                description: "Add navigation items for the header",
                initCollapsed: true,
                components: {
                    RowLabel: "@/Header/RowLabel#RowLabel",
                },
            },
        },
    ],
    hooks: {
        afterChange: [revalidateHeader],
    },
};
