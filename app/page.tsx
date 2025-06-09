import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { FaLongArrowAltRight } from "react-icons/fa";
import HomeQuoteCarousel from "../components/HomeQuoteCarousel";
import HomeTeamCarousel from "../components/HomeTeamCarousel";
import { getClient } from "../lib/ApolloClient";
import {
    getMediaItems,
    GetMediaItemsResponse,
    getPage,
    GetPageResponse,
} from "../lib/Query";

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

    const { data: teamItems } = await getClient().query<GetMediaItemsResponse>({
        query: getMediaItems,
        variables: {
            categoryName: "Team",
        },
    });

    return (
        <>
            <Script
                id="home-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.parse(data.page.seo.schema.raw),
                }}
            />

            <section className="bg-background w-full relative h-[75vh] md:h-[60vh]">
                <Image
                    fill
                    priority
                    className="absolute object-cover"
                    alt="Sportlab Semi Private Training"
                    unoptimized
                    src="https://sportlabgroningen.nl/wp-content/uploads/2023/10/SPPT-shoot-header-scaled.jpg"
                />

                <div className="absolute inset-0 bg-black/50 z-10" />

                <div className="container mx-auto z-20 flex items-center justify-start text-white h-full">
                    <div className="flex flex-col w-full md:w-[50%] self-end md:mb-[200px] pb-8 md:pb-0">
                        <h1 className="font-sl-bebas text-5xl md:text-7xl">
                            SEMI PRIVATE PERSONAL TRAINING
                        </h1>

                        <div className="font-sl-open-sans font-semibold italic text-lg md:w-3/5">
                            Because life is easier with a stronger body
                        </div>

                        <Link
                            className="transition-colors rounded-3xl bg-sl-orange hover:bg-sl-orange-dark mt-8 font-bold text-center py-3 px-10 w-max text-lg"
                            href="/semi-private-personal-training"
                        >
                            Bekijk
                        </Link>
                    </div>
                </div>
            </section>

            <section className="bg-background w-full relative h-auto md:h-[60vh] flex-row">
                <div className="container mx-auto flex items-center justify-start text-white py-15 md:py-0 h-full">
                    <div className="flex flex-col text-sl-beige gap-4 md:w-3/5">
                        <h2 className="text-5xl md:text-7xl font-sl-bebas">
                            BUILD A STRONGER BODY
                        </h2>

                        <div className="text-lg">
                            Een no-nonsense gym voor beginnende of gevorderde
                            sporters. Community driven en met een rauw randje
                            zijn wij meer dan je gemiddelde sportschool. Onze
                            missie is om je meer en veelzijdiger te laten
                            bewegen en trainingsprogramma’s te ontwikkelen die
                            je zowel fysiek als mentaal verder brengen.
                        </div>

                        <Link
                            className="w-max transition-colors rounded-3xl bg-sl-beige hover:bg-sl-beige-dark mt-8 font-bold text-center py-3 px-10 text-lg text-background"
                            href="/team"
                        >
                            Over ons
                        </Link>
                    </div>
                </div>

                <div className="absolute right-0 bottom-0 w-1/3 h-9/10 hidden md:block">
                    <Image
                        fill
                        loading="lazy"
                        unoptimized
                        className="object-cover object-top"
                        alt="Sportlab Semi Private Training"
                        src="https://sportlabgroningen.nl/wp-content/uploads/2023/10/SPPT-shoot-header-scaled.jpg"
                    />
                </div>
            </section>

            <section className="bg-sl-beige w-full relative h-auto md:h-[60vh] flex-row">
                <div className="container mx-auto flex flex-col md:flex-row gap-10 md:gap-50 items-center justify-between py-8 md:py-0 h-full">
                    <div className="flex flex-col text-background gap-4 md:gap-0 w-full md:w-1/2 relative">
                        <div className="h-[175px] w-full relative mb-4">
                            <Image
                                fill
                                loading="lazy"
                                className="object-cover object-center rounded-4xl"
                                alt="Sportlab Semi Private Training"
                                src="https://sportlabgroningen.nl/wp-content/uploads/2023/10/SPPT-shoot-header-scaled.jpg"
                                unoptimized
                            />
                        </div>

                        <h2 className="text-5xl md:text-6xl font-sl-bebas">
                            PERSONAL TRAINING
                        </h2>

                        <div className="text-md">
                            Of je nu kiest voor personal training om spiermassa
                            op Liever tijdens onze groepslessen werken aan je te
                            bouwen, af te vallen of fitter te worden, bij
                            Sportlab fitness? Ook dat kan. We bieden
                            Crosstrainingen, Groningen werken we aan een sterke
                            en krachtige basis, HIIT, Strength en bokslessen
                            aan. Alle lessen perfect om jouw doelen te bereiken.
                            Zowel in de gym als hebben een maximaal aantal
                            deelnemers van 10 daarbuiten
                        </div>

                        <Link
                            className="transition-colors rounded-3xl bg-background mt-8 font-bold text-center py-3 px-10 w-max text-lg text-white md:self-center"
                            href="#"
                        >
                            Lees meer
                        </Link>
                    </div>

                    <div className="flex flex-col text-background gap-4 md:gap-0 w-full md:w-1/2">
                        <div className="h-[175px] w-full relative mb-4">
                            <Image
                                fill
                                loading="lazy"
                                className="object-cover object-top rounded-4xl"
                                alt="Sportlab Semi Private Training"
                                src="https://sportlabgroningen.nl/wp-content/uploads/2023/10/SPPT-shoot-header-scaled.jpg"
                                unoptimized
                            />
                        </div>

                        <h2 className="text-5xl md:text-6xl font-sl-bebas">
                            FITNESS CLASSES
                        </h2>

                        <div className="text-md">
                            Liever tijdens onze groepslessen werken aan je te
                            bouwen, af te vallen of fitter te worden, bij
                            Sportlab fitness? Ook dat kan. We bieden
                            Crosstrainingen, Groningen werken we aan een sterke
                            en krachtige basis, HIIT, Strength en bokslessen
                            aan. Alle lessen perfect om jouw doelen te bereiken.
                            Zowel in de gym als hebben een maximaal aantal
                            deelnemers van 10 daarbuiten. personen. Doe je een
                            proefles met ons mee?
                        </div>

                        <Link
                            className="transition-colors rounded-3xl bg-background mt-8 font-bold text-center py-3 px-10 w-max text-lg text-white md:self-center"
                            href="/groepstrainingen"
                        >
                            Lees meer
                        </Link>
                    </div>
                </div>
            </section>

            <section className="bg-white w-full relative h-auto md:h-[50vh] flex-row">
                <div className="container mx-auto flex flex-col h-full justify-center py-15 md:py-0">
                    <div className="flex flex-col">
                        <div className="text-gray-400">eerlijke verhalen</div>

                        <h2 className="text-5xl md:text-7xl font-sl-bebas text-background mt-2">
                            SPORTERS AAN HET WOORD
                        </h2>

                        <div className="border-b-4 border-background w-[100px]"></div>
                    </div>

                    <div className="mt-10">
                        <HomeQuoteCarousel />
                    </div>
                </div>
            </section>

            <section className="bg-background w-full relative h-auto md:h-[60vh] flex-row">
                <div className="container mx-auto flex flex-col h-full justify-center py-15 md:py-0">
                    <h2 className="font-sl-bebas text-5xl md:text-7xl text-sl-beige mb-6">
                        MEET THE TEAM
                    </h2>

                    <div className="flex flex-row justify-between h-[400px] md:h-2/4 gap-20">
                        <HomeTeamCarousel items={teamItems.mediaItems.nodes} />

                        <div className="items-center flex-0 hidden md:flex">
                            <Link
                                href="/team"
                                className="bg-sl-beige rounded-full p-4 w-20 h-20 text-background flex items-center justify-center text-4xl transition-transform hover:scale-110 shrink-0 cursor-pointer"
                            >
                                <FaLongArrowAltRight />
                            </Link>
                        </div>
                    </div>

                    <Link
                        className="block md:hidden transition-colors rounded-3xl bg-sl-beige mt-8 font-bold text-center py-3 px-8 text-lg text-background self-center"
                        href="/team"
                    >
                        Bekijk hele team
                    </Link>
                </div>
            </section>

            <section className="bg-sl-beige w-full relative h-auto md:h-[60vh] flex-row">
                <div className="container mx-auto flex flex-col h-full justify-center py-8 md:py-0 gap-6">
                    <div className="flex flex-row justify-between h-[200px] md:h-1/2 gap-10">
                        <div className="flex flex-row items-center text gap-4 h-full flex-1">
                            <div className="h-full w-full relative">
                                <Image
                                    fill
                                    loading="lazy"
                                    unoptimized
                                    className="object-cover object-top"
                                    alt="Sportlab Semi Private Training"
                                    src="https://sportlabgroningen.nl/wp-content/uploads/2023/10/SPPT-shoot-header-scaled.jpg"
                                />
                            </div>
                        </div>

                        <div className="flex flex-row items-center text gap-4 h-full flex-1">
                            <div className="h-full flex flex-col gap-2 w-full">
                                <div className="h-full w-full relative">
                                    <Image
                                        fill
                                        loading="lazy"
                                        unoptimized
                                        className="object-cover object-top"
                                        alt="Sportlab Semi Private Training"
                                        src="https://sportlabgroningen.nl/wp-content/uploads/2023/10/SPPT-shoot-header-scaled.jpg"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-row items-center text gap-4 h-full flex-1">
                            <div className="h-full flex flex-col w-full">
                                <div className="h-full w-full relative">
                                    <Image
                                        fill
                                        loading="lazy"
                                        unoptimized
                                        className="object-cover object-top"
                                        alt="Sportlab Semi Private Training"
                                        src="https://sportlabgroningen.nl/wp-content/uploads/2023/10/SPPT-shoot-header-scaled.jpg"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-row items-center text gap-4 h-full flex-1">
                            <div className="h-full flex flex-col w-full">
                                <div className="h-full w-full relative">
                                    <Image
                                        fill
                                        loading="lazy"
                                        unoptimized
                                        className="object-cover object-top"
                                        alt="Sportlab Semi Private Training"
                                        src="https://sportlabgroningen.nl/wp-content/uploads/2023/10/SPPT-shoot-header-scaled.jpg"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <div className="border-b-4 border-background w-[100px]"></div>

                        <h2 className="text-4xl md:text-7xl font-sl-bebas text-background mt-2">
                            @SPORTLABGRONINGEN
                        </h2>

                        <div className="text-gray-400 text-sm md:text-md">
                            Volg ons op Instagram
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
