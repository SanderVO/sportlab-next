import { adminCoachOrSelf } from "@/access/adminCoachOrSelf";
import { isAdminOrCoach } from "@/access/isAdminOrCoach";
import type { CollectionConfig } from "payload";
import { syncExerciseTrackingOnEnrollment } from "./hooks/syncExerciseTrackingOnEnrollment";

export const LessonEnrollments: CollectionConfig = {
    slug: "lesson-enrollments",
    labels: {
        singular: { en: "Lesson enrollment", nl: "Les deelname" },
        plural: { en: "Lesson enrollments", nl: "Les deelnames" },
    },
    access: {
        create: isAdminOrCoach,
        delete: isAdminOrCoach,
        read: adminCoachOrSelf,
        update: adminCoachOrSelf,
    },
    admin: {
        useAsTitle: "id",
        defaultColumns: ["user", "lesson", "status", "updatedAt"],
    },
    hooks: {
        afterChange: [syncExerciseTrackingOnEnrollment],
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
            label: { en: "Lesson", nl: "Les" },
            name: "lesson",
            type: "relationship",
            relationTo: "lessons",
            required: true,
        },
        {
            label: { en: "Status", nl: "Status" },
            name: "status",
            type: "select",
            required: true,
            defaultValue: "assigned",
            options: [
                {
                    label: { en: "Assigned", nl: "Toegewezen" },
                    value: "assigned",
                },
                { label: { en: "Started", nl: "Gestart" }, value: "started" },
                {
                    label: { en: "Completed", nl: "Afgerond" },
                    value: "completed",
                },
                {
                    label: { en: "Cancelled", nl: "Geannuleerd" },
                    value: "cancelled",
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
            fields: ["user", "lesson"],
            unique: true,
        },
    ],
};
