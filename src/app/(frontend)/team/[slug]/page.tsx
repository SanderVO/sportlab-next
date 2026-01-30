import { LivePreviewListener } from "@/components/LivePreviewListener";
import { Media } from "@/components/Media";
import { PayloadRedirects } from "@/components/PayloadRedirects";
import RichText from "@/components/RichText";
import configPromise from "@payload-config";
import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { getPayload } from "payload";
import { cache } from "react";

type Args = {
    params: Promise<{
        slug?: string;
    }>;
};

const queryUserBySlug = cache(async ({ slug }: { slug: string }) => {
    const { isEnabled: draft } = await draftMode();

    const payload = await getPayload({ config: configPromise });

    const result = await payload.find({
        collection: "users",
        draft,
        limit: 1,
        overrideAccess: draft,
        pagination: false,
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

    const users = await payload.find({
        collection: "users",
        draft: false,
        limit: 1000,
        overrideAccess: false,
        pagination: false,
        select: {
            slug: true,
        },
        where: {
            status: {
                equals: "active",
            },
            roles: {
                contains: "coach",
            },
        },
    });

    const params = users.docs
        .filter((user) => user.slug)
        .map(({ slug }) => {
            return { slug };
        });

    return params ?? [];
}

export async function generateMetadata({
    params: paramsPromise,
}: Args): Promise<Metadata> {
    const { slug = "" } = await paramsPromise;
    const decodedSlug = decodeURIComponent(slug);
    const user = await queryUserBySlug({ slug: decodedSlug });

    return {
        title: user.name + " - Coach bij Sportlab Groningen",
        description: user?.about,
        robots: "noindex, nofollow",
    };
}

export default async function Coach({ params: paramsPromise }: Args) {
    const { isEnabled: draft } = await draftMode();
    const { slug = "" } = await paramsPromise;
    const decodedSlug = decodeURIComponent(slug);
    const url = "/team/" + decodedSlug;
    const user = await queryUserBySlug({ slug: decodedSlug });

    if (!user) return <PayloadRedirects url={url} />;

    return (
        <article className="bg-background">
            <PayloadRedirects disableNotFound url={url} />

            {draft && <LivePreviewListener />}

            <section className="flex items-center w-full relative h-auto sm:min-h-[720px] xxl:min-h-[1080px] flex-col md:flex-row md:py-12">
                {user.avatar && (
                    <Media
                        resource={user.avatar}
                        size="(max-width: 768px) 400px, 480px"
                        htmlElement={null}
                        pictureClassName="relative md:absolute left-0 bottom-0 w-full sm:w-[250px] lg:w-[480px] h-[400px] md:h-full"
                        imgClassName="h-full object-cover object-top md:object-center"
                        imgWidth={480}
                        imgHeight={700}
                    />
                )}

                <div className="flex flex-col gap-4 sm:gap-0 w-full relative self-baseline sm:w-full mt-8 sm:mt-0 sm:pl-[40%]">
                    {user.content && (
                        <RichText
                            className="max-w-3xl mx-auto text-sl-beige"
                            data={user.content}
                            enableGutter={true}
                            enableProse={false}
                        />
                    )}
                </div>
            </section>
        </article>
    );
}
