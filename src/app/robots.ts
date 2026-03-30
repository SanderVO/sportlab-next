import { MetadataRoute } from "next/types";

export default function robots(): MetadataRoute.Robots {
    const siteUrl =
        process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";

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
        sitemap: `${siteUrl}/sitemap.xml`,
    };
}
