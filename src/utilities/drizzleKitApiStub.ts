// Stub for `drizzle-kit/api`, used only to satisfy the bundler.
// @payloadcms/drizzle lazily requires this to push dev schema, which never
// runs in production (see connect.js: `NODE_ENV !== "production"` guard).
// Aliasing it here keeps the real ~18MB `drizzle-kit` package out of the
// production Worker bundle.
const unavailable = () => {
    throw new Error(
        "drizzle-kit/api is not available in production builds (dev-only schema push)",
    );
};

export const generateSQLiteDrizzleJson = unavailable;
export const generateSQLiteMigration = unavailable;
export const pushSQLiteSchema = unavailable;
