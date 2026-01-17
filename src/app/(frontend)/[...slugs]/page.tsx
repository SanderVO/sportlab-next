import { RenderBlocks } from "@/blocks/RenderBlocks";
import { Hero } from "@/components/Hero/Hero";
import { LivePreviewListener } from "@/components/LivePreviewListener";
import { PayloadRedirects } from "@/components/PayloadRedirects";
import { buildFullSlug } from "@/utilities/buildFullSlug";
import { generateMeta } from "@/utilities/generateMeta";
import configPromise from "@payload-config";
import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { getPayload, PaginatedDocs } from "payload";
import { cache } from "react";
import PageClient from "./page.client";

type Args = {
    params: Promise<{
        slugs?: string[];
    }>;
};

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
        ?.filter((doc: PaginatedDocs["docs"][0]) => doc.slug !== "home")
        .map(
            async (page: PaginatedDocs["docs"][0]) =>
                await buildFullSlug(page, payload),
        );

    return params;
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
    const { slugs = ["home"] } = await params;
    const slug = slugs.at(-1) || "home";

    const decodedSlug = decodeURIComponent(slug);

    const page = await queryPageBySlug({
        slug: decodedSlug,
    });

    return generateMeta({ doc: page });
}

export default async function Page({ params }: Args) {
    const { isEnabled: draft } = await draftMode();
    const { slugs = ["home"] } = await params;
    const slug = slugs.at(-1) || "home";

    const decodedSlug = decodeURIComponent(slug);
    const url = "/" + decodedSlug;

    const page = await queryPageBySlug({
        slug: decodedSlug,
    });

    if (!page) {
        return <PayloadRedirects url={url} />;
    }

    const { hero, layout, meta, hasHero } = page;

    return (
        <>
            <PageClient />

            <PayloadRedirects disableNotFound url={url} />

            {draft && <LivePreviewListener />}

            {hasHero && <Hero {...hero} />}

            <RenderBlocks blocks={layout} />

            {meta?.richSnippets && (
                <>
                    {meta.richSnippets.map((snippet, index) => {
                        if (snippet?.jsonLd) {
                            return (
                                <script
                                    key={index}
                                    type="application/ld+json"
                                    dangerouslySetInnerHTML={{
                                        __html: JSON.stringify(
                                            snippet.jsonLd,
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
