import { link } from "@/fields/link";
import type { Block } from "payload";

export const Team: Block = {
    slug: "team",
    interfaceName: "TeamBlock",
    fields: [
        {
            label: { en: "Title", nl: "Titel" },
            name: "title",
            type: "text",
            required: true,
        },
        {
            label: { en: "Limit", nl: "Limiet" },
            name: "limit",
            type: "number",
            defaultValue: 0,
        },
        {
            label: { en: "Sorting", nl: "Sortering" },
            name: "sortBy",
            type: "select",
            defaultValue: "name",
            required: true,
            options: [
                { label: { en: "Name (A-Z)", nl: "Naam (A-Z)" }, value: "name" },
                { label: { en: "Name (Z-A)", nl: "Naam (Z-A)" }, value: "-name" },
                { label: { en: "Newest first", nl: "Nieuwste eerst" }, value: "-createdAt" },
                { label: { en: "Oldest first", nl: "Oudste eerst" }, value: "createdAt" },
                { label: { en: "Custom order", nl: "Aangepaste volgorde" }, value: "position" },
            ],
        },
        {
            label: { en: "Type", nl: "Type" },
            name: "type",
            type: "select",
            defaultValue: "carousel",
            required: true,
            options: [
                {
                    label: { en: "Carousel", nl: "Carousel" },
                    value: "carousel",
                },
                {
                    label: { en: "Grid", nl: "Grid" },
                    value: "grid",
                },
            ],
        },
        {
            label: { en: "Background color", nl: "Achtergrondkleur" },
            name: "backgroundColor",
            type: "select",
            defaultValue: "backgroundDark",
            required: true,
            options: [
                {
                    label: { en: "Black", nl: "Zwart" },
                    value: "backgroundDark",
                },
                {
                    label: { en: "Beige", nl: "Beige" },
                    value: "backgroundLight",
                },
                {
                    label: { en: "White", nl: "Wit" },
                    value: "backgroundWhite",
                },
            ],
        },
        {
            label: { en: "Selected coaches", nl: "Geselecteerde coaches" },
            name: "selectedCoaches",
            type: "relationship",
            relationTo: "users",
            hasMany: true,
            required: false,
            admin: {
                description:
                    { en: "Optional: choose specific coaches to display. Leave empty to automatically show all coaches.", nl: "Optioneel: kies specifieke coaches om te tonen. Laat leeg om automatisch alle coaches te tonen." },
            },
            filterOptions: {
                isCoach: {
                    equals: true,
                },
                status: {
                    equals: "active",
                },
            },
        },
        {
            label: { en: "Has a link", nl: "Heeft een link" },
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
