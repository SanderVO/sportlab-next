import { RolesEnum } from "@/collections/Users";
import type { FieldAccess } from "payload";

/** Field-level access for ownership fields: members must not reassign their own records. */
export const staffOnlyField: FieldAccess = ({ req: { user } }) => {
  const roles = Array.isArray(user?.roles) ? user.roles : [];

  return roles.includes(RolesEnum.ADMIN) || roles.includes(RolesEnum.COACH);
};
