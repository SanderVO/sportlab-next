import { rolesOf } from "@/access/rolesOf";
import { RolesEnum } from "@/collections/Users/roles";
import type { Access } from "payload";

export const editorOrAdmin: Access = ({ req: { user } }) => {
    const roles = rolesOf(user);

    return roles.includes(RolesEnum.ADMIN) || roles.includes(RolesEnum.EDITOR);
};
