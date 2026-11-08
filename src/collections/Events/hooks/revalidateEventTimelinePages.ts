import { purgeCloudflarePaths } from "@/utilities/purgeCloudflare";
import { revalidatePath } from "next/cache";
import type {
    CollectionAfterChangeHook,
    CollectionAfterDeleteHook,
    PayloadRequest,
} from "payload";

/** Pages are cached, so a changed event has to refresh every page that shows the timeline. */
const revalidatePagesWithTimeline = async ({
    context,
    payload,
}: PayloadRequest) => {
    if (context.disableRevalidate) return;

    const { docs: pages } = await payload.find({
        collection: "pages",
        depth: 0,
        pagination: false,
        where: { _status: { equals: "published" } },
        select: { slug: true, layout: true },
    });

    const paths = pages
        .filter((page) =>
            page.layout?.some((block) => block.blockType === "eventTimeline"),
        )
        .map((page) => (page.slug === "home" ? "/" : `/${page.slug}`));

    paths.forEach((path) => revalidatePath(path));
    await purgeCloudflarePaths(paths, payload.logger);
};

export const revalidateEventTimelineOnChange: CollectionAfterChangeHook =
    async ({ doc, req }) => {
        await revalidatePagesWithTimeline(req);

        return doc;
    };

export const revalidateEventTimelineOnDelete: CollectionAfterDeleteHook =
    async ({ doc, req }) => {
        await revalidatePagesWithTimeline(req);

        return doc;
    };
