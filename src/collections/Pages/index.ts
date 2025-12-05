import { isAdmin } from "@/access/admin";
import { Carousel } from "@/blocks/Carousel/config";
import { Instagram } from "@/blocks/Instagram/config";
import { Team } from "@/blocks/Team/config";
import { hero } from "@/Hero/config";
import {
    MetaDescriptionField,
    MetaImageField,
    MetaTitleField,
    OverviewField,
    PreviewField,
} from "@payloadcms/plugin-seo/fields";
import type { CollectionConfig } from "payload";
import { slugField } from "payload";
import { authenticatedOrPublished } from "../../access/authenticatedOrPublished";
import { Content } from "../../blocks/Content/config";
import { populatePublishedAt } from "../../hooks/populatePublishedAt";
import { generatePreviewPath } from "../../utilities/generatePreviewPath";
import { revalidateDelete, revalidatePage } from "./hooks/revalidatePage";

export const Pages: CollectionConfig<"pages"> = {
    slug: "pages",
    labels: {
        singular: "Pagina",
        plural: "Pagina's",
    },
    access: {
        create: isAdmin,
        delete: isAdmin,
        read: authenticatedOrPublished,
        update: isAdmin,
    },
    defaultPopulate: {
        title: true,
        slug: true,
    },
    admin: {
        defaultColumns: ["title", "slug", "updatedAt"],
        livePreview: {
            url: ({ data, req }) =>
                generatePreviewPath({
                    slug: data?.slug,
                    collection: "pages",
                    req,
                }),
        },
        preview: (data, { req }) =>
            generatePreviewPath({
                slug: data?.slug as string,
                collection: "pages",
                req,
            }),
        useAsTitle: "title",
    },
    hooks: {
        afterChange: [revalidatePage],
        beforeChange: [populatePublishedAt],
        afterDelete: [revalidateDelete],
    },
    versions: {
        drafts: {
            autosave: {
                interval: 100,
            },
            schedulePublish: true,
        },
        maxPerDoc: 50,
    },
    fields: [
        {
            label: "Titel",
            name: "title",
            type: "text",
            required: true,
        },
        {
            type: "tabs",
            tabs: [
                {
                    fields: [hero],
                    label: "Hero",
                },
                {
                    fields: [
                        {
                            name: "layout",
                            type: "blocks",
                            blocks: [Content, Carousel, Team, Instagram],
                            required: true,
                            admin: {
                                initCollapsed: true,
                            },
                        },
                    ],
                    label: "Content",
                },
                {
                    name: "meta",
                    label: "SEO",
                    fields: [
                        OverviewField({
                            titlePath: "meta.title",
                            descriptionPath: "meta.description",
                            imagePath: "meta.image",
                        }),
                        MetaTitleField({
                            hasGenerateFn: true,
                        }),
                        MetaImageField({
                            relationTo: "media",
                        }),
                        MetaDescriptionField({}),
                        PreviewField({
                            // if the `generateUrl` function is configured
                            hasGenerateFn: true,
                            // field paths to match the target field for data
                            titlePath: "meta.title",
                            descriptionPath: "meta.description",
                        }),
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
                    ],
                },
            ],
        },
        {
            name: "publishedAt",
            type: "date",
            admin: {
                position: "sidebar",
            },
        },
        slugField(),
    ],
};
