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
    ],
};
