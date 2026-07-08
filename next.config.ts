import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    trailingSlash: false,
    experimental: {
        serverActions: {
            bodySizeLimit: "5mb",
        },
    },
    images: {
        remotePatterns: [
            new URL("https://sportlabgroningen.nl/**"),
            new URL("https://cdn.sportlabgroningen.nl/**"),
        ],
        loader: "custom",
        loaderFile: "./src/utilities/imageLoader.ts",
        deviceSizes: [320, 480, 640, 768, 1080, 1366, 1920],
        qualities: [75, 85, 100],
        minimumCacheTTL: 31536000,
    },
    headers: async () => {
        return [
            {
                source: "/(.*).(jpg|jpeg|png|webp|avif|gif|svg)",
                headers: [
                    {
                        key: "Cache-Control",
                        value: "public, s-maxage=31536000, max-age=31536000, immutable",
                    },
                ],
            },
        ];
    },
    redirects: async () => {
        return [
            {
                source: "/semi-private-personal-training",
                destination: "/personal-training",
                permanent: true,
            },
            {
                source: "/box-burn",
                destination: "/small-group-training",
                permanent: true,
            },
            {
                source: "/crosstraining",
                destination: "/small-group-training",
                permanent: true,
            },
            {
                source: "/power-hiit",
                destination: "/small-group-training",
                permanent: true,
            },
            {
                source: "/groepstrainingen",
                destination: "/small-group-training",
                permanent: true,
            },
            {
                source: "/samen-sporten",
                destination: "/small-group-training",
                permanent: true,
            },
            {
                source: "/sfeerimpressie",
                destination: "/over-ons",
                permanent: true,
            },
            {
                source: "/rooster",
                destination: "/",
                permanent: true,
            },
            {
                source: "/blog/:path*",
                destination: "/",
                permanent: true,
            },
            {
                source: "/wishlist",
                destination: "/",
                permanent: true,
            },
        ];
    },
};

const payloadNextConfig = withPayload(nextConfig);
const outputFileTracingExcludes = payloadNextConfig.outputFileTracingExcludes;
const rootExcludes = outputFileTracingExcludes?.["**/*"];

if (Array.isArray(rootExcludes)) {
    payloadNextConfig.outputFileTracingExcludes = {
        ...outputFileTracingExcludes,
        "**/*": rootExcludes.filter(
            (entry) => entry !== "drizzle-kit" && entry !== "drizzle-kit/api",
        ),
    };
}

export default payloadNextConfig;
