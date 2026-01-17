import { CallToActionBlock } from "@/blocks/CallToAction/config";
import { ColumnsBlock } from "@/blocks/Columns/config";
import { FormBlock } from "@/blocks/Form/config";
import { ServiceCardBlock } from "@/blocks/ServiceCard/config";
import { VirtuagymRosterBlock } from "@/blocks/VirtuagymRoster/config";
import { BlocksFeature, lexicalEditor } from "@payloadcms/richtext-lexical";
import { defaultLexicalFeatures } from "./defaultLexicalFeatures";

export const defaultLexical = lexicalEditor({
    features: [
        ...defaultLexicalFeatures,
        BlocksFeature({
            blocks: [
                ColumnsBlock,
                FormBlock,
                VirtuagymRosterBlock,
                CallToActionBlock,
                ServiceCardBlock,
            ],
        }),
    ],
});
