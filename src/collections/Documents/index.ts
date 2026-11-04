import { isAdmin } from "@/access/admin";
import { sanitizeUploadFilename } from "@/hooks/sanitizeUploadFilename";
import type { CollectionConfig } from "payload";

export const Documents: CollectionConfig = {
    slug: "documents",
    labels: {
        plural: { en: "Documents", nl: "Documenten" },
        singular: { en: "Document", nl: "Document" },
    },
    access: {
        create: isAdmin,
        delete: isAdmin,
        read: () => true,
        update: isAdmin,
    },
    fields: [
        {
            label: { en: "Title", nl: "Titel" },
            name: "title",
            type: "text",
            required: true,
        },
    ],
    hooks: {
        beforeOperation: [sanitizeUploadFilename],
    },
    upload: {
        mimeTypes: [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ],
    },
};
