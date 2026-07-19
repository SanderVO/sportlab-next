import { RolesEnum } from "@/collections/Users";
import type { Access } from "payload";

export const isAdminOrCoach: Access = ({ req: { user } }) => {
    if (!user) {
        return false;
    }

    const roles = Array.isArray(user.roles) ? user.roles : [];

    return roles.includes(RolesEnum.ADMIN) || roles.includes(RolesEnum.COACH);
};
