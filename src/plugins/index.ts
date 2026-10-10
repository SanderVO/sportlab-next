import { isCoachOnlyAdminUser } from "@/access/isCoachOnlyAdminUser";
import { emailLayout } from "@/emails/layout";
import { revalidateRedirects } from "@/hooks/revalidateRedirects";
import { verifyTurnstile } from "@/hooks/verifyTurnstile";
import { Page, Post } from "@/payload-types";
import { getServerSideURL } from "@/utilities/getURL";
import { formBuilderPlugin } from "@payloadcms/plugin-form-builder";
import { redirectsPlugin } from "@payloadcms/plugin-redirects";
import { seoPlugin } from "@payloadcms/plugin-seo";
import { GenerateURL } from "@payloadcms/plugin-seo/types";
import {
    FixedToolbarFeature,
    lexicalEditor,
} from "@payloadcms/richtext-lexical";
import type { CollectionBeforeChangeHook, Field, Plugin } from "payload";

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

export const plugins: Plugin[] = [
    redirectsPlugin({
        collections: ["pages", "posts"],
        overrides: {
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
