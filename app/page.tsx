import { Metadata } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { FaLongArrowAltRight } from "react-icons/fa";
import HomeQuoteCarousel from "../components/HomeQuoteCarousel";
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

            <div className="bg-background w-full relative h-[80vh] md:h-[75vh]">
                <Image
                    fill
                    priority
                    className="object-cover"
                    alt="Sportlab Semi Private Training"
                    src="https://sportlabgroningen.nl/wp-content/uploads/2023/10/SPPT-shoot-header-scaled.jpg"
                />

                <div className="absolute inset-0 bg-black/40 z-10" />

                <div className="container mx-auto max-w-[85%] absolute inset-0 z-20 flex items-center justify-start text-white">
                    <div className="flex flex-col w-full md:w-[38%] self-end md:mb-[200px] pb-8 md:pb-0">
                        <h1 className="font-bold font-sl-bebas text-5xl md:text-8xl">
                            SEMI PRIVATE PERSONAL TRAINING
                        </h1>

                        <div className="font-bold italic text-lg md:w-3/5">
                            Because life is easier with a stronger body
                        </div>

                        <Link
                            className="transition-colors rounded-3xl bg-sl-orange hover:bg-sl-orange-dark mt-8 font-bold text-center p-3 w-full md:w-[250px] text-lg"
                            href="#"
                        >
                            Bekijk
                        </Link>
                    </div>
                </div>
            </div>

            <div className="bg-background w-full relative h-auto md:h-[75vh] flex-row">
                <div className="container md:absolute mx-auto inset-0 z-20 flex items-center justify-start text-white py-8 md:py-0">
                    <div className="flex flex-col text-sl-beige gap-4 md:w-2/5">
                        <h2 className="font-bold text-5xl md:text-7xl font-sl-bebas">
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
                            className="transition-colors rounded-3xl bg-sl-beige hover:bg-sl-beige-dark mt-8 font-bold text-center p-3 w-full md:w-[250px] text-lg text-background"
                            href="#"
                        >
                            Over ons
                        </Link>
                    </div>

                    <div className="absolute right-[-50px] bottom-0 w-1/3 h-9/10 hidden md:block">
                        <Image
                            fill
                            loading="lazy"
                            className="object-cover object-top"
                            alt="Sportlab Semi Private Training"
                            src="https://sportlabgroningen.nl/wp-content/uploads/2023/10/SPPT-shoot-header-scaled.jpg"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-sl-beige w-full relative h-auto md:h-[75vh] flex-row">
                <div className="container mx-auto md:absolute inset-0 flex flex-col md:flex-row gap-10 md:gap-50 items-center justify-between py-8 md:py-0">
                    <div className="flex flex-col items-center text-background gap-4 w-full md:w-1/2 relative">
                        <div className="h-[250px] w-full relative">
                            <Image
                                fill
                                loading="lazy"
                                className="object-cover object-top"
                                alt="Sportlab Semi Private Training"
                                src="https://sportlabgroningen.nl/wp-content/uploads/2023/10/SPPT-shoot-header-scaled.jpg"
                            />
                        </div>

                        <h2 className="font-bold text-5xl md:text-8xl font-sl-bebas">
                            PERSONAL TRAINING
                        </h2>

                        <div className="text-xl">
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
                            className="transition-colors rounded-3xl bg-background mt-8 font-bold text-center p-3 w-[250px] text-lg text-sl-beige self-center"
                            href="#"
                        >
                            Lees meer
                        </Link>
                    </div>

                    <div className="flex flex-col items-center text-background gap-4 w-full md:w-1/2">
                        <div className="h-[250px] w-full relative">
                            <Image
                                fill
                                loading="lazy"
                                className="object-cover object-top"
                                alt="Sportlab Semi Private Training"
                                src="https://sportlabgroningen.nl/wp-content/uploads/2023/10/SPPT-shoot-header-scaled.jpg"
                            />
                        </div>

                        <h2 className="font-bold text-5xl md:text-8xl font-sl-bebas">
                            FITNESS CLASSES
                        </h2>

                        <div className="text-xl">
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
                            className="transition-colors rounded-3xl bg-background mt-8 font-bold text-center p-3 w-[250px] text-lg text-sl-beige self-center"
                            href="#"
                        >
                            Lees meer
                        </Link>
                    </div>
                </div>
            </div>

            <div className="bg-background w-full relative h-auto md:h-[75vh] flex-row">
                <div className="container mx-auto md:absolute inset-0 flex flex-col h-full justify-center py-8 md:py-0">
                    <h2 className="font-sl-bebas text-5xl md:text-8xl text-sl-beige mb-4">
                        MEET THE TEAM
                    </h2>

                    <div className="flex flex-row justify-between h-[200px] md:h-3/5 gap-20">
                        <div className="flex flex-row items-center text gap-4 h-full flex-1">
                            <div className="h-full flex flex-col gap-2 w-full">
                                <div className="h-full w-3/5 md:w-full relative border-sl-beige border-b-2">
                                    <Image
                                        fill
                                        loading="lazy"
                                        className="object-cover object-top"
                                        alt="Sportlab Semi Private Training"
                                        src="https://sportlabgroningen.nl/wp-content/uploads/2023/10/SPPT-shoot-header-scaled.jpg"
                                    />
                                </div>

                                <div className="text-sl-beige">Sander</div>
                            </div>
                        </div>

                        <div className="flex-row items-center text gap-4 h-full flex-1 hidden md:flex">
                            <div className="h-full flex flex-col gap-2 w-full">
                                <div className="h-full w-full relative border-sl-beige border-b-2">
                                    <Image
                                        fill
                                        loading="lazy"
                                        className="object-cover object-top"
                                        alt="Sportlab Semi Private Training"
                                        src="https://sportlabgroningen.nl/wp-content/uploads/2023/10/SPPT-shoot-header-scaled.jpg"
                                    />
                                </div>

                                <div className="text-sl-beige">Sander</div>
                            </div>
                        </div>

                        <div className="flex-row items-center text gap-4 h-full flex-1 hidden md:flex">
                            <div className="h-full flex flex-col gap-2 w-full">
                                <div className="h-full w-full relative border-sl-beige border-b-2">
                                    <Image
                                        fill
                                        loading="lazy"
                                        className="object-cover object-top"
                                        alt="Sportlab Semi Private Training"
                                        src="https://sportlabgroningen.nl/wp-content/uploads/2023/10/SPPT-shoot-header-scaled.jpg"
                                    />
                                </div>

                                <div className="text-sl-beige">Sander</div>
                            </div>
                        </div>

                        <div className="items-center flex-0 hidden md:flex">
                            <div className="bg-sl-beige rounded-full p-4 w-24 h-24 text-background flex items-center justify-center text-4xl transition-transform hover:scale-110 shrink-0 cursor-pointer">
                                <FaLongArrowAltRight />
                            </div>
                        </div>
                    </div>

                    <Link
                        className="transition-colors rounded-3xl bg-sl-beige mt-8 font-bold text-center p-3 w-[250px] text-lg text-background self-center"
                        href="#"
                    >
                        Bekijk hele team
                    </Link>
                </div>
            </div>

            <div className="bg-white w-full relative h-auto md:h-[50vh] flex-row">
                <div className="container mx-auto md:absolute inset-0 flex flex-col h-full justify-center py-8 md:py-0">
                    <div className="flex flex-col">
                        <div className="text-gray-400">eerlijke verhalen</div>

                        <h2 className="text-5xl md:text-8xl font-sl-bebas text-background mt-2">
                            SPORTERS AAN HET WOORD
                        </h2>

                        <div className="border-b-4 border-background w-[100px]"></div>
                    </div>

                    <div className="mt-10">
                        <HomeQuoteCarousel />
                    </div>
                </div>
            </div>

            <div className="bg-sl-beige w-full relative h-auto md:h-[75vh] flex-row">
                <div className="container mx-auto md:absolute inset-0 flex flex-col h-full justify-center py-8 md:py-0">
                    <div className="flex flex-col gap-8 h-full justify-center">
                        <div className="flex flex-row justify-between h-1/2 gap-10">
                            <div className="flex flex-row items-center text gap-4 h-full flex-1">
                                <div className="h-full w-full relative border-sl-beige border-b-2">
                                    <Image
                                        fill
                                        loading="lazy"
                                        className="object-cover object-top"
                                        alt="Sportlab Semi Private Training"
                                        src="https://sportlabgroningen.nl/wp-content/uploads/2023/10/SPPT-shoot-header-scaled.jpg"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-row items-center text gap-4 h-full flex-1">
                                <div className="h-full flex flex-col gap-2 w-full">
                                    <div className="h-full w-full relative border-sl-beige border-b-2">
                                        <Image
                                            fill
                                            loading="lazy"
                                            className="object-cover object-top"
                                            alt="Sportlab Semi Private Training"
                                            src="https://sportlabgroningen.nl/wp-content/uploads/2023/10/SPPT-shoot-header-scaled.jpg"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-row items-center text gap-4 h-full flex-1">
                                <div className="h-full flex flex-col w-full">
                                    <div className="h-full w-full relative border-sl-beige border-b-2">
                                        <Image
                                            fill
                                            loading="lazy"
                                            className="object-cover object-top"
                                            alt="Sportlab Semi Private Training"
                                            src="https://sportlabgroningen.nl/wp-content/uploads/2023/10/SPPT-shoot-header-scaled.jpg"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-row items-center text gap-4 h-full flex-1">
                                <div className="h-full flex flex-col w-full">
                                    <div className="h-full w-full relative border-sl-beige border-b-2">
                                        <Image
                                            fill
                                            loading="lazy"
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

                            <h2 className="text-5xl md:text-8xl font-sl-bebas text-background mt-2">
                                @SPORTLABGRONINGEN
                            </h2>

                            <div className="text-gray-400">
                                Volg ons op Instagram
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
