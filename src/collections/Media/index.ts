import { isAdmin } from "@/access/admin";
import type { CollectionConfig } from "payload";

export const Media: CollectionConfig = {
    slug: "media",
    access: {
        create: isAdmin,
        delete: isAdmin,
        read: () => true,
        update: isAdmin,
    },
    fields: [
        {
            name: "alt",
            type: "text",
            required: true,
        },
    ],
    upload: {
        mimeTypes: ["image/*"],
    },
};
