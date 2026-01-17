import { lexicalEditor } from "@payloadcms/richtext-lexical";
import type { Block } from "payload";

export const FormBlock: Block = {
    slug: "formBlock",
    interfaceName: "FormBlock",
    fields: [
        {
            label: "Formulier",
            name: "form",
            type: "relationship",
            relationTo: "forms",
            required: true,
        },
        {
            label: "Met introtekst",
            name: "enableIntro",
            type: "checkbox",
        },
        {
            label: "Introtekst",
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
        plural: "Formulieren",
        singular: "Formulier",
    },
};
