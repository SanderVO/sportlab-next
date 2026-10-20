import { notifyWaitlist } from "@/collections/LessonEnrollments/hooks/notifyWaitlist";
import type { CollectionAfterChangeHook } from "payload";

/** More spots (or no limit anymore) can free up spots for users on the waitlist. */
export const notifyWaitlistOnSpotsChange: CollectionAfterChangeHook = async ({
    doc,
    previousDoc,
    operation,
    req,
}) => {
    if (operation !== "update" || doc.spots === previousDoc?.spots) return doc;

    await notifyWaitlist(req.payload, doc.id, req);

    return doc;
};
