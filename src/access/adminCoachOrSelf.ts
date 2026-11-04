import { rolesOf } from "@/access/rolesOf";
import { RolesEnum } from "@/collections/Users/roles";
import type { Access } from "payload";

export const adminCoachOrSelf: Access = ({ req: { user } }) => {
    if (!user) {
        return false;
    }

    const roles = rolesOf(user);

    if (roles.includes(RolesEnum.ADMIN) || roles.includes(RolesEnum.COACH)) {
        return true;
    }

    return {
        user: {
            equals: user.id,
        },
    };
};
