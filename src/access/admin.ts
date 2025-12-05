import { RolesEnum } from "@/collections/Users";
import type { Access } from "payload";

export const isAdmin: Access = ({ req: { user } }) => {
    if (user) {
        return user?.roles.includes(RolesEnum.ADMIN);
    }

    return false;
};
