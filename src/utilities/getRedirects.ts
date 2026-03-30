import configPromise from "@payload-config";
import { cacheTag } from "next/cache";
import { getPayload } from "payload";

export async function getRedirects(depth = 1) {
    "use cache";

    cacheTag("redirects");

    const payload = await getPayload({ config: configPromise });

    const { docs: redirects } = await payload.find({
        collection: "redirects",
        depth,
        limit: 0,
        pagination: false,
    });

    return redirects;
}
