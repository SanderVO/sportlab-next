import { revalidateRedirects } from "@/hooks/revalidateRedirects";
import { Page, Post } from "@/payload-types";
import { beforeSyncWithSearch } from "@/search/beforeSync";
import { searchFields } from "@/search/fieldOverrides";
import { getServerSideURL } from "@/utilities/getURL";
import { formBuilderPlugin } from "@payloadcms/plugin-form-builder";
import { nestedDocsPlugin } from "@payloadcms/plugin-nested-docs";
import { redirectsPlugin } from "@payloadcms/plugin-redirects";
import { searchPlugin } from "@payloadcms/plugin-search";
import { seoPlugin } from "@payloadcms/plugin-seo";
import { GenerateURL } from "@payloadcms/plugin-seo/types";
import {
    FixedToolbarFeature,
    HeadingFeature,
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
            fields: ({ defaultFields }) => {
                return defaultFields.map((field) => {
                    if (
                        "name" in field &&
                        field.name === "confirmationMessage"
                    ) {
                        return {
                            ...field,
                            editor: lexicalEditor({
                                features: ({ rootFeatures }) => {
                                    return [
                                        ...rootFeatures,
                                        FixedToolbarFeature(),
                                        HeadingFeature({
                                            enabledHeadingSizes: [
                                                "h1",
                                                "h2",
                                                "h3",
                                                "h4",
                                            ],
                                        }),
                                    ];
                                },
                            }),
                        };
                    }
                    return field;
                });
            },
        },
    }),
    searchPlugin({
        collections: ["posts"],
        beforeSync: beforeSyncWithSearch,
        searchOverrides: {
            labels: {
                singular: "Zoekresultaat",
                plural: "Zoekresultaten",
            },
            fields: ({ defaultFields }) => {
                return [...defaultFields, ...searchFields];
            },
        },
    }),
];
