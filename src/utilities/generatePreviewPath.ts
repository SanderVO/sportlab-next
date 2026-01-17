import { getEnv } from "@/lib/Env";
import { CollectionSlug, PayloadRequest } from "payload";

const collectionPrefixMap: Partial<Record<CollectionSlug, string>> = {
    posts: "/blog",
    pages: "",
};

type Props = {
    collection: keyof typeof collectionPrefixMap;
    slug: string;
    req: PayloadRequest;
};

export const generatePreviewPath = ({ collection, slug }: Props) => {
    if (slug === undefined || slug === null) {
        return null;
    }

    const encodedSlug = encodeURIComponent(slug);

    const env = getEnv();

    const encodedParams = new URLSearchParams({
        slug: encodedSlug,
        collection,
        path: `${collectionPrefixMap[collection]}/${encodedSlug}`,
        previewSecret: env.PREVIEW_SECRET || "",
    });

    const url = `/next/preview?${encodedParams.toString()}`;

    return url;
};
