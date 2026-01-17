import { link } from "@/fields/link";
import type { Block } from "payload";

export const CallToActionBlock: Block = {
    slug: "callToActionBlock",
    interfaceName: "CallToActionBlock",
    fields: [link()],
    graphQL: {
        singularName: "CallToActionBlock",
    },
    labels: {
        plural: "Call to actions",
        singular: "Call to action",
    },
};
