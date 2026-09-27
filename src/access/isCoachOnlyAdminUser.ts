import { RolesEnum } from "@/collections/Users";
import type { ClientUser } from "payload";

export const isCoachOnlyAdminUser = (
    user: ClientUser | null | undefined,
): boolean => {
    const roles = Array.isArray(user?.roles) ? user.roles : [];

    return (
        roles.includes(RolesEnum.COACH) &&
        !roles.includes(RolesEnum.ADMIN) &&
        !roles.includes(RolesEnum.EDITOR)
    );
};
