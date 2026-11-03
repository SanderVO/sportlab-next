import { userHasAdminAccess } from "@/access/admin";
import type { Access } from "payload";

/**
 * Admins see every record; every other signed-in user only sees their own.
 * Used for member data that staff (coaches/editors) should not read, such as billing.
 */
export const adminOrSelf: Access = async ({ req }) => {
    if (!req.user?.id) {
        return false;
    }

    if (
        await userHasAdminAccess({
            payload: req.payload,
            user: req.user,
        })
    ) {
        return true;
    }

    return {
        user: {
            equals: req.user.id,
        },
    };
};
