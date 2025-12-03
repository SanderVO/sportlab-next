import type { CollectionConfig } from "payload";
import { anyone } from "../../access/anyone";
import { authenticated } from "../../access/authenticated";

export const TeamMembers: CollectionConfig = {
    slug: "team-members",
    access: {
        create: authenticated,
        delete: authenticated,
        read: anyone,
        update: authenticated,
    },
    admin: {
        useAsTitle: "name",
    },
    fields: [
        {
            label: "Naam",
            name: "name",
            type: "text",
            required: true,
        },
        {
            label: "Ondertitel",
            name: "subtitle",
            type: "text",
            required: true,
        },
        {
            name: "Status",
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
