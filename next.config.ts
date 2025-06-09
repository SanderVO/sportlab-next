import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    output: "export",
    trailingSlash: true,
    images: {
        remotePatterns: [new URL("https://sportlabgroningen.nl/**")],
    },
};

export default nextConfig;
