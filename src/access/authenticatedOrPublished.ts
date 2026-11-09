import { rolesOf } from "@/access/rolesOf";
import { RolesEnum } from "@/collections/Users/roles";
import type { Access } from "payload";

/**
 * Staff read every page/post (including drafts); everyone else only sees published
 * documents. Mere authentication is not enough: members sign in to the same users
 * collection, so "authenticated" must not mean "may read unpublished content".
 */
export const authenticatedOrPublished: Access = ({ req: { user } }) => {
    const roles = rolesOf(user);

    if (roles.includes(RolesEnum.ADMIN) || roles.includes(RolesEnum.EDITOR)) {
        return true;
    }

    return {
        _status: {
            equals: "published",
        },
    };
};
