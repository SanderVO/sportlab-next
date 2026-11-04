import type { CollectionConfig, Field } from "payload";

type Localized = { en: string; nl: string };

const operationLabels: Record<string, Localized> = {
    Find: { en: "Find", nl: "Zoeken" },
    Create: { en: "Create", nl: "Aanmaken" },
    Update: { en: "Update", nl: "Bijwerken" },
    Delete: { en: "Delete", nl: "Verwijderen" },
};

const operationDescriptions: Record<string, (what: string) => Localized> = {
    find: (slug) => ({
        en: `Allow clients to find ${slug}.`,
        nl: `Sta clients toe om ${slug} te zoeken.`,
    }),
    create: (slug) => ({
        en: `Allow clients to create ${slug}.`,
        nl: `Sta clients toe om ${slug} aan te maken.`,
    }),
    update: (slug) => ({
        en: `Allow clients to update ${slug}.`,
        nl: `Sta clients toe om ${slug} bij te werken.`,
    }),
    delete: (slug) => ({
        en: `Allow clients to delete ${slug}.`,
        nl: `Sta clients toe om ${slug} te verwijderen.`,
    }),
};

const fieldTexts: Record<string, { label?: Localized; description?: Localized }> = {
    user: {
        label: { en: "User", nl: "Gebruiker" },
        description: {
            en: "The user that the API key is associated with.",
            nl: "De gebruiker waaraan de API-sleutel gekoppeld is.",
        },
    },
    label: {
        label: { en: "Label", nl: "Label" },
        description: {
            en: "A useful label for the API key.",
            nl: "Een herkenbaar label voor de API-sleutel.",
        },
    },
    description: {
        label: { en: "Description", nl: "Omschrijving" },
        description: {
            en: "The purpose of the API key.",
            nl: "Waarvoor de API-sleutel gebruikt wordt.",
        },
    },
};

/** Dutch names for the slugs that appear in the generated permission descriptions. */
const slugNames: Record<string, Localized> = {
    pages: { en: "pages", nl: "pagina's" },
    lessons: { en: "lessons (including workout blocks)", nl: "lessen (inclusief workoutblokken)" },
    exercises: { en: "exercises", nl: "oefeningen" },
};

const collectionLabels: Record<string, Localized> = {
    pages: { en: "Pages", nl: "Pagina's" },
    lessons: { en: "Lessons", nl: "Lessen" },
    exercises: { en: "Exercises", nl: "Oefeningen" },
};

const translateField = (field: Field): Field => {
    const f = { ...field } as Record<string, unknown>;

    if (f.type === "collapsible" && typeof f.label === "string") {
        const names = collectionLabels[f.label.toLowerCase()];
        if (names) f.label = names;
    }

    if (f.type === "group" && f.label === "collection") {
        f.label = { en: "Collection", nl: "Collectie" };
    }

    if (f.type === "checkbox" && typeof f.label === "string") {
        const label = operationLabels[f.label];
        const name = f.name as string;
        if (label) f.label = label;

        const describe = operationDescriptions[name];
        const description = (f.admin as { description?: unknown } | undefined)
            ?.description;
        if (describe && typeof description === "string") {
            const match = description.match(/^Allow clients to \w+ (.+)\.$/);
            const slug = match?.[1];
            if (slug) {
                const names = slugNames[slug];
                const base = describe(slug);
                f.admin = {
                    ...(f.admin as object),
                    description: names
                        ? {
                              en: describe(names.en).en,
                              nl: describe(names.nl).nl,
                          }
                        : base,
                };
            }
        }
    }

    const named = typeof f.name === "string" ? fieldTexts[f.name] : undefined;
    if (named && f.type !== "group" && f.type !== "checkbox") {
        if (named.label) f.label = named.label;
        if (named.description) {
            f.admin = { ...(f.admin as object), description: named.description };
        }
    }

    if (Array.isArray(f.fields)) {
        f.fields = (f.fields as Field[]).map(translateField);
    }

    return f as unknown as Field;
};

/** Dutch (and explicit English) labels for the plugin's API key collection. */
export const translateMcpApiKeyCollection = (
    collection: CollectionConfig,
): CollectionConfig => ({
    ...collection,
    labels: {
        singular: { en: "MCP API key", nl: "MCP API-sleutel" },
        plural: { en: "MCP API keys", nl: "MCP API-sleutels" },
    },
    admin: {
        ...collection.admin,
        group: { en: "MCP", nl: "MCP" },
        description: {
            en: "API keys control which collections MCP clients can access.",
            nl: "API-sleutels bepalen tot welke collecties MCP-clients toegang hebben.",
        },
    },
    fields: collection.fields.map(translateField),
});
