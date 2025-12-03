import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    trailingSlash: false,
    images: {
        remotePatterns: [
            new URL("https://sportlabgroningen.nl/**"),
            new URL("https://cdn.sportlab.sandervanooijen.dev/**"),
        ],
        loader: "custom",
        loaderFile: "./src/utilities/imageLoader.ts",
        deviceSizes: [320, 480, 640, 768, 1080, 1366, 1920],
        qualities: [75, 85, 100],
    },
};

export default withPayload(nextConfig);
