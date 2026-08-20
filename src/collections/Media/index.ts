import { isAdmin } from "@/access/admin";
import type { CollectionConfig } from "payload";

export const Media: CollectionConfig = {
    slug: "media",
    labels: {
        singular: { en: "Media item", nl: "Media item" },
        plural: { en: "Media", nl: "Media" },
    },
    access: {
        create: isAdmin,
        delete: isAdmin,
        read: () => true,
        update: isAdmin,
    },
    fields: [
        {
            label: { en: "Alt text", nl: "Alt tekst" },
            name: "alt",
            type: "text",
            required: true,
            admin: {
                description: {
                    en: "Important for SEO and accessibility.",
                    nl: "Belangrijk voor SEO en toegankelijkheid.",
                },
            },
        },
        {
            label: {
                en: "Image crop position (desktop)",
                nl: "Afbeelding uitsnij positie (desktop)",
            },
            name: "objectPositionDesktop",
            type: "select",
            defaultValue: "top",
            options: [
                { label: { en: "Center", nl: "Midden" }, value: "center" },
                { label: { en: "Top", nl: "Boven" }, value: "top" },
                { label: { en: "Bottom", nl: "Onder" }, value: "bottom" },
                { label: { en: "Left", nl: "Links" }, value: "left" },
                { label: { en: "Right", nl: "Rechts" }, value: "right" },
            ],
            admin: {
                condition: (_, siblingData) =>
                    siblingData?.mimeType?.startsWith("image"),
            },
        },
        {
            label: {
                en: "Image crop position (mobile)",
                nl: "Afbeelding uitsnij positie (mobiel)",
            },
            name: "objectPositionMobile",
            type: "select",
            defaultValue: "center",
            options: [
                { label: { en: "Center", nl: "Midden" }, value: "center" },
                { label: { en: "Top", nl: "Boven" }, value: "top" },
                { label: { en: "Bottom", nl: "Onder" }, value: "bottom" },
                { label: { en: "Left", nl: "Links" }, value: "left" },
                { label: { en: "Right", nl: "Rechts" }, value: "right" },
            ],
            admin: {
                condition: (_, siblingData) =>
                    siblingData?.mimeType?.startsWith("image"),
            },
        },
        {
            label: { en: "Video poster", nl: "Video poster" },
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
                description: {
                    en: "Used as a fallback and for performance (LCP). Required for background videos.",
                    nl: "Wordt gebruikt als fallback en voor performance (LCP). Nodig voor achtergrondvideo's.",
                },
            },
        },
    ],
    upload: {
        mimeTypes: ["image/*", "video/h264", "video/mp4", "video/webm"],
        crop: false,
        focalPoint: false,
    },
};
