import { revalidateRedirects } from "@/hooks/revalidateRedirects";
import { Page, Post } from "@/payload-types";
import { getServerSideURL } from "@/utilities/getURL";
import { formBuilderPlugin } from "@payloadcms/plugin-form-builder";
import { nestedDocsPlugin } from "@payloadcms/plugin-nested-docs";
import { redirectsPlugin } from "@payloadcms/plugin-redirects";
import { seoPlugin } from "@payloadcms/plugin-seo";
import { GenerateURL } from "@payloadcms/plugin-seo/types";
import {
    FixedToolbarFeature,
    lexicalEditor,
} from "@payloadcms/richtext-lexical";
import { Plugin } from "payload";

const generateURL: GenerateURL<Post | Page> = ({ doc }) => {
    const url = getServerSideURL();

    return doc?.slug ? `${url}/${doc.slug}` : url;
};

export const plugins: Plugin[] = [
    redirectsPlugin({
        collections: ["pages", "posts"],
        overrides: {
            // @ts-expect-error - This is a valid override, mapped fields don't resolve to the same type
            fields: ({ defaultFields }) => {
                return defaultFields.map((field) => {
                    if ("name" in field && field.name === "from") {
                        return {
                            ...field,
                            admin: {
                                description:
                                    "You will need to rebuild the website when changing this field.",
                            },
                        };
                    }
                    return field;
                });
            },
            hooks: {
                afterChange: [revalidateRedirects],
            },
        },
    }),
    nestedDocsPlugin({
        collections: [],
        generateURL: (docs) =>
            docs.reduce((url, doc) => `${url}/${doc.slug}`, ""),
    }),
    seoPlugin({
        generateTitle: ({ doc }) => `${doc.title} - Sportlab Groningen`,
        generateURL,
        fields: ({ defaultFields }) => {
            return [
                ...defaultFields,
                {
                    label: "Rich Snippets",
                    name: "richSnippets",
                    type: "array",
                    fields: [
                        {
                            label: "Rich Snippet JSON-LD",
                            name: "jsonLd",
                            type: "json",
                        },
                    ],
                },
            ];
        },
    }),
    formBuilderPlugin({
        fields: {
            payment: false,
            text: {
                labels: {
                    singular: "Tekstveld",
                    plural: "Tekstvelden",
                },
            },
            textarea: {
                labels: {
                    singular: "Tekstgebied",
                    plural: "Tekstgebieden",
                },
            },
            email: {
                labels: {
                    singular: "E-mailveld",
                    plural: "E-mailvelden",
                },
            },
            select: {
                labels: {
                    singular: "Selectievakje",
                    plural: "Selectievakjes",
                },
            },
            checkbox: {
                labels: {
                    singular: "Checkbox veld",
                    plural: "Checkbox velden",
                },
            },
            date: {
                labels: {
                    singular: "Datumveld",
                    plural: "Datumvelden",
                },
            },
        },
        formSubmissionOverrides: {
            labels: {
                singular: "Formulier Submissie",
                plural: "Formulier Submissies",
            },
        },
        formOverrides: {
            labels: {
                singular: "Formulier",
                plural: "Formulieren",
            },
            // @ts-expect-error - This is a valid override, mapped fields don't resolve to the same type
            fields: ({ defaultFields }) => {
                return defaultFields.map((field) => {
                    if ("name" in field && field.name === "title") {
                        return {
                            ...field,
                            label: "Titel",
                        };
                    }

                    if ("name" in field && field.name === "title") {
                        return {
                            ...field,
                            label: "Titel",
                        };
                    }

                    if ("name" in field && field.name === "submitButton") {
                        return {
                            ...field,
                            label: "Bevestigknop tekst",
                        };
                    }

                    if ("name" in field && field.name === "submitButtonLabel") {
                        return {
                            ...field,
                            label: "Bevestigknop tekst",
                        };
                    }

                    if ("name" in field && field.name === "confirmationType") {
                        return {
                            ...field,
                            label: "Bevestig type",
                            admin: {
                                ...field.admin,
                                description:
                                    "Geef aan wat voor type bevestiging de gebruiker moet krijgen",
                            },
                        };
                    }

                    if (
                        "name" in field &&
                        field.name === "confirmationMessage"
                    ) {
                        return {
                            ...field,
                            label: "Bevestigingsbericht",
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
                                    "Stuur aangepaste e-mails wanneer het formulier wordt ingediend. Gebruik komma-gescheiden lijsten om dezelfde e-mail naar meerdere ontvangers te sturen. Om een waarde uit deze vorm te verwijzen, wikkel je de naam van dat veld in met dubbele krulhaken, bijvoorbeeld {{firstName}}. Je kunt een wildcard {{*}} gebruiken om alle data uit te voeren en {{*:table}} om het als een HTML-tabel in de e-mail te formatteren.",
                            },
                        };
                    }
                    return field;
                });
            },
        },
    }),
];
