import { Media } from "@/components/Media";
import { Pagination } from "@/components/Pagination";
import { Post } from "@/payload-types";
import configPromise from "@payload-config";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next/types";
import { getPayload } from "payload";

export const dynamic = "force-static";
export const revalidate = 600;

export default async function Page() {
    const payload = await getPayload({ config: configPromise });

    const posts = await payload.find({
        collection: "posts",
        depth: 1,
        limit: 12,
        overrideAccess: false,
        select: {
            title: true,
            intro: true,
            thumbnailImage: true,
            slug: true,
            publishedAt: true,
        },
    });

    return (
        <div className="bg-white pt-24 pb-24">
            <div className="container mb-16">
                <div className="prose dark:prose-invert max-w-none mb-6">
                    <h1 className="text-background">Blog</h1>
                </div>

                <div className="flex flex-col gap-6">
                    {posts.docs.map((post: Partial<Post>) => (
                        <Link
                            href={`/blog/${post.slug}`}
                            key={post.slug}
                            className="bg-sl-beige py-10 md:py-5 px-10 rounded-3xl md:h-[250px] flex flex-col md:flex-row relative items-center"
                        >
                            <div className="h-[200px] w-[200px] shrink-0 mb-8 md:mr-8 md:mb-0 relative rounded-full overflow-hidden">
                                <Media resource={post.thumbnailImage} />
                            </div>

                            <div className="flex flex-col">
                                <h2 className="text-xl font-bold">
                                    {post.title}
                                </h2>

                                {post.publishedAt && (
                                    <p className="text-sm text-gray-600 mb-4">
                                        {new Date(
                                            post.publishedAt
                                        ).toLocaleDateString()}
                                    </p>
                                )}

                                <p>{post.intro}</p>
                            </div>

                            <div className="hidden md:flex absolute -right-10 bg-sl-beige rounded-full h-[75px] w-[75px] justify-center items-center text-3xl">
                                <ArrowRight />
                            </div>
                        </Link>
                    ))}
                </div>

                <div>
                    {posts.totalPages > 1 && posts.page && (
                        <Pagination
                            page={posts.page}
                            totalPages={posts.totalPages}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

export function generateMetadata(): Metadata {
    return {
        title: `Payload Website Template Posts`,
    };
}
