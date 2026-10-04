import { defaultLexicalFeatures } from "@/fields/defaultLexicalFeatures";
import { BlocksFeature, lexicalEditor } from "@payloadcms/richtext-lexical";
import type { Block, Field } from "payload";
import { FormBlock } from "../Form/config";

export const columnFields: Field[] = [
    {
        label: { en: "Content", nl: "Content" },
        name: "richText",
        type: "richText",
        required: true,
        editor: lexicalEditor({
            features: [
                ...defaultLexicalFeatures,
                BlocksFeature({ blocks: [FormBlock] }),
            ],
        }),
    },
];

export const ColumnsBlock: Block = {
    labels: {
        singular: { en: "Column", nl: "Kolom" },
        plural: { en: "Columns", nl: "Kolommen" },
    },
    slug: "columnsBlock",
    interfaceName: "ColumnsBlock",
    fields: [
        {
            label: { en: "Columns", nl: "Kolommen" },
            name: "columns",
            type: "array",
            minRows: 2,
            maxRows: 4,
            fields: columnFields,
        },
    ],
};
