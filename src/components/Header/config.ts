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
            label: "Navigatie items",
            name: "navItems",
            type: "array",
            fields: [
                {
                    type: "checkbox",
                    name: "initiallyVisible",
                    label: "Standaard zichtbaar",
                    defaultValue: true,
                    admin: {
                        description:
                            "Bepaalt of dit item standaard zichtbaar is in de header navigatie",
                    },
                },
                link(),
            ],
            maxRows: 12,
            admin: {
                description: "Voeg navigatie items toe aan de header",
                initCollapsed: true,
                components: {
                    RowLabel: "@/components/Header/RowLabel#RowLabel",
                },
            },
        },
    ],
    hooks: {
        afterChange: [revalidateHeader],
    },
};
