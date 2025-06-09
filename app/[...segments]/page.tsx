import { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import ArticleListPage from "../../components/ArticleListPage";
import GrouptrainingPage from "../../components/GrouptrainingPage";
import SemiPrivatePage from "../../components/SemiPrivatePage";
import TeamPage from "../../components/TeamPage";
import { getClient } from "../../lib/ApolloClient";
import {
    getPage,
    GetPageResponse,
    getPages,
    GetPagesResponse,
    Page,
} from "../../lib/Query";

interface Props {
    params: Promise<{
        segments: string[];
    }>;
}

export const revalidate = 3600;

export async function generateStaticParams() {
    const { data } = await getClient().query<GetPagesResponse>({
        query: getPages,
    });

    return data.pages.nodes.map((page: Page) => ({
        segments: page.uri?.split("/").filter(Boolean),
    }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const paramsValue = await params;

    const { data } = await getClient().query<GetPageResponse>({
        query: getPage,
        variables: {
            id: paramsValue.segments?.join("/"),
        },
    });

    if (!data?.page) {
        return {};
    }

    return {
        title: data.page.seo.title,
        description: data.page.seo.metaDesc,
        robots: {
            index: data.page.seo.metaRobotsNoindex === "index",
            follow: data.page.seo.metaRobotsNofollow === "follow",
        },
        alternates: {
            canonical: data.page.seo.canonical,
        },
        openGraph: {
            title: data.page.seo.opengraphTitle,
            description: data.page.seo.opengraphDescription,
            url: data.page.seo.canonical,
            siteName: "Sportlab Groningen",
        },
        twitter: {
            title: data.page.seo.twitterTitle,
            description: data.page.seo.twitterDescription,
            card: "summary_large_image",
        },
    };
}

export default async function WordpressPage({ params }: Props) {
    const paramsValue = await params;

    const { data } = await getClient().query<GetPageResponse>({
        query: getPage,
        variables: {
            id: paramsValue.segments?.join("/"),
        },
    });

    if (!data?.page) {
        notFound();
    }

    return (
        <>
            {data.page.seo?.schema && (
                <Script
                    id={`${data.page.slug}-schema`}
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: data.page.seo.schema.raw,
                    }}
                ></Script>
            )}

            {data.page.slug === "semi-private-personal-training" && (
                <SemiPrivatePage />
            )}

            {data.page.slug === "groepstrainingen" && <GrouptrainingPage />}

            {data.page.slug === "team" && <TeamPage />}

            {data.page.slug === "blog" && (
                <ArticleListPage page={data.page} type="blog" />
            )}

            {data.page.slug === "vacatures" && (
                <ArticleListPage page={data.page} type="vacatures" />
            )}
        </>
    );
}
