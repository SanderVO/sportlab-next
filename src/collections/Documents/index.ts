import { isAdmin } from "@/access/admin";
import type { CollectionConfig } from "payload";

export const Documents: CollectionConfig = {
    slug: "documents",
    labels: {
        plural: "Documenten",
        singular: "Document",
    },
    access: {
        create: isAdmin,
        delete: isAdmin,
        read: () => true,
        update: isAdmin,
    },
    fields: [
        {
            label: "Titel",
            name: "title",
            type: "text",
            required: true,
        },
    ],
    upload: {
        mimeTypes: [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ],
    },
};
