import { notifyWaitlistsOfUser } from "@/collections/LessonEnrollments/hooks/notifyWaitlist";
import { relationshipID } from "@/utilities/relationshipID";
import type { CollectionAfterChangeHook } from "payload";

/**
 * A member who was skipped on a waitlist for lack of credits can take a free spot as soon as they
 * have credits again: after a credit adjustment, or when their subscription changes.
 */
export const offerSpotsOnCreditChange: CollectionAfterChangeHook = async ({
    doc,
    req,
}) => {
    const userId = Number(relationshipID(doc.user));

    if (!Number.isNaN(userId)) {
        await notifyWaitlistsOfUser(req.payload, userId, req);
    }

    return doc;
};
