import { isAdminOrCoach } from "@/access/isAdminOrCoach";
import {
    BoldFeature,
    ItalicFeature,
    lexicalEditor,
    LinkFeature,
    OrderedListFeature,
    ParagraphFeature,
    UnorderedListFeature,
} from "@payloadcms/richtext-lexical";
import { slugField, type CollectionConfig } from "payload";

export const Programs: CollectionConfig = {
    slug: "programs",
    labels: {
        singular: "Programma",
        plural: "Programma's",
    },
    access: {
        create: isAdminOrCoach,
        delete: isAdminOrCoach,
        read: () => true,
        update: isAdminOrCoach,
    },
    admin: {
        useAsTitle: "title",
        defaultColumns: ["title", "startDate", "endDate", "updatedAt"],
    },
    fields: [
        {
            label: "Titel",
            name: "title",
            type: "text",
            required: true,
        },
        {
            label: "Startdatum",
            name: "startDate",
            type: "date",
            required: true,
            admin: {
                date: { pickerAppearance: "dayOnly" },
            },
        },
        {
            label: "Einddatum",
            name: "endDate",
            type: "date",
            required: true,
            admin: {
                date: { pickerAppearance: "dayOnly" },
            },
        },
        {
            label: "Banner Afbeelding",
            name: "bannerImage",
            type: "upload",
            relationTo: "media",
            required: true,
        },
        {
            label: "Beschrijving",
            name: "description",
            type: "richText",
            required: true,
            editor: lexicalEditor({
                features: [
                    ParagraphFeature(),
                    BoldFeature(),
                    ItalicFeature(),
                    UnorderedListFeature(),
                    OrderedListFeature(),
                    LinkFeature(),
                ],
            }),
        },
        {
            label: "Lessen",
            name: "schedule",
            type: "array",
            required: true,
            fields: [
                {
                    label: "Datum",
                    name: "date",
                    type: "date",
                    required: true,
                    admin: {
                        date: { pickerAppearance: "dayAndTime" },
                        description:
                            "Kies een datum binnen de start- en einddatum van het programma.",
                    },
                    validate: (
                        value: Date | null | undefined,
                        { data }: { data: Record<string, unknown> },
                    ) => {
                        if (!value) return true;
                        const start = data?.startDate as string | undefined;
                        const end = data?.endDate as string | undefined;
                        if (start && new Date(value) < new Date(start)) {
                            return "Datum moet na de startdatum van het programma liggen.";
                        }
                        if (end && new Date(value) > new Date(end)) {
                            return "Datum moet voor de einddatum van het programma liggen.";
                        }
                        return true;
                    },
                },
                {
                    label: "Les",
                    name: "lessons",
                    type: "relationship",
                    relationTo: "lessons",
                    hasMany: false,
                    required: true,
                },
            ],
        },
        {
            label: "Eindevent",
            name: "finalEvent",
            type: "relationship",
            relationTo: "events",
            hasMany: false,
            required: false,
        },
        {
            label: "Externe ID",
            name: "externalId",
            type: "text",
            unique: true,
            required: false,
            admin: {
                description:
                    "Gebruik dit veld om programma's idempotent te importeren via CSV.",
            },
        },
        slugField({
            required: false,
            useAsSlug: "title",
        }),
    ],
};
