import { getServerSideURL } from "./getURL";

type Logger = { info: (msg: string) => void; error: (msg: string) => void };

const purge = async (body: object, logger?: Logger) => {
    const zoneId = process.env.CLOUDFLARE_ZONE_ID;
    const token = process.env.CLOUDFLARE_API_TOKEN;

    // Not configured (e.g. local dev): nothing to purge.
    if (!zoneId || !token) return;

    try {
        const res = await fetch(
            `https://api.cloudflare.com/client/v4/zones/${zoneId}/purge_cache`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
                signal: AbortSignal.timeout(5000),
            },
        );

        if (!res.ok) {
            logger?.error(
                `Cloudflare purge failed: ${res.status} ${await res.text()}`,
            );
        }
    } catch (error) {
        // A failed purge must never block saving content.
        logger?.error(`Cloudflare purge failed: ${String(error)}`);
    }
};

/** Purge specific site paths (e.g. "/", "/blog/my-post") from the Cloudflare edge cache. */
export const purgeCloudflarePaths = async (
    paths: string[],
    logger?: Logger,
) => {
    const base = getServerSideURL().replace(/\/$/, "");
    const files = [...new Set(paths)].map((path) => `${base}${path}`);

    if (files.length === 0) return;

    logger?.info(`Purging Cloudflare cache for: ${files.join(", ")}`);
    await purge({ files }, logger);
};

/** Purge the whole zone. Use for changes that affect every page (header, footer, ...). */
export const purgeCloudflareEverything = async (logger?: Logger) => {
    logger?.info("Purging entire Cloudflare cache");
    await purge({ purge_everything: true }, logger);
};
