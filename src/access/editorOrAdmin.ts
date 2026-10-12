import { RolesEnum } from "@/collections/Users/roles";
import type { Access } from "payload";

export const editorOrAdmin: Access = ({ req: { user } }) => {
    if (user) {
        return (
            user?.roles.includes(RolesEnum.ADMIN) ||
            user?.roles.includes(RolesEnum.EDITOR)
        );
    }

    return false;
};
