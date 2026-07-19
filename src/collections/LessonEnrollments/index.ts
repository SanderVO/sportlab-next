import { adminCoachOrSelf } from "@/access/adminCoachOrSelf";
import { isAdminOrCoach } from "@/access/isAdminOrCoach";
import type { CollectionConfig } from "payload";

export const LessonEnrollments: CollectionConfig = {
    slug: "lesson-enrollments",
    labels: {
        singular: "Les Deelname",
        plural: "Les Deelnames",
    },
    access: {
        create: isAdminOrCoach,
        delete: isAdminOrCoach,
        read: adminCoachOrSelf,
        update: isAdminOrCoach,
    },
    admin: {
        useAsTitle: "id",
        defaultColumns: ["user", "lesson", "status", "updatedAt"],
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
            label: "Les",
            name: "lesson",
            type: "relationship",
            relationTo: "lessons",
            required: true,
        },
        {
            label: "Status",
            name: "status",
            type: "select",
            required: true,
            defaultValue: "assigned",
            options: [
                { label: "Toegewezen", value: "assigned" },
                { label: "Gestart", value: "started" },
                { label: "Afgerond", value: "completed" },
                { label: "Geannuleerd", value: "cancelled" },
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
            fields: ["user", "lesson"],
            unique: true,
        },
    ],
};
