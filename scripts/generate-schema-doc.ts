/**
 * Writes docs/data-schema.md: the Payload collections and globals as a compact field reference,
 * for the One More Reason design system (so new pages are designed around real data).
 * Run with `pnpm generate:schema-doc`. Reads the config only; it never touches the database.
 */
import { writeFile } from "node:fs/promises";
import path from "node:path";
import type { Field, SanitizedConfig } from "payload";
import configPromise from "../src/payload.config";

// Fields Payload adds itself to auth collections.
const AUTH_INTERNALS = new Set([
    "salt",
    "hash",
    "loginAttempts",
    "lockUntil",
    "resetPasswordToken",
    "resetPasswordExpiration",
    "sessions",
    "_verified",
    "_verificationToken",
    "enableAPIKey",
    "apiKey",
    "apiKeyIndex",
]);

const label = (value: unknown): string => {
    if (typeof value === "string") return value;
    if (value && typeof value === "object") {
        const labels = value as Record<string, string>;
        return labels.nl ?? labels.en ?? "";
    }
    return "";
};

const describeField = (field: Field): string => {
    const parts: string[] = [field.type];
    const f = field as unknown as Record<string, unknown>;

    if (f.required) parts.push("required");
    if (f.hasMany) parts.push("many");
    if (f.localized) parts.push("localized");
    if (f.relationTo) {
        parts.push(`→ ${([] as string[]).concat(f.relationTo as string | string[]).join(" | ")}`);
    }
    if (Array.isArray(f.options)) {
        const values = (f.options as Array<string | { value: string }>).map(
            (o) => (typeof o === "string" ? o : o.value),
        );
        parts.push(`one of: ${values.join(", ")}`);
    }
    if (typeof f.min === "number") parts.push(`min ${f.min}`);
    if (typeof f.max === "number") parts.push(`max ${f.max}`);
    if (f.defaultValue !== undefined && typeof f.defaultValue !== "function") {
        parts.push(`default ${JSON.stringify(f.defaultValue)}`);
    }

    return parts.join(", ");
};

const renderFields = (fields: Field[], depth: number): string[] => {
    const indent = "  ".repeat(depth);
    const lines: string[] = [];

    for (const field of fields) {
        const f = field as unknown as Record<string, unknown>;
        const name = typeof f.name === "string" ? f.name : undefined;

        if (name && (AUTH_INTERNALS.has(name) || name === "_status")) continue;

        if (field.type === "tabs") {
            for (const tab of field.tabs) {
                if ("name" in tab && tab.name) {
                    lines.push(`${indent}- \`${tab.name}\` (group)`);
                    lines.push(...renderFields(tab.fields, depth + 1));
                } else {
                    lines.push(...renderFields(tab.fields, depth));
                }
            }
            continue;
        }

        if (field.type === "row" || field.type === "collapsible" || (field.type === "group" && !name)) {
            lines.push(...renderFields(field.fields, depth));
            continue;
        }

        if (!name) continue;

        const text = label(f.label);
        lines.push(`${indent}- \`${name}\` (${describeField(field)})${text ? `: ${text}` : ""}`);

        if (field.type === "array" || field.type === "group") {
            lines.push(...renderFields(field.fields, depth + 1));
        } else if (field.type === "blocks") {
            for (const block of field.blocks) {
                lines.push(`${indent}  - block \`${block.slug}\``);
                lines.push(...renderFields(block.fields, depth + 2));
            }
        }
    }

    return lines;
};

const isInternal = (slug: string) => slug.startsWith("payload-");

const render = (config: SanitizedConfig): string => {
    const out: string[] = [
        "# Data schema",
        "",
        "Generated from the Payload config by `pnpm generate:schema-doc`; do not edit by hand.",
        "Field names are the API names. Labels (Dutch) follow the colon. `→` marks a relationship.",
        "Access rules live in code and are not listed here. Collections marked *dashboard only* are not in the CMS; they are used by the member dashboard.",
        "",
        "## Collections",
        "",
    ];

    for (const collection of config.collections) {
        if (isInternal(collection.slug)) continue;

        const hidden = collection.custom?.dashboardOnly ? " *(dashboard only)*" : "";
        const flags = [
            collection.auth ? "auth" : "",
            collection.upload ? "upload" : "",
            collection.versions?.drafts ? "drafts" : "",
        ].filter(Boolean);

        out.push(`### ${collection.slug}${hidden}`);
        out.push("");
        const title = label(collection.labels?.singular);
        out.push([title, flags.join(", ")].filter(Boolean).join(" · "));
        out.push("");
        out.push(...renderFields(collection.fields, 0), "");
    }

    out.push("## Globals", "");

    for (const global of config.globals) {
        out.push(`### ${global.slug}`, "");
        out.push(...renderFields(global.fields, 0), "");
    }

    return out.join("\n").replace(/\n{3,}/g, "\n\n");
};

const config = await configPromise;
const target = path.resolve(import.meta.dirname, "../docs/data-schema.md");

await writeFile(target, render(config));
console.log(`Wrote ${target}`);
