import { Metadata } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
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

            <div className="bg-background w-full relative h-[75vh]">
                <Image
                    fill
                    priority
                    className="object-cover"
                    alt="Sportlab Semi Private Training"
                    src="https://sportlabgroningen.nl/wp-content/uploads/2023/10/SPPT-shoot-header-scaled.jpg"
                />

                <div className="absolute inset-0 bg-black/40 z-10" />

                <div className="container mx-auto absolute inset-0 z-20 flex items-center justify-start text-white">
                    <div className="flex flex-col w-[38%] self-end mb-[200px]">
                        <h1 className="font-bold font-sl-bebas text-8xl">
                            SEMI PRIVATE PERSONAL TRAINING
                        </h1>

                        <div className="font-bold italic text-xl w-3/5">
                            Because life is easier with a stronger body
                        </div>

                        <Link
                            className="transition-colors rounded-3xl bg-sl-orange hover:bg-sl-orange-dark mt-8 font-bold text-center p-3 w-[250px] text-lg"
                            href="#"
                        >
                            Bekijk
                        </Link>
                    </div>
                </div>
            </div>

            <div className="bg-background w-full relative h-[75vh] flex-row">
                <div className="container mx-auto absolute inset-0 z-20 flex items-center justify-start text-white">
                    <div className="flex flex-col text-sl-beige gap-4 w-2/5">
                        <h2 className="font-bold text-7xl font-sl-bebas">
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
                            className="transition-colors rounded-3xl bg-sl-beige hover:bg-sl-beige-dark mt-8 font-bold text-center p-3 w-[250px] text-lg text-background"
                            href="#"
                        >
                            Over ons
                        </Link>
                    </div>

                    <div className="absolute right-[-50px] bottom-0 w-1/3 h-9/10">
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

            <div className="bg-sl-beige w-full relative h-[75vh] flex-row">
                <div className="container mx-auto absolute inset-0 flex flex-row gap-50 items-center justify-between">
                    <div className="flex flex-col items-center text-background gap-4 w-1/2 relative">
                        <div className="h-[250px] w-full relative">
                            <Image
                                fill
                                loading="lazy"
                                className="object-cover object-top"
                                alt="Sportlab Semi Private Training"
                                src="https://sportlabgroningen.nl/wp-content/uploads/2023/10/SPPT-shoot-header-scaled.jpg"
                            />
                        </div>

                        <h2 className="font-bold text-8xl font-sl-bebas">
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

                    <div className="flex flex-col items-center text-background gap-4 w-1/2">
                        <div className="h-[250px] w-full relative">
                            <Image
                                fill
                                loading="lazy"
                                className="object-cover object-top"
                                alt="Sportlab Semi Private Training"
                                src="https://sportlabgroningen.nl/wp-content/uploads/2023/10/SPPT-shoot-header-scaled.jpg"
                            />
                        </div>

                        <h2 className="font-bold text-8xl font-sl-bebas">
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

            <div className="bg-background w-full relative h-[75vh] flex-row">
                <div className="container mx-auto absolute inset-0 flex flex-col h-full">
                    <h2 className="font-sl-bebas text-8xl text-sl-beige mb-4">
                        MEET THE TEAM
                    </h2>

                    <div className="flex flex-row justify-between h-3/5 gap-20">
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

                                <div className="text-sl-beige">Sander</div>
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

                                <div className="text-sl-beige">Sander</div>
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

                                <div className="text-sl-beige">Sander</div>
                            </div>
                        </div>

                        <div className="flex items-center flex-0">
                            <div className="bg-sl-beige rounded-full p-4 w-24 h-24 text-background flex items-center justify-center">
                                Next
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white w-full relative h-[75vh] flex-row">
                <div className="container mx-auto absolute inset-0 flex flex-col h-full justify-center">
                    <div>
                        <div className="text-gray-500">eerlijke verhalen</div>

                        <h2 className="text-8xl font-sl-bebas text-background mt-2">
                            SPORTERS AAN HET WOORD
                        </h2>

                        <div className="border-b-4 border-background w-[100px]"></div>
                    </div>
                </div>
            </div>

            <div className="bg-sl-beige w-full relative h-[75vh] flex-row">
                <div className="container mx-auto absolute inset-0 flex flex-col h-full"></div>
            </div>
        </>
    );
}
