import type { CollectionBeforeDeleteHook, CollectionSlug } from "payload";

/**
 * Removes a user's records from `collection` before the user itself is deleted. Relationship
 * foreign keys are `ON DELETE set null`, which fails on NOT NULL `user` columns, so the rows have
 * to go first; `req` keeps this in the delete's transaction.
 */
export const deleteUserRecords =
    (collection: CollectionSlug, field = "user"): CollectionBeforeDeleteHook =>
    async ({ id, req }) => {
        await req.payload.delete({
            collection,
            where: { [field]: { equals: id } },
            req,
            overrideAccess: true,
        });
    };
