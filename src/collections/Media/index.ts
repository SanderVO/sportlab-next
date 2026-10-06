import { isAdmin } from "@/access/admin";
import { sanitizeUploadFilename } from "@/hooks/sanitizeUploadFilename";
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
    hooks: {
        beforeOperation: [sanitizeUploadFilename],
    },
    upload: {
        mimeTypes: ["image/*", "video/h264", "video/mp4", "video/webm"],
        crop: true,
        focalPoint: true,
        // Small optimized thumbnail via Cloudflare Image Transformations.
        // Requires transformations to be enabled on the R2 public domain's zone.
        adminThumbnail: ({ doc }) => {
            const { url, mimeType } = doc as {
                url?: string;
                mimeType?: string;
            };

            if (!url || !mimeType?.startsWith("image/")) {
                return null;
            }

            // Leave SVGs and local (non-absolute) URLs untouched.
            if (mimeType === "image/svg+xml" || !/^https?:\/\//.test(url)) {
                return url;
            }

            const { origin, pathname } = new URL(url);

            return `${origin}/cdn-cgi/image/width=96,height=96,fit=cover,quality=75,format=auto${pathname}`;
        },
    },
};
