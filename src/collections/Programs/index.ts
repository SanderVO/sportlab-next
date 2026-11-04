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
            { en: "Manage programs with a start and end date, lessons and an optional final event (for example: Performance Cycle).", nl: "Beheer programma's met een start- en einddatum, lessen en een optioneel eindevent (bijvoorbeeld: Performance Cycle)." },
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
            name: "lessons",
            type: "join",
            collection: "lessons",
            on: "program",
            defaultSort: "startDate",
            defaultLimit: 0,
            admin: {
                allowCreate: false,
                defaultColumns: ["title", "startDate", "type"],
                description: {
                    en: "Lessons linked to this program. Link a lesson to a program from the lesson form.",
                    nl: "Lessen die aan dit programma zijn gekoppeld. Koppel een les aan een programma via het lesformulier.",
                },
            },
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
