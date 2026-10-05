import { revalidatePath, revalidateTag } from "next/cache";
import type {
    CollectionAfterChangeHook,
    CollectionAfterDeleteHook,
} from "payload";
import type { Post } from "../../../payload-types";
import { purgeCloudflarePaths } from "../../../utilities/purgeCloudflare";

export const revalidatePost: CollectionAfterChangeHook<Post> = async ({
    doc,
    previousDoc,
    req: { payload, context },
}) => {
    if (!context.disableRevalidate) {
        if (doc._status === "published") {
            const path = `/blog/${doc.slug}`;

            payload.logger.info(`Revalidating post at path: ${path}`);

            revalidatePath(path);
            revalidateTag("blog-sitemap", "max");
            await purgeCloudflarePaths([path, "/blog"], payload.logger);
        }

        // If the post was previously published, we need to revalidate the old path
        if (
            previousDoc._status === "published" &&
            doc._status !== "published"
        ) {
            const oldPath = `/blog/${previousDoc.slug}`;

            payload.logger.info(`Revalidating old post at path: ${oldPath}`);

            revalidatePath(oldPath);
            revalidateTag("blog-sitemap", "max");
            await purgeCloudflarePaths([oldPath, "/blog"], payload.logger);
        }
    }
    return doc;
};

export const revalidateDelete: CollectionAfterDeleteHook<Post> = async ({
    doc,
    req: { context, payload },
}) => {
    if (!context.disableRevalidate) {
        const path = `/blog/${doc?.slug}`;

        revalidatePath(path);
        revalidateTag("blog-sitemap", "max");
        await purgeCloudflarePaths([path, "/blog"], payload.logger);
    }

    return doc;
};
