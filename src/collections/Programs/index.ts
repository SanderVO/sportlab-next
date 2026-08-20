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
        singular: { en: "Program", nl: "Programma" },
        plural: { en: "Programs", nl: "Programma's" },
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
        description:
            "Beheer programma's met een start- en einddatum, lessen en een optioneel eindevent (bijvoorbeeld: Performance Cycle).",
    },
    fields: [
        {
            label: { en: "Title", nl: "Titel" },
            name: "title",
            type: "text",
            required: true,
        },
        {
            label: { en: "Start date", nl: "Startdatum" },
            name: "startDate",
            type: "date",
            required: true,
            admin: {
                date: { pickerAppearance: "dayOnly" },
            },
        },
        {
            label: { en: "End date", nl: "Einddatum" },
            name: "endDate",
            type: "date",
            required: true,
            admin: {
                date: { pickerAppearance: "dayOnly" },
            },
        },
        {
            label: { en: "Banner image", nl: "Banner afbeelding" },
            name: "bannerImage",
            type: "upload",
            relationTo: "media",
            required: true,
        },
        {
            label: { en: "Description", nl: "Beschrijving" },
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
            label: { en: "Lessons", nl: "Lessen" },
            name: "schedule",
            type: "array",
            required: true,
            fields: [
                {
                    label: { en: "Date", nl: "Datum" },
                    name: "date",
                    type: "date",
                    required: true,
                    admin: {
                        date: { pickerAppearance: "dayAndTime" },
                        description: {
                            en: "Choose a date within the program's start and end date.",
                            nl: "Kies een datum binnen de start- en einddatum van het programma.",
                        },
                    },
                    validate: (
                        value: Date | null | undefined,
                        { data }: { data: Record<string, unknown> },
                    ) => {
                        if (!value) return true;
                        const start = data?.startDate as string | undefined;
                        const end = data?.endDate as string | undefined;
                        if (start && new Date(value) < new Date(start)) {
                            return "Date must be after the program start date.";
                        }
                        if (end && new Date(value) > new Date(end)) {
                            return "Date must be before the program end date.";
                        }
                        return true;
                    },
                },
                {
                    label: { en: "Lesson", nl: "Les" },
                    name: "lessons",
                    type: "relationship",
                    relationTo: "lessons",
                    hasMany: false,
                    required: true,
                },
            ],
        },
        {
            label: { en: "Final event", nl: "Eindevent" },
            name: "finalEvent",
            type: "relationship",
            relationTo: "events",
            hasMany: false,
            required: false,
        },
        slugField({
            required: false,
            useAsSlug: "title",
        }),
    ],
};
