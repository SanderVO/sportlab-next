import { isAdminOrCoach } from "@/access/isAdminOrCoach";
import { rolesOf } from "@/access/rolesOf";
import { RolesEnum } from "@/collections/Users/roles";
import type {
    Access,
    CollectionBeforeValidateHook,
    CollectionConfig,
} from "payload";

/** Admins may change every note, coaches only the notes they wrote. Other roles have no access. */
const authorOrAdmin: Access = ({ req: { user } }) => {
    const roles = rolesOf(user);

    if (roles.includes(RolesEnum.ADMIN)) {
        return true;
    }

    if (user && roles.includes(RolesEnum.COACH)) {
        return { author: { equals: user.id } };
    }

    return false;
};

const relationId = (value: unknown): unknown =>
    value && typeof value === "object" && "id" in value
        ? (value as { id: unknown }).id
        : value;

/** The author is never taken from the request body. */
const enforceAuthor: CollectionBeforeValidateHook = ({
    data,
    operation,
    originalDoc,
    req,
}) => {
    if (!data) {
        return data;
    }

    if (operation === "create" && req.user) {
        return { ...data, author: req.user.id };
    }

    if (operation === "update" && originalDoc) {
        return { ...data, author: relationId(originalDoc.author) };
    }

    return data;
};

/**
 * Notes about a member, shared by all coaches and admins. Members have no access, so they can't
 * read notes about themselves through the API either.
 */
export const CoachNotes: CollectionConfig = {
    slug: "coach-notes",
    labels: {
        singular: { en: "Coach note", nl: "Coachnotitie" },
        plural: { en: "Coach notes", nl: "Coachnotities" },
    },
    // Only used by the dashboard, so it stays out of the CMS and the GraphQL API.
    admin: { hidden: true },
    custom: { dashboardOnly: true },
    graphQL: false,
    access: {
        create: isAdminOrCoach,
        read: isAdminOrCoach,
        update: authorOrAdmin,
        delete: authorOrAdmin,
    },
    defaultSort: "-createdAt",
    hooks: {
        beforeValidate: [enforceAuthor],
    },
    fields: [
        {
            label: { en: "Member", nl: "Lid" },
            name: "member",
            type: "relationship",
            relationTo: "users",
            required: true,
            index: true,
        },
        {
            label: { en: "Author", nl: "Auteur" },
            name: "author",
            type: "relationship",
            relationTo: "users",
            // Optional so a note outlives its author: deleting the account sets this to null.
            required: false,
        },
        {
            label: { en: "Note", nl: "Notitie" },
            name: "body",
            type: "textarea",
            required: true,
        },
    ],
};
