import { link } from "@/fields/link";
import type { Block } from "payload";

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
            label: "Limiet",
            name: "limit",
            type: "number",
            defaultValue: 0,
        },
        {
            label: "Sortering",
            name: "sortBy",
            type: "select",
            defaultValue: "name",
            required: true,
            options: [
                { label: "Naam (A-Z)", value: "name" },
                { label: "Naam (Z-A)", value: "-name" },
                { label: "Nieuwste eerst", value: "-createdAt" },
                { label: "Oudste eerst", value: "createdAt" },
                { label: "Aangepaste volgorde", value: "position" },
            ],
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
            label: "Heeft een link",
            name: "enableLink",
            type: "checkbox",
        },
        link({
            admin: {
                condition: (_data, siblingData) => {
                    return Boolean(siblingData?.enableLink);
                },
            },
        }),
    ],
};
