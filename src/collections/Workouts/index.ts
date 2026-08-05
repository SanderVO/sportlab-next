import { authenticated } from "@/access/authenticated";
import { isAdminOrCoach } from "@/access/isAdminOrCoach";
import type { CollectionConfig } from "payload";

export const Workouts: CollectionConfig = {
    slug: "workouts",
    labels: {
        singular: "Workout",
        plural: "Workouts",
    },
    access: {
        create: isAdminOrCoach,
        delete: isAdminOrCoach,
        read: authenticated,
        update: isAdminOrCoach,
    },
    admin: {
        useAsTitle: "name",
        defaultColumns: ["name", "updatedAt"],
        description:
            "Herbruikbare workout-groepen om oefeningen binnen lessen te bundelen.",
    },
    fields: [
        {
            label: "Naam",
            name: "name",
            type: "text",
            required: true,
        },
        {
            label: "Omschrijving",
            name: "description",
            type: "textarea",
            required: false,
        },
        {
            label: "Oefeningen",
            name: "exercises",
            type: "relationship",
            relationTo: "exercises",
            hasMany: true,
            required: false,
            admin: {
                hidden: true,
                description:
                    "Koppel oefeningen aan deze workout. Een oefening kan in meerdere workouts voorkomen.",
            },
        },
    ],
};
