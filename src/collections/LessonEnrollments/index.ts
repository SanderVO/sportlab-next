import { adminCoachOrSelf } from "@/access/adminCoachOrSelf";
import { staffOnlyField } from "@/access/staffOnlyField";
import { isAdminOrCoach } from "@/access/isAdminOrCoach";
import type { CollectionConfig } from "payload";
import { enforceLessonCapacity } from "./hooks/enforceLessonCapacity";
import {
    notifyWaitlistOnEnrollmentChange,
    notifyWaitlistOnEnrollmentDelete,
} from "./hooks/notifyWaitlist";
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
        beforeChange: [enforceLessonCapacity],
        afterChange: [
            syncExerciseTrackingOnEnrollment,
            notifyWaitlistOnEnrollmentChange,
        ],
        afterDelete: [notifyWaitlistOnEnrollmentDelete],
    },
    fields: [
        {
            label: { en: "User", nl: "Gebruiker" },
            name: "user",
            type: "relationship",
            access: { create: staffOnlyField, update: staffOnlyField },
            relationTo: "users",
            required: true,
        },
        {
            label: { en: "Lesson", nl: "Les" },
            name: "lesson",
            type: "relationship",
            access: { create: staffOnlyField, update: staffOnlyField },
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
                {
                    label: { en: "Waitlisted", nl: "Wachtlijst" },
                    value: "waitlisted",
                },
            ],
        },
        {
            label: { en: "On waitlist since", nl: "Op wachtlijst sinds" },
            name: "waitlistedAt",
            type: "date",
            admin: {
                readOnly: true,
                condition: (_, siblingData) => siblingData?.status === "waitlisted",
                date: { pickerAppearance: "dayAndTime" },
            },
        },
        {
            label: { en: "Spot offered at", nl: "Plek aangeboden op" },
            name: "waitlistNotifiedAt",
            type: "date",
            access: { create: staffOnlyField, update: staffOnlyField },
            admin: {
                readOnly: true,
                condition: (_, siblingData) => siblingData?.status === "waitlisted",
                description: {
                    en: "Set when the user was notified that a spot became free. The spot is reserved for them.",
                    nl: "Wordt gezet zodra de gebruiker bericht kreeg dat er een plek vrij is. De plek is voor hen gereserveerd.",
                },
                date: { pickerAppearance: "dayAndTime" },
            },
        },
        {
            label: { en: "Added by", nl: "Toegevoegd door" },
            name: "addedBy",
            type: "relationship",
            access: { create: staffOnlyField, update: staffOnlyField },
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
