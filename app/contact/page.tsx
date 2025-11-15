import { Metadata } from "next";
import { notFound } from "next/navigation";
import OptimizedImage from "../../components/OptimizedImage";
import { getClient } from "../../lib/ApolloClient";
import {
    getContactForm,
    GetContactFormResponse,
    getPage,
    GetPageResponse,
} from "../../lib/Query";
import { ContactForm } from "./ContactForm";

const apolloClient = getClient();

export async function generateMetadata(): Promise<Metadata> {
    const { data } = await apolloClient.query<GetPageResponse>({
        query: getPage,
        variables: {
            id: `/contact`,
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

export default async function ContactPage() {
    const { data } = await apolloClient.query<
        GetContactFormResponse | undefined
    >({
        query: getContactForm,
    });

    if (!data) {
        notFound();
    }

    const { data: pageData } = await apolloClient.query<
        GetPageResponse | undefined
    >({
        query: getPage,
        variables: {
            id: `/contact`,
        },
    });

    if (!pageData?.page) {
        notFound();
    }

    return (
        <>
            <section className="bg-white text-black h-auto md:h-[900px]">
                <div className="container py-10 md:py-20 flex flex-col sm:flex-row h-full items-center gap-10">
                    <div className="flex flex-col gap-10 w-full sm:w-2/3 mb-10 md:mb-0 order-1 sm:order-0">
                        <h1 className="text-5xl font-sl-bebas">
                            {pageData.page.title}
                        </h1>

                        <ContactForm data={data} />
                    </div>

                    <div className="h-[200px] sm:h-full w-full sm:w-1/3 relative order-0 sm:order-1">
                        <OptimizedImage
                            fill
                            customHeight={800}
                            preload={true}
                            className="object-cover object-center"
                            alt="Sportlab contact"
                            src="https://cdn-sportlab.sandervanooijen.dev/images/pt-1.jpg"
                        />
                    </div>
                </div>
            </section>
        </>
    );
}
