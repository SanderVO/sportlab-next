import { defaultLexicalFeatures } from "@/fields/defaultLexicalFeatures";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import type { Block } from "payload";

export const FAQBlock: Block = {
    slug: "faqBlock",
    interfaceName: "FAQBlock",
    labels: {
        singular: "Vraag & Antwoord",
        plural: "Vragen & Antwoorden",
    },
    fields: [
        {
            name: "items",
            type: "array",
            label: "Vragen & Antwoorden",
            minRows: 1,
            fields: [
                {
                    name: "question",
                    type: "text",
                    label: "Vraag",
                    required: true,
                },
                {
                    name: "questionColor",
                    type: "select",
                    label: "Kleur vraag",
                    defaultValue: "white",
                    options: [
                        { label: "Wit", value: "white" },
                        { label: "Zwart", value: "black" },
                        { label: "Beige", value: "beige" },
                        { label: "Oranje", value: "orange" },
                    ],
                },
                {
                    name: "iconColor",
                    type: "select",
                    label: "Kleur icoon",
                    defaultValue: "orange",
                    options: [
                        { label: "Wit", value: "white" },
                        { label: "Zwart", value: "black" },
                        { label: "Beige", value: "beige" },
                        { label: "Oranje", value: "orange" },
                    ],
                },
                {
                    name: "answer",
                    type: "richText",
                    label: "Antwoord",
                    required: true,
                    editor: lexicalEditor({
                        features: [...defaultLexicalFeatures],
                    }),
                },
            ],
        },
    ],
};
