import { authenticated } from "@/access/authenticated";
import { defaultLexical } from "@/fields/defaultLexical";
import { slugField, type CollectionConfig } from "payload";
import { User } from "../../payload-types";

export enum RolesEnum {
    ADMIN = "admin",
    EDITOR = "editor",
    USER = "user",
    COACH = "coach",
}

export const Users: CollectionConfig = {
    slug: "users",
    auth: true,
    labels: {
        singular: "Gebruiker",
        plural: "Gebruikers",
    },
    defaultPopulate: {
        slug: true,
        meta: {
            image: true,
            title: true,
            description: true,
        },
    },
    timestamps: true,
    hooks: {
        beforeValidate: [
            ({ data }) => {
                if (data && !data.slug && data.name) {
                    data.slug = data.name
                        .toLowerCase()
                        .replace(/\s+/g, "-")
                        .replace(/[^a-z0-9-]/g, "");
                }
                return data;
            },
        ],
    },
    admin: {
        defaultColumns: ["avatar", "name", "email"],
        useAsTitle: "name",
    },
    access: {
        admin: ({ req }: { req: { user: User | null } }) =>
            (req?.user?.roles.includes(RolesEnum.ADMIN) ||
                req.user?.roles.includes(RolesEnum.EDITOR)) ??
            false,
        create: authenticated,
        delete: authenticated,
        read: ({ req }: { req: { user: User | null } }) => {
            // Authenticated users with admin or editor roles can read all users
            if (req?.user?.roles?.includes(RolesEnum.ADMIN) || req?.user?.roles?.includes(RolesEnum.EDITOR)) {
                return true;
            }
            
            // Only allow coaches to be read via the API for unauthenticated users
            return {
                roles: {
                    contains: RolesEnum.COACH,
                },
            };
        },
        update: authenticated,
    },
    fields: [
        {
            label: "Naam",
            name: "name",
            type: "text",
        },
        slugField({
            required: false,
            useAsSlug: "name",
            overrides: (defaultField) => {
                defaultField.fields[1].admin = {
                    condition: (_, siblingData) => {
                        return !!siblingData?.roles?.includes(RolesEnum.COACH);
                    },
                    description:
                        "De slug wordt automatisch gegenereerd op basis van de naam, maar kan hier aangepast worden.",
                };

                return defaultField;
            },
        }),
        {
            label: "Status",
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
            label: "Rollen",
            name: "roles",
            type: "select",
            hasMany: true,
            defaultValue: "user",
            saveToJWT: true,
            required: true,
            options: [
                { label: "Admin", value: RolesEnum.ADMIN },
                { label: "Content Manager", value: RolesEnum.EDITOR },
                { label: "Lid", value: RolesEnum.USER },
                { label: "Coach", value: RolesEnum.COACH },
            ],
        },
        {
            label: "Foto",
            name: "avatar",
            type: "upload",
            relationTo: "media",
            required: false,
        },
        {
            label: "Ondertitel",
            name: "subtitle",
            type: "text",
            required: false,
            admin: {
                description: "Rol van het lid bij sportlab in 1 zin",
            },
        },
        {
            label: "Over",
            name: "about",
            type: "textarea",
            required: false,
            admin: {
                description: "Achtergrond beschrijving van het lid",
                rows: 4,
            },
        },
        {
            label: "Content",
            name: "content",
            type: "richText",
            editor: defaultLexical,
            required: false,
            admin: {
                description: "Pagina content voor de profielpagina van coaches",
                condition: (_, siblingData) => {
                    return !!siblingData?.roles?.includes(RolesEnum.COACH);
                },
            },
        },
    ],
};
