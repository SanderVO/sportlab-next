import { RolesEnum } from "@/collections/Users";
import type { Access } from "payload";

export const adminCoachOrSelf: Access = ({ req: { user } }) => {
    if (!user) {
        return false;
    }

    const roles = Array.isArray(user.roles) ? user.roles : [];

    if (roles.includes(RolesEnum.ADMIN) || roles.includes(RolesEnum.COACH)) {
        return true;
    }

    return {
        user: {
            equals: user.id,
        },
    };
};
