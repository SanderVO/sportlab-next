import { link } from "@/fields/link";
import type { Block, Field } from "payload";

const teamBlockItems: Field[] = [
    {
        label: "Teamlid",
        name: "teamMember",
        type: "relationship",
        relationTo: "team-members",
        required: true,
    },
];

export const Team: Block = {
    slug: "team",
    interfaceName: "TeamBlock",
    fields: [
        {
            label: "Titel",
            name: "title",
            type: "text",
            required: true,
        },
        {
            label: "Type",
            name: "type",
            type: "select",
            defaultValue: "carousel",
            required: true,
            options: [
                {
                    label: "Carousel",
                    value: "carousel",
                },
                {
                    label: "Grid",
                    value: "grid",
                },
            ],
        },
        {
            label: "Achtergrondkleur",
            name: "backgroundColor",
            type: "select",
            defaultValue: "backgroundDark",
            required: true,
            options: [
                {
                    label: "Zwart",
                    value: "backgroundDark",
                },
                {
                    label: "Beige",
                    value: "backgroundLight",
                },
                {
                    label: "Wit",
                    value: "backgroundWhite",
                },
            ],
        },
        {
            name: "enableLink",
            type: "checkbox",
        },
        link({
            overrides: {
                admin: {
                    condition: (_data, siblingData) => {
                        return Boolean(siblingData?.enableLink);
                    },
                },
            },
        }),
        {
            name: "teamItems",
            type: "array",
            admin: {
                initCollapsed: true,
            },
            fields: teamBlockItems,
        },
    ],
};
