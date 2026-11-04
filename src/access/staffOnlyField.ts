import { rolesOf } from "@/access/rolesOf";
import { RolesEnum } from "@/collections/Users/roles";
import type { FieldAccess } from "payload";

/** Field-level access for ownership fields: members must not reassign their own records. */
export const staffOnlyField: FieldAccess = ({ req: { user } }) => {
  const roles = rolesOf(user);

  return roles.includes(RolesEnum.ADMIN) || roles.includes(RolesEnum.COACH);
};
