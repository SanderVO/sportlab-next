import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getClient } from "../../../lib/ApolloClient";
import {
    getPost,
    GetPostResponse,
    getPosts,
    GetPostsResponse,
    Post,
} from "../../../lib/Query";

interface Props {
    params: Promise<{
        slug: string;
    }>;
}

const apolloClient = getClient();

export async function generateStaticParams() {
    const { data } = await apolloClient.query<GetPostsResponse>({
        query: getPosts,
        variables: {
            last: 10,
        },
    });

    if (!data?.posts?.nodes) {
        return [];
    }

    return data.posts.nodes.map((post: Post) => ({
        slug: post.slug,
    }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const paramsValue = await params;

    const { data } = await apolloClient.query<GetPostResponse>({
        query: getPost,
        variables: {
            id: `/blog/${paramsValue.slug}`,
        },
    });

    if (!data?.post) {
        return {};
    }

    return {
        title: data.post.seo.title,
        description: data.post.seo.metaDesc,
        robots: {
            index: data.post.seo.metaRobotsNoindex === "index",
            follow: data.post.seo.metaRobotsNofollow === "follow",
        },
        alternates: {
            canonical: data.post.seo.canonical,
        },
        openGraph: {
            title: data.post.seo.opengraphTitle,
            description: data.post.seo.opengraphDescription,
            url: data.post.seo.canonical,
            siteName: "Sportlab Groningen",
        },
        twitter: {
            title: data.post.seo.twitterTitle,
            description: data.post.seo.twitterDescription,
            card: "summary_large_image",
        },
    };
}

export default async function WordpressPage({ params }: Props) {
    const paramsValue = await params;

    const { data } = await apolloClient.query<GetPostResponse>({
        query: getPost,
        variables: {
            id: `/blog/${paramsValue.slug}`,
        },
    });

    if (!data?.post) {
        notFound();
    }

    return (
        <>
            <div className="bg-white text-black">
                <div className="container py-10 md:py-20">
                    <h1 className="text-5xl font-sl-bebas">
                        {data.post.title}
                    </h1>

                    <div
                        className="overflow-hidden mt-4 prose prose-lg"
                        dangerouslySetInnerHTML={{
                            __html: data.post.content || "",
                        }}
                    ></div>
                </div>
            </div>
        </>
    );
}
