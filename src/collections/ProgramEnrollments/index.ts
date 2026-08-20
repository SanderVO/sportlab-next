import { adminCoachOrSelf } from "@/access/adminCoachOrSelf";
import { isAdminOrCoach } from "@/access/isAdminOrCoach";
import type { CollectionConfig } from "payload";

export const ProgramEnrollments: CollectionConfig = {
    slug: "program-enrollments",
    labels: {
        singular: { en: "Program enrollment", nl: "Programma deelname" },
        plural: { en: "Program enrollments", nl: "Programma deelnames" },
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
            label: { en: "User", nl: "Gebruiker" },
            name: "user",
            type: "relationship",
            relationTo: "users",
            required: true,
        },
        {
            label: { en: "Program", nl: "Programma" },
            name: "program",
            type: "relationship",
            relationTo: "programs",
            required: true,
        },
        {
            label: { en: "Status", nl: "Status" },
            name: "status",
            type: "select",
            required: true,
            defaultValue: "enrolled",
            options: [
                {
                    label: { en: "Enrolled", nl: "Ingeschreven" },
                    value: "enrolled",
                },
                { label: { en: "Active", nl: "Actief" }, value: "active" },
                {
                    label: { en: "Completed", nl: "Afgerond" },
                    value: "completed",
                },
                { label: { en: "Dropped", nl: "Gestopt" }, value: "dropped" },
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
            fields: ["user", "program"],
            unique: true,
        },
    ],
};
