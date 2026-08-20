import { adminCoachOrSelf } from "@/access/adminCoachOrSelf";
import { isAdminOrCoach } from "@/access/isAdminOrCoach";
import type { CollectionConfig } from "payload";

export const EventRegistrations: CollectionConfig = {
    slug: "event-registrations",
    labels: {
        singular: { en: "Event registration", nl: "Event inschrijving" },
        plural: { en: "Event registrations", nl: "Event inschrijvingen" },
    },
    access: {
        create: isAdminOrCoach,
        delete: isAdminOrCoach,
        read: adminCoachOrSelf,
        update: isAdminOrCoach,
    },
    admin: {
        useAsTitle: "id",
        defaultColumns: ["user", "event", "status", "updatedAt"],
    },
    fields: [
        {
            label: { en: "User", nl: "Gebruiker" },
            name: "user",
            type: "relationship",
            relationTo: "users",
            required: true,
        },
        {
            label: { en: "Event", nl: "Event" },
            name: "event",
            type: "relationship",
            relationTo: "events",
            required: true,
        },
        {
            label: { en: "Status", nl: "Status" },
            name: "status",
            type: "select",
            required: true,
            defaultValue: "registered",
            options: [
                {
                    label: { en: "Registered", nl: "Ingeschreven" },
                    value: "registered",
                },
                {
                    label: { en: "Waitlist", nl: "Wachtlijst" },
                    value: "waitlist",
                },
                {
                    label: { en: "Cancelled", nl: "Geannuleerd" },
                    value: "cancelled",
                },
                {
                    label: { en: "Attended", nl: "Aanwezig" },
                    value: "attended",
                },
            ],
        },
        {
            label: { en: "Added by", nl: "Toegevoegd door" },
            name: "addedBy",
            type: "relationship",
            relationTo: "users",
            required: false,
            admin: {
                readOnly: true,
                description: {
                    en: "Automatically set via a hook.",
                    nl: "Wordt automatisch gezet via een hook.",
                },
            },
            hooks: {
                beforeChange: [
                    ({ req, value }) => {
                        if (value) return value;
                        return req.user?.id;
                    },
                ],
            },
        },
    ],
    indexes: [
        {
            fields: ["user", "event"],
            unique: true,
        },
    ],
};
