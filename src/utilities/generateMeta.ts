import type { Metadata } from "next";
import type { Config, Media, Page, Post } from "../payload-types";
import { getServerSideURL } from "./getURL";
import customImageLoader from "./imageLoader";
import { mergeOpenGraph } from "./mergeOpenGraph";

const getImageURL = (image?: Media | Config["db"]["defaultIDType"] | null) => {
    if (!image) {
        return null;
    }

    return customImageLoader({
        src: typeof image === "string" ? image : (image as Media)?.url || "",
        width: 1200,
        quality: 85,
    });
};

export const generateMeta = async (args: {
    doc: Partial<Page> | Partial<Post> | null;
}): Promise<Metadata> => {
    const { doc } = args;

    const ogImage = getImageURL(doc?.meta?.image);

    const title = doc?.meta?.title
        ? doc?.meta?.title + " | Sportlab Groningen"
        : "Sportlab Groningen";

    return {
        title,
        description: doc?.meta?.description,
        openGraph: mergeOpenGraph({
            description: doc?.meta?.description || "",
            images: ogImage
                ? [
                      {
                          url: ogImage,
                      },
                  ]
                : undefined,
            title,
            url: Array.isArray(doc?.slug)
                ? doc?.slug.join("/")
                : getServerSideURL(),
        }),
    };
};
