import { RenderBlocks } from "@/blocks/RenderBlocks";
import { LivePreviewListener } from "@/components/LivePreviewListener";
import { PayloadRedirects } from "@/components/PayloadRedirects";
import { Hero } from "@/Hero/Hero";
import { generateMeta } from "@/utilities/generateMeta";
import configPromise from "@payload-config";
import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { getPayload } from "payload";
import { cache } from "react";
import PageClient from "./page.client";

type Args = {
    params: Promise<{
        slug?: string;
    }>;
};

export async function generateStaticParams() {
    const payload = await getPayload({ config: configPromise });
    const pages = await payload.find({
        collection: "pages",
        draft: false,
        limit: 1000,
        overrideAccess: false,
        pagination: false,
        select: {
            slug: true,
        },
    });

    const params = pages.docs
        ?.filter((doc) => {
            return doc.slug !== "home";
        })
        .map(({ slug }) => {
            return { slug };
        });

    return params;
}

export default async function Page({ params: paramsPromise }: Args) {
    const { isEnabled: draft } = await draftMode();
    const { slug = "home" } = await paramsPromise;
    const decodedSlug = decodeURIComponent(slug);
    const url = "/" + decodedSlug;

    const page = await queryPageBySlug({
        slug: decodedSlug,
    });

    if (!page) {
        return <PayloadRedirects url={url} />;
    }

    const { hero, layout, meta } = page;

    return (
        <>
            <PageClient />

            <PayloadRedirects disableNotFound url={url} />

            {draft && <LivePreviewListener />}

            {hero && <Hero {...hero} />}

            <RenderBlocks blocks={layout} />

            {meta?.richSnippets && (
                <>
                    {meta.richSnippets.map((snippet, index) => {
                        if (snippet?.jsonLd) {
                            return (
                                <script
                                    key={index}
                                    type="application/ld+json"
                                    // eslint-disable-next-line react/no-danger
                                    dangerouslySetInnerHTML={{
                                        __html: JSON.stringify(
                                            snippet.jsonLd
                                        ).replace(/</g, "\\u003c"),
                                    }}
                                />
                            );
                        }
                        return null;
                    })}
                </>
            )}
        </>
    );
}

export async function generateMetadata({
    params: paramsPromise,
}: Args): Promise<Metadata> {
    const { slug = "home" } = await paramsPromise;
    const decodedSlug = decodeURIComponent(slug);
    const page = await queryPageBySlug({
        slug: decodedSlug,
    });

    return generateMeta({ doc: page });
}

const queryPageBySlug = cache(async ({ slug }: { slug: string }) => {
    const { isEnabled: draft } = await draftMode();

    const payload = await getPayload({ config: configPromise });

    const result = await payload.find({
        collection: "pages",
        draft,
        limit: 1,
        pagination: false,
        overrideAccess: draft,
        where: {
            slug: {
                equals: slug,
            },
        },
    });

    return result.docs?.[0] || null;
});
