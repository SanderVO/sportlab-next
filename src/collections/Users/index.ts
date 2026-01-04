import { authenticated } from "@/access/authenticated";
import type { CollectionConfig } from "payload";
import { User } from "../../payload-types";

const smtpEnabled = process.env.SMTP_ENABLED === "true";

export enum RolesEnum {
    ADMIN = "admin",
    EDITOR = "editor",
    USER = "user",
    COACH = "coach",
}

export const Users: CollectionConfig = {
    slug: "users",
    auth: smtpEnabled
        ? {
              verify: {
                  generateEmailSubject: ({ user }) => {
                      return `Hey ${user.email}, verifieer je account!`;
                  },
              },
              forgotPassword: {
                  generateEmailSubject: (req) => {
                      return `Hey ${req?.user.email}, reset je wachtwoord!`;
                  },
              },
          }
        : true,
    labels: {
        singular: "Gebruiker",
        plural: "Gebruikers",
    },
    timestamps: true,
    admin: {
        defaultColumns: ["avatar", "name", "email"],
        useAsTitle: "name",
    },
    access: {
        admin: ({ req }: { req: { user: User | null } }) =>
            req?.user?.roles.includes(RolesEnum.ADMIN) ?? false,
        create: authenticated,
        delete: authenticated,
        read: authenticated,
        update: authenticated,
    },
    fields: [
        {
            label: "Naam",
            name: "name",
            type: "text",
        },
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
    ],
};
