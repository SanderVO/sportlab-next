import { MetadataRoute } from "next/types";

export const dynamic = "force-dynamic";

export default function robots(): MetadataRoute.Robots {
    const canonicalSiteUrl = "https://sportlabgroningen.nl";

    const allowIndexing = ["true", "1", "yes", "on"].includes(
        String(process.env.ALLOW_INDEXING).toLowerCase(),
    );

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
            disallow: "/admin/",
        },
        sitemap: `${canonicalSiteUrl}/sitemap.xml`,
    };
}
