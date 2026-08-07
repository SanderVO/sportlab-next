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
            type: "array",
            required: false,
            admin: {
                description:
                    "Voeg meerdere oefeningen toe die uniek zijn voor deze workout.",
            },
            labels: {
                singular: "Oefening",
                plural: "Oefeningen",
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
                    label: "Video URL",
                    name: "videoUrl",
                    type: "text",
                    required: false,
                },
            ],
        },
    ],
};
