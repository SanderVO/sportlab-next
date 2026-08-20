import { isAdmin } from "@/access/admin";
import { Carousel } from "@/blocks/Carousel/config";
import { CycleTimeline } from "@/blocks/CycleTimeline/config";
import { Instagram } from "@/blocks/Instagram/config";
import { MediaCarousel } from "@/blocks/MediaCarousel/config";
import { Team } from "@/blocks/Team/config";
import { hero } from "@/components/Hero/config";
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
        singular: { en: "Page", nl: "Pagina" },
        plural: { en: "Pages", nl: "Pagina's" },
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
        defaultColumns: ["title", "slug", "parent", "updatedAt"],
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
            label: { en: "Parent", nl: "Valt onder" },
            name: "parent",
            type: "relationship",
            relationTo: "pages",
            hasMany: false,
            required: false,
            filterOptions: {
                publishedAt: { not_equals: null },
            },
            admin: {
                description: {
                    en: "Select a parent page here, if applicable.",
                    nl: "Kies hier een bovenliggende pagina, indien van toepassing.",
                },
            },
        },
        {
            label: { en: "Title", nl: "Titel" },
            name: "title",
            type: "text",
            required: true,
        },
        {
            label: { en: "Has hero", nl: "Met Hero" },
            name: "hasHero",
            type: "checkbox",
            required: true,
        },
        {
            type: "tabs",
            tabs: [
                {
                    fields: [hero],
                    label: { en: "Hero", nl: "Hero" },
                    admin: {
                        condition: (_, siblingData) => {
                            return siblingData?.hasHero === true;
                        },
                    },
                },
                {
                    fields: [
                        {
                            name: "layout",
                            type: "blocks",
                            blocks: [
                                Content,
                                Carousel,
                                Team,
                                Instagram,
                                CycleTimeline,
                                MediaCarousel,
                            ],
                            required: true,
                            admin: {
                                initCollapsed: true,
                            },
                        },
                    ],
                    label: { en: "Content", nl: "Content" },
                },
                {
                    name: "meta",
                    label: { en: "SEO", nl: "SEO" },
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
                            hasGenerateFn: true,
                            titlePath: "meta.title",
                            descriptionPath: "meta.description",
                        }),
                        {
                            label: { en: "Rich snippets", nl: "Rich Snippets" },
                            name: "richSnippets",
                            type: "array",
                            fields: [
                                {
                                    label: {
                                        en: "Rich snippet JSON-LD",
                                        nl: "Rich Snippet JSON-LD",
                                    },
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
