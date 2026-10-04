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
            label: { en: "Logo", nl: "Logo" },
            name: "headerLogo",
            type: "upload",
            relationTo: "media",
            required: true,
            filterOptions: {
                mimeType: { contains: "image" },
            },
        },
        {
            label: { en: "Navigation items", nl: "Navigatie items" },
            name: "navItems",
            type: "array",
            fields: [
                {
                    type: "checkbox",
                    name: "initiallyVisible",
                    label: { en: "Visible by default", nl: "Standaard zichtbaar" },
                    defaultValue: true,
                    admin: {
                        description:
                            { en: "Determines whether this item is visible by default in the header navigation", nl: "Bepaalt of dit item standaard zichtbaar is in de header navigatie" },
                    },
                },
                link(),
            ],
            maxRows: 12,
            admin: {
                description: { en: "Add navigation items to the header", nl: "Voeg navigatie items toe aan de header" },
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
