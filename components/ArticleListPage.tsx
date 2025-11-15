import Link from "next/link";
import { FaLongArrowAltRight } from "react-icons/fa";
import { getClient } from "../lib/ApolloClient";
import { getPosts, GetPostsResponse, Page, Post } from "../lib/Query";
import OptimizedImage from "./OptimizedImage";

interface Props {
    page: Page;
    type: string;
}

export default async function ArticleListPage({ page }: Props) {
    const { data } = await getClient().query<GetPostsResponse | undefined>({
        query: getPosts,
        variables: {
            last: 10,
        },
    });

    return (
        <>
            <div className="bg-white text-black">
                <div className="container py-10 md:py-20">
                    <h1 className="text-5xl font-sl-bebas">{page.title}</h1>

                    <div className="flex flex-col mt-10 gap-10">
                        {data?.posts.nodes.map((post: Post) => (
                            <Link
                                href={`/blog/${post.slug}`}
                                key={post.slug}
                                className="bg-sl-beige py-10 md:py-5 px-10 rounded-3xl md:h-[250px] flex flex-col md:flex-row relative items-center"
                            >
                                <div className="h-[200px] w-[200px] shrink-0 mb-8 md:mr-8 md:mb-0 relative rounded-full overflow-hidden">
                                    <OptimizedImage
                                        src={`https://sportlabgroningen.nl${post.featuredImage?.node.filePath}`}
                                        width={200}
                                        height={200}
                                        customHeight={200}
                                        fit="contain"
                                        loading="lazy"
                                        alt={
                                            post.featuredImage?.node.altText ??
                                            ""
                                        }
                                        className="object-cover object-center h-[200px] w-[200px]"
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <h2 className="text-xl font-bold">
                                        {post.title}
                                    </h2>

                                    <p className="text-sm text-gray-600 mb-4">
                                        {new Date(
                                            post.date
                                        ).toLocaleDateString()}
                                    </p>

                                    <div
                                        dangerouslySetInnerHTML={{
                                            __html: post.excerpt,
                                        }}
                                    ></div>
                                </div>

                                <div className="hidden md:flex absolute -right-10 bg-sl-beige rounded-full h-[75px] w-[75px] justify-center items-center text-3xl">
                                    <FaLongArrowAltRight />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
