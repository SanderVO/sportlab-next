import { revalidatePath } from "next/cache";
import type { CollectionAfterChangeHook } from "payload";
import type { User } from "../../../payload-types";

export const revalidateUser: CollectionAfterChangeHook<User> = ({
    doc,
    previousDoc,
    req: { context },
}) => {
    if (context.disableRevalidate) return doc;

    if (doc.slug) revalidatePath(`/team/${doc.slug}`);

    if (previousDoc?.slug && previousDoc.slug !== doc.slug) {
        revalidatePath(`/team/${previousDoc.slug}`);
    }

    return doc;
};
