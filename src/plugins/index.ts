import { editorOrAdmin } from "@/access/editorOrAdmin";
import { isCoachOnlyAdminUser } from "@/access/isCoachOnlyAdminUser";
import { rolesOf } from "@/access/rolesOf";
import { RolesEnum } from "@/collections/Users/roles";
import { emailLayout } from "@/emails/layout";
import { revalidateRedirects } from "@/hooks/revalidateRedirects";
import { verifyTurnstile } from "@/hooks/verifyTurnstile";
import { Page, Post } from "@/payload-types";
import { getServerSideURL } from "@/utilities/getURL";
import { relationshipID } from "@/utilities/relationshipID";
import { formBuilderPlugin } from "@payloadcms/plugin-form-builder";
import { mcpPlugin } from "@payloadcms/plugin-mcp";
import { redirectsPlugin } from "@payloadcms/plugin-redirects";
import { seoPlugin } from "@payloadcms/plugin-seo";
import { GenerateURL } from "@payloadcms/plugin-seo/types";
import {
    FixedToolbarFeature,
    lexicalEditor,
} from "@payloadcms/richtext-lexical";
import { translateMcpApiKeyCollection } from "./mcpApiKeyCollection";
import { APIError } from "payload";
import type {
    Access,
    CollectionBeforeChangeHook,
    CollectionBeforeValidateHook,
    Field,
    FieldAccess,
    Plugin,
} from "payload";

const generateURL: GenerateURL<Post | Page> = ({
    doc,
}: {
    doc: Post | Page | null;
}) => {
    const url = getServerSideURL();

    return doc?.slug ? `${url}/${doc.slug}` : url;
};

const replaceSelectValuesWithLabels: CollectionBeforeChangeHook = async ({
    data,
    operation,
    req,
}) => {
    if (operation !== "create") return data;
    if (!data?.form || !Array.isArray(data?.submissionData)) return data;

    const formID =
        typeof data.form === "object" && data.form !== null
            ? data.form.id
            : data.form;

    if (!formID) return data;

    const form = await req.payload.findByID({
        collection: "forms",
        id: formID,
        req,
    });

    if (!Array.isArray(form?.fields)) return data;

    const optionsByField = new Map<string, Map<string, string>>();

    form.fields.forEach((field) => {
        if (
            !field ||
            typeof field !== "object" ||
            !("blockType" in field) ||
            !("name" in field)
        ) {
            return;
        }

        if (field.blockType !== "select") {
            return;
        }

        if (!Array.isArray(field.options)) {
            return;
        }

        const optionMap = new Map<string, string>();

        field.options.forEach((option) => {
            if (!option) return;

            optionMap.set(String(option.value), option.label);
        });

        optionsByField.set(field.name, optionMap);
    });

    const submissionData = data.submissionData.map((entry) => {
        const options = optionsByField.get(entry.field);
        if (!options) return entry;

        const valueAsString = String(entry.value);
        const label = options.get(valueAsString);

        if (!label) return entry;

        return {
            ...entry,
            value: label,
        };
    });

    return {
        ...data,
        submissionData,
    };
};

const mcpCrudWithoutDelete = {
    create: true,
    find: true,
    update: true,
    delete: false,
};

/** Staff roles that may edit forms, view submissions and issue MCP keys. */
const isStaff: Access = ({ req: { user } }) => {
    const roles = rolesOf(user);

    return (
        roles.includes(RolesEnum.ADMIN) ||
        roles.includes(RolesEnum.EDITOR) ||
        roles.includes(RolesEnum.COACH)
    );
};

/** Field-level variant for the notification recipients of a form. */
const editorOrAdminField: FieldAccess = ({ req }) => {
    const roles = rolesOf(req.user);

    return roles.includes(RolesEnum.ADMIN) || roles.includes(RolesEnum.EDITOR);
};

// Redirects are followed for every public visitor, and the plugin stores `to.url` as free text.
// Only allow internal paths or absolute https URLs on the site's own hosts.
const redirectHosts = new Set<string>();

try {
    const siteURL = new URL(getServerSideURL());
    const bareHost = siteURL.hostname.replace(/^www\./, "");

    redirectHosts.add(bareHost);
    redirectHosts.add(`www.${bareHost}`);
} catch {
    // getServerSideURL returns a URL string; a malformed override disables external redirects.
}

const isSafeRedirectTarget = (value: string): boolean => {
    const url = value.trim();

    if (!url) {
        return false;
    }

    // Check both the raw value and its percent-decoded form: browsers can treat
    // "%5C" / "%2F" sequences as path separators (e.g. "/%5Cevil.com").
    const candidates = [url];

    try {
        candidates.push(decodeURIComponent(url));
    } catch {
        return false;
    }

    for (const candidate of candidates) {
        if (
            candidate.includes("\\") ||
            /[\u0000-\u001f\u007f]/.test(candidate)
        ) {
            return false;
        }
    }

    if (url.startsWith("/")) {
        return !candidates.some((candidate) => candidate.startsWith("//"));
    }

    try {
        const parsed = new URL(url);

        return (
            parsed.protocol === "https:" &&
            !parsed.username &&
            !parsed.password &&
            redirectHosts.has(parsed.hostname)
        );
    } catch {
        return false;
    }
};

const validateRedirectTarget: CollectionBeforeValidateHook = ({
    data,
    originalDoc,
}) => {
    const dataTarget = data?.to as
        | { type?: unknown; url?: unknown }
        | undefined;
    const originalTarget = (
        originalDoc as { to?: { type?: unknown; url?: unknown } } | undefined
    )?.to;
    const targetType = dataTarget?.type ?? originalTarget?.type;

    // Only custom URLs are free text; reference targets are checked by Payload.
    if (targetType !== "custom") {
        return data;
    }

    const url = dataTarget?.url ?? originalTarget?.url;

    if (typeof url !== "string" || url.length === 0) {
        return data;
    }

    if (!isSafeRedirectTarget(url)) {
        throw new APIError(
            "Redirect target must be an internal path or an https URL on this site.",
            400,
            undefined,
            true,
        );
    }

    return data;
};

export const plugins: Plugin[] = [
    // Lets LLM clients work with content over MCP (POST /api/mcp). Collections can be created, read
    // and updated, never deleted. Left out: users, and everything related to subscriptions and
    // credits (subscription plans, plan prices, subscriptions, credit adjustments, lesson
    // enrollments, which enforce credits). No globals. Workout blocks are part of lessons.
    // Keys act as the user they belong to, so each collection's access control still applies.
    mcpPlugin({
        collections: {
            pages: {
                description:
                    "Website pages of Sportlab Groningen, including their content blocks, hero and SEO fields. New pages and changes are always saved as a draft (concept) that a person publishes in the CMS.",
                enabled: mcpCrudWithoutDelete,
            },
            posts: {
                description: "Blog posts of Sportlab Groningen.",
                enabled: mcpCrudWithoutDelete,
            },
            media: {
                description: "Images and other media files.",
                enabled: mcpCrudWithoutDelete,
            },
            documents: {
                description: "Downloadable documents.",
                enabled: mcpCrudWithoutDelete,
            },
            lessons: {
                description:
                    "Lessons of Sportlab Groningen, including their workout blocks (workout details and exercises).",
                enabled: mcpCrudWithoutDelete,
            },
            "lesson-templates": {
                description: "Templates that lessons are created from.",
                enabled: mcpCrudWithoutDelete,
            },
            events: {
                description: "Events of Sportlab Groningen.",
                enabled: mcpCrudWithoutDelete,
            },
            exercises: {
                description: "Exercises that can be used in workout blocks.",
                enabled: mcpCrudWithoutDelete,
            },
            programs: {
                description: "Training programs of Sportlab Groningen.",
                enabled: mcpCrudWithoutDelete,
            },
            "lesson-exercise-tracking": {
                description: "Exercise results tracked per lesson.",
                enabled: mcpCrudWithoutDelete,
            },
            "program-enrollments": {
                description: "Enrollments of members in programs.",
                enabled: mcpCrudWithoutDelete,
            },
            "event-registrations": {
                description: "Registrations of members for events.",
                enabled: mcpCrudWithoutDelete,
            },
            "health-measurements": {
                description: "Health measurements of members.",
                enabled: mcpCrudWithoutDelete,
            },
            "coach-notes": {
                description: "Notes coaches keep about members.",
                enabled: mcpCrudWithoutDelete,
            },
        },
        // The plugin loads the key's user at depth 1, and Users limits populated users to a few
        // fields (`defaultPopulate`), so the user arrives without `roles` and every role-based
        // access check (lessons, exercises) would refuse. Load the whole user instead, so MCP acts
        // with the roles of the user the key belongs to.
        overrideAuth: async (req, getDefaultMcpAccessSettings) => {
            const settings = await getDefaultMcpAccessSettings();
            const userID = relationshipID(settings.user);

            if (!userID) return settings;

            const user = await req.payload.findByID({
                collection: "users",
                id: userID,
                depth: 0,
                overrideAccess: true,
            });

            return {
                ...settings,
                user: {
                    ...user,
                    collection: "users",
                    _strategy: "mcp-api-key",
                },
            } as typeof settings;
        },
        overrideApiKeyCollection: (collection) => {
            const translated = translateMcpApiKeyCollection(collection);

            return {
                ...translated,
                access: {
                    ...translated.access,
                    // Members must not self-issue long-lived API keys. Keys act as the
                    // user they belong to, so only staff may create them.
                    create: isStaff,
                },
                admin: {
                    ...translated.admin,
                    hidden: ({ user }) => isCoachOnlyAdminUser(user),
                },
            };
        },
    }),
    redirectsPlugin({
        collections: ["pages", "posts"],
        overrides: {
            access: {
                read: () => true,
                create: editorOrAdmin,
                update: editorOrAdmin,
                delete: editorOrAdmin,
            },
            admin: {
                hidden: ({ user }) => isCoachOnlyAdminUser(user),
            },
            fields: ({ defaultFields }) => {
                return defaultFields.map((field) => {
                    if ("name" in field && field.name === "from") {
                        return {
                            ...field,
                            admin: {
                                description:
                                    { en: "You will need to rebuild the website when changing this field.", nl: "Je moet de website opnieuw bouwen wanneer je dit veld wijzigt." },
                            },
                        };
                    }
                    return field;
                }) as Field[];
            },
            hooks: {
                beforeValidate: [validateRedirectTarget],
                afterChange: [revalidateRedirects],
            },
        },
    }),
    seoPlugin({
        generateTitle: ({ doc }: { doc: Post | Page }) =>
            `${doc.title} - Sportlab Groningen`,
        generateURL,
        fields: ({ defaultFields }: { defaultFields: Field[] }) => {
            return [
                ...defaultFields,
                {
                    label: { en: "Rich Snippets", nl: "Rich Snippets" },
                    name: "richSnippets",
                    type: "array",
                    admin: {
                        description:
                            { en: "Add JSON-LD rich snippets for this page to help search engines better understand its content.", nl: "Voeg JSON-LD rich snippets toe voor deze pagina om zoekmachines te helpen de inhoud van uw pagina beter te begrijpen." },
                    },
                    fields: [
                        {
                            label: { en: "Rich Snippet JSON-LD", nl: "Rich Snippet JSON-LD" },
                            name: "jsonLd",
                            type: "json",
                        },
                    ],
                },
            ];
        },
    }),
    formBuilderPlugin({
        beforeEmail: (emails) =>
            emails.map((email) => ({
                ...email,
                html: emailLayout(email.html),
            })),
        fields: {
            payment: false,
            state: false,
            country: false,
            date: false,
            text: {
                labels: {
                    singular: { en: "Text field", nl: "Tekstveld" },
                    plural: { en: "Text fields", nl: "Tekstvelden" },
                },
            },
            textarea: {
                labels: {
                    singular: { en: "Text area", nl: "Tekstgebied" },
                    plural: { en: "Text areas", nl: "Tekstgebieden" },
                },
            },
            email: {
                labels: {
                    singular: { en: "Email field", nl: "E-mailveld" },
                    plural: { en: "Email fields", nl: "E-mailvelden" },
                },
            },
            select: {
                labels: {
                    singular: { en: "Select field", nl: "Selectievakje" },
                    plural: { en: "Select fields", nl: "Selectievakjes" },
                },
            },
            checkbox: {
                labels: {
                    singular: { en: "Checkbox field", nl: "Checkbox veld" },
                    plural: { en: "Checkbox fields", nl: "Checkbox velden" },
                },
            },
        },
        formSubmissionOverrides: {
            access: {
                // Public visitors may still submit (Turnstile-gated below); the stored
                // submissions contain personal data, so only staff may read or delete them.
                create: () => true,
                read: editorOrAdmin,
                update: () => false,
                delete: editorOrAdmin,
            },
            admin: {
                hidden: ({ user }) => isCoachOnlyAdminUser(user),
            },
            labels: {
                singular: { en: "Form submission", nl: "Formulier Submissie" },
                plural: { en: "Form submissions", nl: "Formulier Submissies" },
            },
            hooks: {
                beforeValidate: [verifyTurnstile],
                beforeChange: [replaceSelectValuesWithLabels],
            },
        },
        formOverrides: {
            access: {
                // Forms are public content: anyone may read the definition to render it,
                // but only staff may change fields, recipients or delete a form.
                create: editorOrAdmin,
                update: editorOrAdmin,
                delete: editorOrAdmin,
            },
            admin: {
                hidden: ({ user }) => isCoachOnlyAdminUser(user),
            },
            labels: {
                singular: { en: "Form", nl: "Formulier" },
                plural: { en: "Forms", nl: "Formulieren" },
            },
            fields: ({ defaultFields }: { defaultFields: Field[] }) => {
                return defaultFields.map((field) => {
                    if ("name" in field && field.name === "title") {
                        return {
                            ...field,
                            label: { en: "Title", nl: "Titel" },
                        };
                    }

                    if ("name" in field && field.name === "submitButton") {
                        return {
                            ...field,
                            label: { en: "Submit button text", nl: "Bevestigknop tekst" },
                        };
                    }

                    if ("name" in field && field.name === "submitButtonLabel") {
                        return {
                            ...field,
                            label: { en: "Submit button text", nl: "Bevestigknop tekst" },
                        };
                    }

                    if ("name" in field && field.name === "confirmationType") {
                        return {
                            ...field,
                            label: { en: "Confirmation type", nl: "Bevestig type" },
                            admin: {
                                ...field.admin,
                                description:
                                    { en: "Indicate what type of confirmation the user should receive", nl: "Geef aan wat voor type bevestiging de gebruiker moet krijgen" },
                            },
                        };
                    }

                    if (
                        "name" in field &&
                        field.name === "confirmationType-message"
                    ) {
                        return {
                            ...field,
                            label: { en: "Message", nl: "Bericht" },
                        };
                    }

                    if (
                        "name" in field &&
                        field.name === "confirmationType-redirect"
                    ) {
                        return {
                            ...field,
                            label: { en: "Redirect URL", nl: "Verwijzing URL" },
                        };
                    }

                    if (
                        "name" in field &&
                        field.name === "confirmationMessage"
                    ) {
                        return {
                            ...field,
                            label: { en: "Confirmation message", nl: "Bevestigingsbericht" },
                            editor: lexicalEditor({
                                features: ({ rootFeatures }) => {
                                    return [
                                        ...rootFeatures,
                                        FixedToolbarFeature(),
                                    ];
                                },
                            }),
                        };
                    }

                    if ("name" in field && field.name === "emails") {
                        return {
                            ...field,
                            access: {
                                ...("access" in field
                                    ? field.access
                                    : undefined),
                                read: editorOrAdminField,
                                update: editorOrAdminField,
                            },
                            admin: {
                                ...field.admin,
                                description:
                                    { en: "Send custom emails when the form is submitted. Use comma-separated lists to send the same email to multiple recipients. To reference a value from this form, wrap the name of that field in double curly braces, for example {{firstName}}. You can use a wildcard {{*}} to output all data and {{*:table}} to format it as an HTML table in the email.", nl: "Stuur aangepaste e-mails wanneer het formulier wordt ingediend. Gebruik komma-gescheiden lijsten om dezelfde e-mail naar meerdere ontvangers te sturen. Om een waarde uit deze vorm te verwijzen, wikkel je de naam van dat veld in met dubbele krulhaken, bijvoorbeeld {{firstName}}. Je kunt een wildcard {{*}} gebruiken om alle data uit te voeren en {{*:table}} om het als een HTML-tabel in de e-mail te formatteren." },
                            },
                        };
                    }
                    return field;
                }) as Field[];
            },
        },
    }),
];
