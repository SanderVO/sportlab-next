import { RolesEnum } from "@/collections/Users";
import type { User } from "@/payload-types";
import type { Access, Payload } from "payload";

type UserHasAdminAccessArgs = {
    payload: Payload;
    user: null | User;
};

export const userHasAdminAccess = async ({
    payload,
    user,
}: UserHasAdminAccessArgs): Promise<boolean> => {
    if (!user?.id) {
        return false;
    }

    const jwtRoles = Array.isArray(user.roles) ? user.roles : [];

    if (jwtRoles.includes(RolesEnum.ADMIN)) {
        return true;
    }

    const freshUser = (await payload.findByID({
        id: user.id,
        collection: "users",
        depth: 0,
        overrideAccess: true,
    })) as User | null;

    const roles = Array.isArray(freshUser?.roles) ? freshUser.roles : [];

    return roles.includes(RolesEnum.ADMIN);
};

export const isAdmin: Access = async ({ req }) => {
    return userHasAdminAccess({
        payload: req.payload,
        user: (req.user as User | null) ?? null,
    });
};
