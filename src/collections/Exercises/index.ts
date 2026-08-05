import { isAdminOrCoach } from "@/access/isAdminOrCoach";
import type { CollectionConfig } from "payload";

export const Exercises: CollectionConfig = {
    slug: "exercises",
    labels: {
        singular: "Oefening",
        plural: "Oefeningen",
    },
    access: {
        create: isAdminOrCoach,
        delete: isAdminOrCoach,
        read: () => true,
        update: isAdminOrCoach,
    },
    admin: {
        useAsTitle: "name",
        defaultColumns: ["name", "category", "updatedAt"],
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
            label: "Workouts",
            name: "workouts",
            type: "relationship",
            relationTo: "workouts",
            hasMany: true,
            required: false,
            admin: {
                hidden: true,
                description:
                    "Koppel deze oefening aan een of meerdere workouts zodat je hem kunt groeperen binnen lessen.",
            },
        },
        {
            label: "Video URL",
            name: "videoUrl",
            type: "text",
            required: false,
        },
        {
            label: "Externe ID",
            name: "externalId",
            type: "text",
            unique: true,
            required: false,
            admin: {
                description:
                    "Gebruik dit veld om oefeningen idempotent te importeren via CSV.",
            },
        },
    ],
};
