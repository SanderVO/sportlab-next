import { isAdminOrCoach } from "@/access/isAdminOrCoach";
import { slugField, type CollectionConfig } from "payload";

export const Events: CollectionConfig = {
    slug: "events",
    labels: {
        singular: { en: "Event", nl: "Evenement" },
        plural: { en: "Events", nl: "Evenementen" },
    },
    access: {
        create: isAdminOrCoach,
        delete: isAdminOrCoach,
        read: () => true,
        update: isAdminOrCoach,
    },
    admin: {
        useAsTitle: "title",
        defaultColumns: ["title", "eventType", "startsAt", "updatedAt"],
        description:
            "Beheer evenementen zoals hardloopwedstrijden, hyrox en speciale events.",
    },
    fields: [
        {
            label: { en: "Title", nl: "Titel" },
            name: "title",
            type: "text",
            required: true,
        },
        {
            label: { en: "Type", nl: "Type" },
            name: "eventType",
            type: "select",
            required: true,
            options: [
                {
                    label: { en: "Running", nl: "Hardlopen" },
                    value: "running",
                },
                {
                    label: { en: "Hyrox", nl: "Hyrox" },
                    value: "hyrox",
                },
                {
                    label: { en: "Special", nl: "Speciaal" },
                    value: "special",
                },
            ],
        },
        {
            label: { en: "Banner image", nl: "Banner afbeelding" },
            name: "bannerImage",
            type: "upload",
            relationTo: "media",
            required: false,
        },
        {
            label: { en: "Start date", nl: "Startdatum" },
            name: "startsAt",
            type: "date",
            required: true,
            admin: {
                date: {
                    pickerAppearance: "dayAndTime",
                },
            },
        },
        {
            label: { en: "End date", nl: "Einddatum" },
            name: "endsAt",
            type: "date",
            required: false,
            admin: {
                date: {
                    pickerAppearance: "dayAndTime",
                },
            },
        },
        {
            label: { en: "Location", nl: "Locatie" },
            name: "location",
            type: "text",
            required: false,
        },
        {
            label: { en: "Capacity", nl: "Capaciteit" },
            name: "capacity",
            type: "number",
            required: false,
        },
        {
            label: { en: "Signup opens from", nl: "Inschrijven geopend vanaf" },
            name: "signupOpenAt",
            type: "date",
            required: false,
            admin: {
                date: {
                    pickerAppearance: "dayAndTime",
                },
            },
        },
        {
            label: {
                en: "Signup closes from",
                nl: "Inschrijven gesloten vanaf",
            },
            name: "signupCloseAt",
            type: "date",
            required: false,
            admin: {
                date: {
                    pickerAppearance: "dayAndTime",
                },
            },
        },
        slugField({
            required: false,
            useAsSlug: "title",
        }),
    ],
};
