import { adminCoachOrSelf } from "@/access/adminCoachOrSelf";
import { isAdminOrCoach } from "@/access/isAdminOrCoach";
import type { CollectionConfig } from "payload";

export const ProgramEnrollments: CollectionConfig = {
    slug: "program-enrollments",
    labels: {
        singular: "Programma Deelname",
        plural: "Programma Deelnames",
    },
    access: {
        create: isAdminOrCoach,
        delete: isAdminOrCoach,
        read: adminCoachOrSelf,
        update: isAdminOrCoach,
    },
    admin: {
        useAsTitle: "id",
        defaultColumns: ["user", "program", "status", "updatedAt"],
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
            label: "Programma",
            name: "program",
            type: "relationship",
            relationTo: "programs",
            required: true,
        },
        {
            label: "Status",
            name: "status",
            type: "select",
            required: true,
            defaultValue: "enrolled",
            options: [
                { label: "Ingeschreven", value: "enrolled" },
                { label: "Actief", value: "active" },
                { label: "Afgerond", value: "completed" },
                { label: "Gestopt", value: "dropped" },
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
            fields: ["user", "program"],
            unique: true,
        },
    ],
};
