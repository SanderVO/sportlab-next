import { relationshipID } from "@/utilities/relationshipID";
import type { CollectionBeforeValidateHook } from "payload";

/**
 * When a subscription is created or moved to another plan, use that plan's current
 * price unless the editor picked a specific (for example grandfathered) price.
 */
export const defaultPriceFromPlan: CollectionBeforeValidateHook = async ({
    data,
    originalDoc,
    req,
}) => {
    if (!data) return data;

    // An explicit value (including null) wins; only fill an omitted price.
    if (data.price !== undefined) return data;

    const planValue = data.plan ?? originalDoc?.plan;
    const planID = relationshipID(planValue);

    if (!planID) return data;

    if (typeof planValue === "object" && "currentPrice" in planValue) {
        const currentPrice = relationshipID(
            (planValue as { currentPrice?: unknown }).currentPrice,
        );

        if (currentPrice) {
            data.price = currentPrice;
            return data;
        }
    }

    const result = await req.payload.find({
        collection: "subscription-plans",
        where: { id: { equals: planID } },
        limit: 1,
        depth: 0,
        req,
        overrideAccess: true,
    });
    const currentPrice = relationshipID(result.docs[0]?.currentPrice);

    if (currentPrice) {
        data.price = currentPrice;
    }

    return data;
};
