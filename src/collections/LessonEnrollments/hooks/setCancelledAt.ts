import { rolesOf } from "@/access/rolesOf";
import { RolesEnum } from "@/collections/Users/roles";
import type { CollectionBeforeChangeHook } from "payload";

/**
 * Keeps `cancelledAt` in step with the status. The credit rules depend on it (cancelling less
 * than 5 minutes before the start keeps the credit used), and members can update their own
 * enrollment, so a value sent by a member is never trusted:
 * - status becomes `cancelled`: the time of the change
 * - already `cancelled`: the stored time stays
 * - any other status: cleared
 * Admins and coaches may set the time explicitly to correct a record.
 */
export const setCancelledAt: CollectionBeforeChangeHook = ({
    data,
    originalDoc,
    req,
}) => {
    const status: string = data.status ?? originalDoc?.status ?? "assigned";
    const roles = rolesOf(req.user);
    const isStaff =
        roles.includes(RolesEnum.ADMIN) || roles.includes(RolesEnum.COACH);
    const staffValue = isStaff ? data.cancelledAt : undefined;

    if (status !== "cancelled") {
        data.cancelledAt = null;

        return data;
    }

    if (staffValue) {
        data.cancelledAt = staffValue;
    } else if (originalDoc?.status === "cancelled") {
        data.cancelledAt = originalDoc.cancelledAt ?? null;
    } else {
        data.cancelledAt = new Date().toISOString();
    }

    return data;
};
