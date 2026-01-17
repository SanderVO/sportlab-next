import { defaultLexical } from "@/fields/defaultLexical";
import type { Field } from "payload";

export const hero: Field = {
    name: "hero",
    type: "group",
    label: false,
    required: false,
    fields: [
        {
            label: "Afbeelding / Video",
            name: "media",
            type: "upload",
            relationTo: "media",
            required: true,
        },
        {
            label: "Content",
            name: "text",
            type: "richText",
            editor: defaultLexical,
        },
    ],
};
