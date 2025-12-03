import type { CollectionConfig } from "payload";
import { anyone } from "../../access/anyone";
import { authenticated } from "../../access/authenticated";

export const Members: CollectionConfig = {
    slug: "members",
    labels: {
        singular: "Lid",
        plural: "Leden",
    },
    access: {
        create: authenticated,
        delete: authenticated,
        read: anyone,
        update: authenticated,
    },
    admin: {
        useAsTitle: "name",
        defaultColumns: ["media", "name", "role", "active"],
    },
    fields: [
        {
            label: "Naam",
            name: "name",
            type: "text",
            required: true,
        },
        {
            label: "Rol",
            name: "role",
            type: "select",
            defaultValue: "sporter",
            required: true,
            options: [
                {
                    label: "Sporter",
                    value: "sporter",
                },
                {
                    label: "Coach",
                    value: "coach",
                },
            ],
        },
        {
            name: "status",
            type: "select",
            defaultValue: "active",
            required: true,
            options: [
                {
                    label: "Actief",
                    value: "active",
                },
                {
                    label: "Inactief",
                    value: "inactive",
                },
            ],
        },
        {
            label: "Sortering",
            name: "order",
            type: "number",
            defaultValue: 0,
        },
        {
            label: "Ondertitel",
            name: "subtitle",
            type: "text",
            required: true,
        },
        {
            label: "Over",
            name: "about",
            type: "textarea",
            required: false,
            admin: {
                description: "Korte beschrijving van het teamlid",
                rows: 4,
            },
        },
        {
            label: "Afbeelding",
            name: "media",
            type: "upload",
            relationTo: "media",
            required: true,
        },
    ],
};
