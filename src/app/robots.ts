import { MetadataRoute } from "next/types";

export default function robots(): MetadataRoute.Robots {
    const siteUrl =
        process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";

    const allowIndexing = process.env.ALLOW_INDEXING === "true";

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
        sitemap: `${siteUrl}/sitemap.xml`,
    };
}
