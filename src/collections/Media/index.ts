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
            label: "Alt Tekst",
            name: "alt",
            type: "text",
            required: true,
            admin: {
                description: "Belangrijk voor SEO en toegankelijkheid.",
            },
        },
        {
            label: "Video Poster",
            name: "poster",
            type: "upload",
            relationTo: "media",
            filterOptions: {
                mimeType: { contains: "image" },
            },
            admin: {
                condition: (_, siblingData) => {
                    if (!siblingData?.mimeType) return true;

                    return siblingData?.mimeType?.startsWith("video");
                },
                description:
                    "Wordt gebruikt als fallback en voor performance (LCP). Nodig voor achtergrondvideo's.",
            },
        },
    ],
    upload: {
        mimeTypes: ["image/*", "video/h264", "video/mp4", "video/webm"],
        crop: false,
        focalPoint: false,
    },
};
