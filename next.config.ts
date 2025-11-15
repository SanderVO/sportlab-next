import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    output: "export",
    trailingSlash: false,
    images: {
        remotePatterns: [
            new URL("https://sportlabgroningen.nl/**"),
            new URL("https://cdn.sportlab.sandervanooijen.dev/**"),
        ],
        loader: "custom",
        loaderFile: "./lib/ImageLoader.ts",
        deviceSizes: [320, 480, 640, 768, 1080, 1366, 1920],
    },
};

export default nextConfig;
