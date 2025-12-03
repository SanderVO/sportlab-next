import type { Metadata } from "next";
import { getServerSideURL } from "./getURL";

const defaultOpenGraph: Metadata["openGraph"] = {
    type: "website",
    description: "Beriek je doelen met Sportlab Groningen",
    images: [
        {
            url: `${getServerSideURL()}/website-template-OG.webp`,
        },
    ],
    siteName: "Sportlab Groningen",
    title: "Sportlab Groningen",
};

export const mergeOpenGraph = (
    og?: Metadata["openGraph"]
): Metadata["openGraph"] => {
    return {
        ...defaultOpenGraph,
        ...og,
        images: og?.images ? og.images : defaultOpenGraph.images,
    };
};
