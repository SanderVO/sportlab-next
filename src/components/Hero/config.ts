import { defaultLexical } from "@/fields/defaultLexical";
import type { Field } from "payload";

export const hero: Field = {
    name: "hero",
    type: "group",
    label: false,
    required: false,
    fields: [
        {
            label: { en: "Image / Video", nl: "Afbeelding / Video" },
            name: "media",
            type: "upload",
            relationTo: "media",
            required: true,
        },
        {
            label: { en: "Content", nl: "Content" },
            name: "text",
            type: "richText",
            editor: defaultLexical,
        },
        {
            label: { en: "Content position", nl: "Content positie" },
            name: "contentPosition",
            type: "select",
            defaultValue: "left",
            options: [
                {
                    label: { en: "Left", nl: "Links" },
                    value: "left",
                },
                {
                    label: { en: "Center", nl: "Midden" },
                    value: "center",
                },
            ],
        },
    ],
};
