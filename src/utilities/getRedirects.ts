import configPromise from "@payload-config";
import { unstable_cache } from "next/cache";
import { getPayload } from "payload";

async function getRedirects(depth = 1) {
    const payload = await getPayload({ config: configPromise });

    const { docs: redirects } = await payload.find({
        collection: "redirects",
        depth,
        limit: 0,
        pagination: false,
    });

    return redirects;
}

/**
 * Cache all redirects together (tag 'redirects') for a day to avoid multiple fetches.
 */
export const getCachedRedirects = () =>
    unstable_cache(async () => getRedirects(), ["redirects"], {
        tags: ["redirects"],
        revalidate: 86400,
    })();
