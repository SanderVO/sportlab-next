import { isAdmin, userHasAdminAccess } from "@/access/admin";
import {
    resetPasswordEmail,
    resetPasswordSubject,
} from "@/emails/resetPassword";
import { defaultLexical } from "@/fields/defaultLexical";
import { getServerSideURL } from "@/utilities/getURL";
import {
    slugField,
    type Access,
    type AccessResult,
    type CollectionConfig,
    type FieldAccess,
    type Where,
} from "payload";
import { User } from "../../payload-types";
import { revalidateUser } from "./hooks/revalidateUser";

export enum RolesEnum {
    ADMIN = "admin",
    EDITOR = "editor",
    USER = "user",
    COACH = "coach",
}

const hasStaffRole = (user: User | null | undefined): boolean => {
    const roles = Array.isArray(user?.roles) ? user.roles : [];

    return (
        roles.includes(RolesEnum.ADMIN) ||
        roles.includes(RolesEnum.EDITOR) ||
        roles.includes(RolesEnum.COACH)
    );
};

// Anonymous visitors only see coach profiles; staff see everyone; members see coaches and themselves.
const readUsers: Access = ({ req }): AccessResult => {
    const user = req.user as User | null;

    if (hasStaffRole(user)) return true;

    if (user?.id) {
        const where: Where = {
            or: [{ isCoach: { equals: true } }, { id: { equals: user.id } }],
        };

        return where;
    }

    return { isCoach: { equals: true } };
};

// Admins and content managers manage accounts; everyone else may only edit their own profile.
const updateUsers: Access = async ({ req }) => {
    const user = req.user as User | null;

    if (!user?.id) return false;

    if (await userHasAdminAccess({ payload: req.payload, user })) {
        return true;
    }

    if (Array.isArray(user.roles) && user.roles.includes(RolesEnum.EDITOR)) {
        return true;
    }

    return { id: { equals: user.id } };
};

// Roles and status decide what an account may do, so only admins may change them.
const adminOnlyFieldUpdate: FieldAccess = ({ req }) =>
    userHasAdminAccess({
        payload: req.payload,
        user: (req.user as User | null) ?? null,
    });

// Email addresses are personal data: only staff and the account owner may read them.
const readEmail: FieldAccess = ({ req, id }) => {
    const user = req.user as User | null;

    if (!user) return false;

    return hasStaffRole(user) || String(user.id) === String(id);
};

export const Users: CollectionConfig = {
    slug: "users",
    auth: {
        forgotPassword: {
            generateEmailSubject: () => resetPasswordSubject,
            generateEmailHTML: (args) =>
                resetPasswordEmail(
                    `${getServerSideURL()}/reset-password?token=${args?.token}`,
                ),
        },
    },
    labels: {
        singular: { en: "User", nl: "Gebruiker" },
        plural: { en: "Users", nl: "Gebruikers" },
    },
    defaultPopulate: {
        name: true,
        slug: true,
        meta: {
            image: true,
            title: true,
            description: true,
        },
    },
    timestamps: true,
    hooks: {
        afterChange: [revalidateUser],
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
        beforeChange: [
            ({ data }) => {
                if (data?.roles !== undefined) {
                    data.isCoach = Array.isArray(data.roles)
                        ? data.roles.includes(RolesEnum.COACH)
                        : false;
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
        admin: async ({ req }) => {
            const user = req?.user as User | null;

            if (!user?.id) {
                return false;
            }

            const jwtRoles = Array.isArray(user.roles) ? user.roles : [];

            if (
                jwtRoles.includes(RolesEnum.ADMIN) ||
                jwtRoles.includes(RolesEnum.EDITOR) ||
                jwtRoles.includes(RolesEnum.COACH)
            ) {
                return true;
            }

            // Fallback for cases where roles are missing from JWT but present in DB.
            const freshUser = (await req.payload.findByID({
                id: user.id,
                collection: "users",
                depth: 0,
                overrideAccess: true,
            })) as User | null;

            const roles = Array.isArray(freshUser?.roles)
                ? freshUser.roles
                : [];

            return (
                roles.includes(RolesEnum.ADMIN) ||
                roles.includes(RolesEnum.EDITOR) ||
                roles.includes(RolesEnum.COACH)
            );
        },
        create: isAdmin,
        delete: isAdmin,
        read: readUsers,
        update: updateUsers,
    },
    fields: [
        {
            name: "email",
            type: "email",
            required: true,
            unique: true,
            index: true,
            label: { en: "Email", nl: "E-mail" },
            access: {
                read: readEmail,
            },
        },
        {
            label: { en: "Name", nl: "Naam" },
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
                    description: {
                        en: "The slug is automatically generated from the name, but can be adjusted here.",
                        nl: "De slug wordt automatisch gegenereerd op basis van de naam, maar kan hier aangepast worden.",
                    },
                };

                return defaultField;
            },
        }),
        {
            label: { en: "Status", nl: "Status" },
            name: "status",
            type: "select",
            defaultValue: "active",
            required: true,
            access: {
                create: adminOnlyFieldUpdate,
                update: adminOnlyFieldUpdate,
            },
            options: [
                {
                    label: { en: "Active", nl: "Actief" },
                    value: "active",
                },
                {
                    label: { en: "Inactive", nl: "Inactief" },
                    value: "inactive",
                },
            ],
        },
        {
            label: { en: "Roles", nl: "Rollen" },
            name: "roles",
            type: "select",
            hasMany: true,
            defaultValue: "user",
            saveToJWT: true,
            required: true,
            access: {
                read: ({ req }) => {
                    // Only authenticated users can see roles
                    return !!req?.user;
                },
                create: adminOnlyFieldUpdate,
                update: adminOnlyFieldUpdate,
            },
            options: [
                { label: { en: "Admin", nl: "Admin" }, value: RolesEnum.ADMIN },
                {
                    label: { en: "Content Manager", nl: "Content Manager" },
                    value: RolesEnum.EDITOR,
                },
                { label: { en: "Member", nl: "Lid" }, value: RolesEnum.USER },
                { label: { en: "Coach", nl: "Coach" }, value: RolesEnum.COACH },
            ],
        },
        {
            name: "isCoach",
            type: "checkbox",
            defaultValue: false,
            admin: {
                hidden: true,
            },
        },
        {
            label: { en: "Photo", nl: "Foto" },
            name: "avatar",
            type: "upload",
            relationTo: "media",
            required: false,
        },
        {
            label: { en: "Subtitle", nl: "Ondertitel" },
            name: "subtitle",
            type: "text",
            required: false,
            admin: {
                description: {
                    en: "Member role at Sportlab in one sentence.",
                    nl: "Rol van het lid bij sportlab in 1 zin",
                },
            },
        },
        {
            label: { en: "About", nl: "Over" },
            name: "about",
            type: "textarea",
            required: false,
            admin: {
                description: {
                    en: "Background description of the member.",
                    nl: "Achtergrond beschrijving van het lid",
                },
                rows: 4,
            },
        },
        {
            label: { en: "Position", nl: "Positie" },
            name: "position",
            type: "number",
            admin: {
                description: {
                    en: "Set the order in team overview lists (lower number = higher in list).",
                    nl: "Bepaal de volgorde in team overzichten (lager nummer = hoger in lijst)",
                },
                condition: (_, siblingData) => {
                    return !!siblingData?.roles?.includes(RolesEnum.COACH);
                },
            },
        },
        {
            label: { en: "Content", nl: "Content" },
            name: "content",
            type: "richText",
            editor: defaultLexical,
            required: false,
            admin: {
                description: {
                    en: "Page content for the coach profile page.",
                    nl: "Pagina content voor de profielpagina van coaches",
                },
                condition: (_, siblingData) => {
                    return !!siblingData?.roles?.includes(RolesEnum.COACH);
                },
            },
        },
    ],
};
