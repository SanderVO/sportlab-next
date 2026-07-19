import { adminCoachOrSelf } from "@/access/adminCoachOrSelf";
import { isAdminOrCoach } from "@/access/isAdminOrCoach";
import type { CollectionConfig } from "payload";

export const EventRegistrations: CollectionConfig = {
    slug: "event-registrations",
    labels: {
        singular: "Event Inschrijving",
        plural: "Event Inschrijvingen",
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
            label: "Gebruiker",
            name: "user",
            type: "relationship",
            relationTo: "users",
            required: true,
        },
        {
            label: "Event",
            name: "event",
            type: "relationship",
            relationTo: "events",
            required: true,
        },
        {
            label: "Status",
            name: "status",
            type: "select",
            required: true,
            defaultValue: "registered",
            options: [
                { label: "Ingeschreven", value: "registered" },
                { label: "Wachtlijst", value: "waitlist" },
                { label: "Geannuleerd", value: "cancelled" },
                { label: "Aanwezig", value: "attended" },
            ],
        },
        {
            label: "Toegevoegd door",
            name: "addedBy",
            type: "relationship",
            relationTo: "users",
            required: false,
            admin: {
                readOnly: true,
                description: "Wordt automatisch gezet via een hook.",
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
