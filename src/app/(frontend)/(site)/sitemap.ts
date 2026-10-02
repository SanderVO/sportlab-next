import config from "@payload-config";
import type { MetadataRoute } from "next";
import { unstable_cache } from "next/cache";
import { getPayload } from "payload";

// Not prerendered at build (needs the DB); the data itself is cached below.
export const dynamic = "force-dynamic";

// Fallback window in case a revalidateTag("pages-sitemap") call is ever missed
const getPagesSitemap = unstable_cache(
    async () => {
        const payload = await getPayload({ config });

        const SITE_URL = "https://sportlabgroningen.nl";

        const results = await payload.find({
            collection: "pages",
            overrideAccess: false,
            draft: false,
            depth: 0,
            limit: 1000,
            pagination: false,
            where: {
                _status: {
                    equals: "published",
                },
            },
            select: {
                slug: true,
                updatedAt: true,
            },
        });

        const dateFallback = new Date().toISOString();

        const sitemap = results.docs
            ? results.docs
                  .filter((page) => Boolean(page?.slug))
                  .map((page) => {
                      return {
                          loc:
                              page?.slug === "home"
                                  ? `${SITE_URL}`
                                  : `${SITE_URL}/${page?.slug}`,
                          lastmod: page.updatedAt || dateFallback,
                      };
                  })
            : [];

        return [...sitemap];
    },
    ["pages-sitemap"],
    {
        tags: ["pages-sitemap"],
        revalidate: 86400,
    },
);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = "https://sportlabgroningen.nl";

    const pagesSitemap = await getPagesSitemap();

    const allUrls = [...pagesSitemap];

    return allUrls.map((entry) => ({
        url: entry.loc,
        lastModified: entry.lastmod,
        priority: entry.loc === baseUrl ? 1 : 0.8,
        changeFrequency: "weekly",
    }));
}
