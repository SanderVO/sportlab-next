import {
    defineCloudflareConfig,
    OpenNextConfig,
} from "@opennextjs/cloudflare/config";
import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";
import { withRegionalCache } from "@opennextjs/cloudflare/overrides/incremental-cache/regional-cache";
import doQueue from "@opennextjs/cloudflare/overrides/queue/do-queue";
import queueCache from "@opennextjs/cloudflare/overrides/queue/queue-cache";
import d1NextTagCache from "@opennextjs/cloudflare/overrides/tag-cache/d1-next-tag-cache";

export default {
    ...defineCloudflareConfig({
        incrementalCache: withRegionalCache(r2IncrementalCache, {
            mode: "long-lived",
        }),
        tagCache: d1NextTagCache,
        enableCacheInterception: true,
        queue: queueCache(doQueue),
    }),
} satisfies OpenNextConfig;

// export default defineCloudflareConfig();
