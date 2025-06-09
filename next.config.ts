import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    output: "export",
    images: {
        remotePatterns: [new URL("https://sportlabgroningen.nl/**")],
    },
};

export default nextConfig;
