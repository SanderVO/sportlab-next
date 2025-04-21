import { Metadata } from "next";
import Head from "next/head";
import { getClient } from "../lib/ApolloClient";
import { getPage, GetPageResponse } from "../lib/Query";

export async function generateMetadata(): Promise<Metadata> {
    const { data } = await getClient().query<GetPageResponse>({
        query: getPage,
        variables: {
            id: "/",
        },
    });

    return {
        title: data.page.seo.title,
        description: data.page.seo.metaDesc,
        alternates: {
            canonical: data.page.seo.canonical,
        },
        openGraph: {
            title: data.page.seo.opengraphTitle,
            description: data.page.seo.opengraphDescription,
            url: `https://sportlabgroningen.nl/`,
            siteName: "Sportlab Groningen",
        },
        twitter: {
            title: data.page.seo.twitterTitle,
            description: data.page.seo.twitterDescription,
            card: "summary_large_image",
        },
    };
}

export default async function Page() {
    const { data } = await getClient().query<GetPageResponse>({
        query: getPage,
        variables: {
            id: "/",
        },
    });

    return (
        <>
            <Head>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.parse(data.page.seo.schema.raw),
                    }}
                />
            </Head>

            <div>
                <div>test</div>

                <div className="flex flex-row items-center">
                    <div className="flex-1"></div>

                    <iframe
                        className="flex-1 h-[500px] border-none"
                        src="https://sportlabgroningen.virtuagym.com//classes/week/?event_type=8&amp;embedded=1"
                        allowFullScreen
                    ></iframe>
                </div>
            </div>
        </>
    );
}
