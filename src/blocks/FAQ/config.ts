import { defaultLexicalFeatures } from "@/fields/defaultLexicalFeatures";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import type { Block } from "payload";

export const FAQBlock: Block = {
    slug: "faqBlock",
    interfaceName: "FAQBlock",
    labels: {
        singular: { en: "Question & Answer", nl: "Vraag & Antwoord" },
        plural: { en: "Questions & Answers", nl: "Vragen & Antwoorden" },
    },
    fields: [
        {
            name: "items",
            type: "array",
            label: { en: "Questions & Answers", nl: "Vragen & Antwoorden" },
            minRows: 1,
            fields: [
                {
                    name: "question",
                    type: "text",
                    label: { en: "Question", nl: "Vraag" },
                    required: true,
                },
                {
                    name: "questionColor",
                    type: "select",
                    label: { en: "Question color", nl: "Kleur vraag" },
                    defaultValue: "white",
                    options: [
                        { label: { en: "White", nl: "Wit" }, value: "white" },
                        { label: { en: "Black", nl: "Zwart" }, value: "black" },
                        { label: { en: "Beige", nl: "Beige" }, value: "beige" },
                        { label: { en: "Orange", nl: "Oranje" }, value: "orange" },
                    ],
                },
                {
                    name: "iconColor",
                    type: "select",
                    label: { en: "Icon color", nl: "Kleur icoon" },
                    defaultValue: "orange",
                    options: [
                        { label: { en: "White", nl: "Wit" }, value: "white" },
                        { label: { en: "Black", nl: "Zwart" }, value: "black" },
                        { label: { en: "Beige", nl: "Beige" }, value: "beige" },
                        { label: { en: "Orange", nl: "Oranje" }, value: "orange" },
                    ],
                },
                {
                    name: "answer",
                    type: "richText",
                    label: { en: "Answer", nl: "Antwoord" },
                    required: true,
                    editor: lexicalEditor({
                        features: [...defaultLexicalFeatures],
                    }),
                },
            ],
        },
    ],
};
