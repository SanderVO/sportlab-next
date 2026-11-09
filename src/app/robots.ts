import { headers } from "next/headers";
import { MetadataRoute } from "next/types";

// Runtime-only so ALLOW_INDEXING isn't baked in at build time.
export const dynamic = "force-dynamic";

const PRODUCTION_HOSTS = ["sportlabgroningen.nl", "www.sportlabgroningen.nl"];

const TRUE_VALUES = ["true", "1", "yes", "on"];
const FALSE_VALUES = ["false", "0", "no", "off"];

export default async function robots(): Promise<MetadataRoute.Robots> {
    const canonicalSiteUrl = "https://sportlabgroningen.nl";

    const flag = String(process.env.ALLOW_INDEXING ?? "")
        .trim()
        .toLowerCase();

    let allowIndexing = TRUE_VALUES.includes(flag);

    // A missing or mistyped variable must not hide the live site. Only an
    // explicit "off" value blocks the production host; any other host
    // (staging, previews, localhost) stays blocked unless the flag is on.
    if (!allowIndexing && !FALSE_VALUES.includes(flag)) {
        const requestHeaders = await headers();
        const host = (
            requestHeaders.get("x-forwarded-host") ??
            requestHeaders.get("host") ??
            ""
        )
            .split(",")[0]
            .trim()
            .toLowerCase()
            .replace(/:\d+$/, "");

        allowIndexing = PRODUCTION_HOSTS.includes(host);
    }

    if (!allowIndexing) {
        return {
            rules: {
                userAgent: "*",
                disallow: "/",
            },
        };
    }

    return {
        rules: {
            userAgent: "*",
            allow: "/",
            disallow: ["/admin/", "/tv", "/api/tv-"],
        },
        sitemap: `${canonicalSiteUrl}/sitemap.xml`,
    };
}
