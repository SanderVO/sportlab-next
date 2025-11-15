import Link from "next/link";
import OptimizedImage from "./OptimizedImage";

export default async function GrouptrainingPage() {
    const crosstrainingList = [
        {
            title: "Techniek- en skilltraining",
            description:
                "Denk aan uitleg over olympische beweegvormen als de Clean en Snatch, maar ook aan gymnastics zoals Handstands en Pull Ups.",
        },
        {
            title: "Workout of the Day (WOD)",
            description:
                "Waarbij je bovenstaande techniek toepast in een full body, high intensity workout.",
        },
        {
            title: "Strength training",
            description:
                "Als onderdeel van de crosstraining werken we tijdens de Strength training aan je (spier)specifieke kracht.",
        },
    ];

    const powerHiitList = [
        {
            title: "Optimaal vet verliezen",
            description:
                "Maximale hartslag wordt gepushed om zo een optimale verbranding tot stand te brengen.",
        },
        {
            title: "Afterburn effect",
            description:
                "De verbranding kan door middel van het After Burn Effect (of EPOC) tot wel 72 uur na de training doorwerken.",
        },
        {
            title: "Stalen buikspieren",
            description:
                "Om je buikspieren te verstevigen en te werken aan je sixpack.",
        },
    ];

    const listComponent = (title: string, description: string, key: string) => (
        <li key={key}>
            <div className="font-bold italic">{title}</div>

            <div>{description}</div>
        </li>
    );

    return (
        <>
            <section className="bg-sl-beige w-full relative h-[480px] xxl:h-[720px]">
                <div className="h-full relative">
                    <OptimizedImage
                        fill
                        preload={true}
                        alt="Groepstrainingen"
                        src="https://cdn-sportlab.sandervanooijen.dev/images/group-1.jpg"
                        className="object-cover object-left md:object-bottom"
                    />

                    <div className="absolute inset-0 bg-black/40 z-10" />
                </div>
            </section>

            <section className="bg-sl-beige w-full relative h-[480px] xxl:h-[720px]">
                <div className="container mx-auto flex items-center justify-center text-black h-full">
                    <div className="flex flex-col w-full">
                        <h1 className="font-sl-bebas text-4xl md:text-7xl md:w-[50%]">
                            FITNESS CLASSES
                        </h1>

                        <div className="text-md md:w-1/2">
                            Ben je al goed op weg en wil je graag trainen in
                            kleine groepen en onder de juiste begeleiding? Dan
                            kun je ook onze groepslessen proberen.
                        </div>

                        <Link
                            className="transition-colors rounded-3xl bg-black hover:bg-gray-800 mt-8 font-bold text-center py-3 px-10 w-max text-md text-white"
                            href="#"
                        >
                            Boek een proefles
                        </Link>
                    </div>
                </div>
            </section>

            <section className="bg-white w-full relative h-auto sm:h-[720px] xxl:h-[1080px] flex flex-col md:flex-row">
                <div className="container mx-auto h-full flex order-1 md:order-0 flex-col md:flex-row items-center justify-center md:justify-start text-black">
                    <div className="flex flex-col w-full md:w-[50%] py-8 sm:py-0">
                        <h2 className="font-sl-bebas text-4xl md:text-7xl">
                            CROSSTRAINING
                        </h2>

                        <div className="bg-black h-1 w-[100px] mb-4 mt-1"></div>

                        <div className="text-md">
                            Ervaar de ultieme combinatie tussen kracht en
                            (mentaal) uithoudingsvermogen beren.
                        </div>

                        <ul className="list-disc pl-8 mt-6 flex flex-col gap-6">
                            {crosstrainingList.map((item, index: number) =>
                                listComponent(
                                    item.title,
                                    item.description,
                                    `cross-${index}`
                                )
                            )}
                        </ul>

                        <Link
                            className="transition-colors rounded-3xl bg-black hover:bg-gray-800 mt-10 font-bold text-center p-4 w-full md:w-[250px] text-md text-white"
                            href="#"
                        >
                            Boek een proefles
                        </Link>
                    </div>
                </div>

                <div className="relative md:absolute right-0 top-0 z-10 h-[200px] md:h-full order-0 md:order-1 w-full md:w-xl overflow-hidden">
                    <OptimizedImage
                        loading="lazy"
                        height={720}
                        width={576}
                        alt="Groepstrainingen"
                        src="https://cdn-sportlab.sandervanooijen.dev/images/clean-woman-1.jpg"
                        className="object-cover object-center h-[200px] md:h-[720px]"
                    />
                </div>
            </section>

            <section className="bg-white w-full relative h-auto sm:h-[720px] xxl:h-[1080px] flex flex-col md:flex-row">
                <div className="container mx-auto h-full inset-0 z-20 flex flex-col md:flex-row items-center justify-center text-black order-1 basis-[60%]">
                    <div className="flex flex-col pb-8 md:pb-0 w-full md:w-[75%] py-8 sm:py-0">
                        <h2 className="font-sl-bebas text-4xl md:text-7xl">
                            POWER HIIT
                        </h2>

                        <div className="bg-black h-1 w-[100px] mb-4 mt-1"></div>

                        <div className="text-md">
                            Niet te lang trainen maar toch optimaal resultaat
                            bereiken? ngsvermogen beren.
                        </div>

                        <ul className="list-disc pl-8 mt-6 flex flex-col gap-6">
                            {powerHiitList.map((item, index: number) =>
                                listComponent(
                                    item.title,
                                    item.description,
                                    `cross-${index}`
                                )
                            )}
                        </ul>

                        <Link
                            className="transition-colors rounded-3xl bg-black hover:bg-gray-800 mt-10 font-bold text-center p-4 w-full md:w-[250px] text-md text-white"
                            href="#"
                        >
                            Boek een proefles
                        </Link>
                    </div>
                </div>

                <div className="relative order-0 h-auto md:h-full basis-full md:basis-[40%] overflow-hidden">
                    <OptimizedImage
                        width={576}
                        height={720}
                        loading="lazy"
                        className="object-cover object-center md:object-top h-[200px] md:h-[720px]"
                        alt="Groepstrainingen"
                        src="https://cdn-sportlab.sandervanooijen.dev/images/bike-man-1.jpg"
                    />
                </div>
            </section>

            <section className="bg-white w-full relative h-auto md:h-[720px] xxl:h-[1080px] flex flex-col md:flex-row">
                <div className="container mx-auto h-full inset-0 order-1 md:order-0 z-20 flex flex-col md:flex-row items-center justify-center md:justify-start text-black">
                    <div className="flex flex-col w-full md:w-[50%] py-8 sm:py-0">
                        <h2 className="font-sl-bebas text-4xl md:text-7xl">
                            BOX & BURN
                        </h2>

                        <div className="bg-black h-1 w-[100px] mb-4 mt-1"></div>

                        <div className="text-md">
                            Werken aan je bokstechnieken en met een voldaan
                            gevoel de gym uitlopen?
                        </div>

                        <ul className="list-disc pl-8 mt-6 flex flex-col gap-6">
                            {crosstrainingList.map((item, index: number) =>
                                listComponent(
                                    item.title,
                                    item.description,
                                    `cross-${index}`
                                )
                            )}
                        </ul>

                        <Link
                            className="transition-colors rounded-3xl bg-black hover:bg-gray-800 mt-10 font-bold text-center p-4 w-full md:w-[250px] text-md text-white"
                            href="#"
                        >
                            Boek een proefles
                        </Link>
                    </div>
                </div>

                <div className="relative md:absolute right-0 top-0 z-10 h-[200px] md:h-full order-0 md:order-1 w-full md:w-xl overflow-hidden">
                    <OptimizedImage
                        width={576}
                        height={720}
                        loading="lazy"
                        className="object-cover object-center md:object-top h-[200px] md:h-[720px]"
                        alt="Groepstrainingen"
                        src="https://cdn-sportlab.sandervanooijen.dev/images/boxing-man-1.jpg"
                    />
                </div>
            </section>
        </>
    );
}
