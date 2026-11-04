import { adminLanguage, message } from "@/utilities/messages";
import { APIError } from "payload";
import { relationshipID } from "@/utilities/relationshipID";
import type { CollectionBeforeValidateHook } from "payload";

/**
 * A credit adjustment may only point at a subscription of the same member, so the
 * Credits component can safely combine both when calculating what is left.
 */
export const validateSubscriptionOwner: CollectionBeforeValidateHook = async ({
    data,
    originalDoc,
    req,
}) => {
    if (!data) return data;

    const subscriptionID = relationshipID(
        data.subscription ?? originalDoc?.subscription,
    );
    const userID = relationshipID(data.user ?? originalDoc?.user);

    if (!subscriptionID || !userID) {
        return data;
    }

    const result = await req.payload.find({
        collection: "subscriptions",
        where: { id: { equals: subscriptionID } },
        limit: 1,
        depth: 0,
        overrideAccess: true,
        req,
    });
    const subscription = result.docs[0];

    if (!subscription) {
        return data;
    }

    if (String(relationshipID(subscription.user)) !== String(userID)) {
        throw new APIError(
            message(adminLanguage(req.headers), "subscriptionOfOtherMember"),
            400,
        );
    }

    return data;
};
