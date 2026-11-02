/**
 * Roles of an authenticated user. `req.user` can also be an MCP API key document, which has no
 * roles, so anything that isn't a user with a roles array yields no roles (fail closed).
 */
export const rolesOf = (user: unknown): string[] => {
    if (!user || typeof user !== "object" || !("roles" in user)) {
        return [];
    }

    return Array.isArray(user.roles) ? (user.roles as string[]) : [];
};
