import { isAdminOrCoach } from "@/access/isAdminOrCoach";
import type { CollectionConfig } from "payload";

export const Exercises: CollectionConfig = {
    slug: "exercises",
    labels: {
        singular: { en: "Exercise", nl: "Oefening" },
        plural: { en: "Exercises", nl: "Oefeningen" },
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
            label: { en: "Name", nl: "Naam" },
            name: "name",
            type: "text",
            required: true,
        },
        {
            label: { en: "Description", nl: "Omschrijving" },
            name: "description",
            type: "textarea",
            required: false,
        },
    ],
};
