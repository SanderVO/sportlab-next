import { isAdminOrCoach } from "@/access/isAdminOrCoach";
import { slugField, type CollectionConfig } from "payload";

export const Events: CollectionConfig = {
    slug: "events",
    labels: {
        singular: "Event",
        plural: "Events",
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
    },
    fields: [
        {
            label: "Titel",
            name: "title",
            type: "text",
            required: true,
        },
        {
            label: "Type",
            name: "eventType",
            type: "select",
            required: true,
            options: [
                {
                    label: "Hardlopen",
                    value: "running",
                },
                {
                    label: "Hyrox",
                    value: "hyrox",
                },
                {
                    label: "Speciaal",
                    value: "special",
                },
            ],
        },
        {
            label: "Banner Afbeelding",
            name: "bannerImage",
            type: "upload",
            relationTo: "media",
            required: false,
        },
        {
            label: "Startdatum",
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
            label: "Einddatum",
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
            label: "Locatie",
            name: "location",
            type: "text",
            required: false,
        },
        {
            label: "Capaciteit",
            name: "capacity",
            type: "number",
            required: false,
        },
        {
            label: "Inschrijven geopend vanaf",
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
            label: "Inschrijven gesloten vanaf",
            name: "signupCloseAt",
            type: "date",
            required: false,
            admin: {
                date: {
                    pickerAppearance: "dayAndTime",
                },
            },
        },
        {
            label: "Externe ID",
            name: "externalId",
            type: "text",
            unique: true,
            required: false,
            admin: {
                description:
                    "Gebruik dit veld om events idempotent te importeren via CSV.",
            },
        },
        slugField({
            required: false,
            useAsSlug: "title",
        }),
    ],
};
