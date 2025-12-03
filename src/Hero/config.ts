import { link } from "@/fields/link";
import type { Field } from "payload";

export const hero: Field = {
    name: "hero",
    type: "group",
    label: false,
    fields: [
        {
            label: "Title",
            name: "title",
            type: "text",
            required: true,
        },
        {
            label: "Subtitle",
            name: "subtitle",
            type: "text",
            required: true,
        },
        {
            label: "Type",
            name: "type",
            type: "select",
            defaultValue: "background",
            required: true,
            options: [
                {
                    label: "Afbeelding achtergrond",
                    value: "background",
                },
                {
                    label: "Afbeelding links",
                    value: "left",
                },
            ],
        },
        {
            label: "Achtergrondkleur",
            name: "backgroundColor",
            type: "select",
            defaultValue: "black",
            required: true,
            options: [
                {
                    label: "Zwart",
                    value: "black",
                },
                {
                    label: "Beige",
                    value: "beige",
                },
                {
                    label: "Wit",
                    value: "white",
                },
            ],
        },
        {
            label: "Tekstkleur",
            name: "color",
            type: "select",
            defaultValue: "black",
            required: false,
            options: [
                {
                    label: "Zwart",
                    value: "black",
                },
                {
                    label: "Beige",
                    value: "beige",
                },
                {
                    label: "Wit",
                    value: "white",
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
            name: "media",
            type: "upload",
            relationTo: "media",
            required: true,
        },
    ],
};
