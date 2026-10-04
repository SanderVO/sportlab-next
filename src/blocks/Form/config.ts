import { lexicalEditor } from "@payloadcms/richtext-lexical";
import type { Block } from "payload";

export const FormBlock: Block = {
    slug: "formBlock",
    interfaceName: "FormBlock",
    fields: [
        {
            label: { en: "Form", nl: "Formulier" },
            name: "form",
            type: "relationship",
            relationTo: "forms",
            required: true,
        },
        {
            label: { en: "With intro text", nl: "Met introtekst" },
            name: "enableIntro",
            type: "checkbox",
        },
        {
            label: { en: "Intro text", nl: "Introtekst" },
            name: "introContent",
            type: "richText",
            admin: {
                condition: (_, { enableIntro }) => Boolean(enableIntro),
            },
            editor: lexicalEditor(),
        },
    ],
    graphQL: {
        singularName: "FormBlock",
    },
    labels: {
        plural: { en: "Forms", nl: "Formulieren" },
        singular: { en: "Form", nl: "Formulier" },
    },
};
