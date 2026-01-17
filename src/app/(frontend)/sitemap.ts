import { getEnv } from "@/lib/Env";
import config from "@payload-config";
import { unstable_cache } from "next/cache";
import { MetadataRoute } from "next/types";
import { getPayload } from "payload";

const getPagesSitemap = unstable_cache(
    async () => {
        const payload = await getPayload({ config });

        const env = getEnv();

        const SITE_URL = env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";

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

        const defaultSitemap = [
            {
                loc: `${SITE_URL}/blog`,
                lastmod: dateFallback,
            },
        ];

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

        return [...defaultSitemap, ...sitemap];
    },
    ["pages-sitemap"],
    {
        tags: ["pages-sitemap"],
    }
);

const getBlogSitemap = unstable_cache(
    async () => {
        const env = getEnv();

        const payload = await getPayload({ config });
        const SITE_URL = env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";

        const results = await payload.find({
            collection: "posts",
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
                  .filter((post) => Boolean(post?.slug))
                  .map((post) => ({
                      loc: `${SITE_URL}/blog/${post?.slug}`,
                      lastmod: post.updatedAt || dateFallback,
                  }))
            : [];

        return sitemap;
    },
    ["blog-sitemap"],
    {
        tags: ["blog-sitemap"],
    }
);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const env = getEnv();

    const baseUrl = env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";

    const pagesSitemap = await getPagesSitemap();
    const blogSitemap = await getBlogSitemap();

    const allUrls = [...pagesSitemap, ...blogSitemap];

    return allUrls.map((entry) => ({
        url: entry.loc,
        lastModified: entry.lastmod,
        priority: entry.loc === baseUrl ? 1 : 0.8,
        changeFrequency: "weekly",
    }));
}
