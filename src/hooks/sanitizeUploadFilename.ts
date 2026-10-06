import type { CollectionBeforeOperationHook } from "payload";

/**
 * Turns an uploaded file name into a safe, URL-friendly R2 object key:
 * lowercase ASCII letters, digits, dots, dashes and underscores only.
 */
export const toSafeFilename = (filename: string): string => {
    const dot = filename.lastIndexOf(".");
    const base = dot > 0 ? filename.slice(0, dot) : filename;
    const extension = dot > 0 ? filename.slice(dot + 1) : "";

    const safeBase =
        base
            .normalize("NFKD")
            .replace(/[̀-ͯ]/g, "")
            .toLowerCase()
            .replace(/[^a-z0-9._-]+/g, "-")
            .replace(/\.{2,}/g, ".")
            .replace(/-{2,}/g, "-")
            .replace(/^[-.]+|[-.]+$/g, "")
            .slice(0, 100) || "file";

    const safeExtension = extension.toLowerCase().replace(/[^a-z0-9]/g, "");

    return safeExtension ? `${safeBase}.${safeExtension}` : safeBase;
};

export const sanitizeUploadFilename: CollectionBeforeOperationHook = ({
    args,
    operation,
}) => {
    if (operation !== "create" && operation !== "update") return args;

    const file = args?.req?.file;

    if (file?.name) {
        file.name = toSafeFilename(file.name);
    }

    return args;
};
