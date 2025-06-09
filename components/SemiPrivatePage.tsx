import Image from "next/image";
import Link from "next/link";

export default async function SemiPrivatePage() {
    return (
        <>
            <section className="bg-background w-full relative h-[75vh] md:h-[60vh]">
                <Image
                    fill
                    priority
                    className="object-cover object-[0_35%]"
                    alt="Sportlab Semi Private Training"
                    src="/images/semi-private-1.jpg"
                />

                <div className="absolute inset-0 bg-black/50 z-10" />

                <div className="container mx-auto z-20 flex items-center justify-start text-white h-full">
                    <div className="flex flex-col w-full self-end md:mb-[200px] pb-8 md:pb-0 text-sl-beige">
                        <h1 className="font-sl-bebas text-5xl md:text-7xl md:w-[50%]">
                            SEMI PRIVATE PERSONAL TRAINING
                        </h1>

                        <div className="text-md md:text-lg md:w-1/2">
                            Ben jij er klaar voor om je boksskills naar een
                            hoger niveau te tillen? Of wil je graag fitter
                            worden, afvallen, maar in combinatie met
                            bokstrainingen? Dan is ons unieke boks programma
                            perfect voor jou.
                        </div>

                        <Link
                            className="transition-colors rounded-3xl bg-sl-beige hover:bg-sl-beige-dark mt-8 font-bold text-center py-3 px-10 w-max text-lg text-black"
                            href="#"
                        >
                            Kom kennismaken
                        </Link>
                    </div>
                </div>
            </section>

            <section className="bg-white w-full relative h-auto md:h-[75vh] flex-row">
                <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-10 md:gap-0 text-white py-10 h-full">
                    <div className="h-[200px] md:h-full w-full md:w-[400px] relative flex-shrink-0 block md:hidden">
                        <Image
                            fill
                            loading="lazy"
                            className="object-cover object-center rounded-4xl"
                            alt="Sportlab Semi Private Training"
                            src="/images/semi-private-2.jpg"
                        />
                    </div>

                    <div className="flex flex-col text-black gap-4 w-full md:w-[50%]">
                        <h2 className="font-medium text-4xl md:text-6xl">
                            Personal growth & a ‘shitload of fun’
                        </h2>

                        <div className="text:md md:text-lg">
                            Elke training begint met bokstechnieken. Je werkt
                            met een partner aan stoottechnieken, voetenwerk,
                            combinaties en verdediging.
                        </div>

                        <div className="text:md md:text-lg">
                            Geen volle zalen, maar focus op persoonlijke groei.
                            Je gaat gedurende 12 weken intensief met jouw coach
                            werken aan je bokstechniek en de grondbeginselen van
                            het boksen door middel van een geïndividualiseerd
                            plan.
                        </div>

                        <div className="text:md md:text-lg">
                            Het tweede deel van de training bevat jouw
                            persoonlijke trainingsplan. Denk aan oefeningen
                            gericht op kracht, souplesse, snelheid,
                            explosiviteit en mobiliteit.
                        </div>

                        <div className="text:md md:text-lg">
                            Weten waar je aan werkt door middel van een
                            maandelijks coach moment om te sparren over jouw
                            voortgang
                        </div>

                        <Link
                            className="transition-colors rounded-3xl bg-black hover:bg-gray-900 text-white mt-8 font-bold text-center py-3 px-10 w-max text-lg"
                            href="#"
                        >
                            Meer weten?
                        </Link>
                    </div>

                    <div className="h-[200px] md:h-full w-full md:w-[400px] relative flex-shrink-0 hidden md:block">
                        <Image
                            fill
                            loading="lazy"
                            className="object-cover object-top rounded-4xl"
                            alt="Sportlab Semi Private Training"
                            src="/images/semi-private-2.jpg"
                        />
                    </div>
                </div>
            </section>

            <section className="bg-sl-beige text-black w-full relative h-auto md:h-[75vh] flex-row">
                <div className="container mx-auto flex flex-col md:flex-row items-center justify-start gap-10 md:gap-30 py-10 h-full">
                    <div className="h-[200px] md:h-full w-full md:w-[400px] relative flex-shrink-0">
                        <Image
                            fill
                            loading="lazy"
                            className="object-cover object-[0_15%] md:object-top rounded-4xl"
                            alt="Sportlab Semi Private Training"
                            src="/images/semi-private-3.jpg"
                        />
                    </div>

                    <div className="flex flex-col gap-4 w-full md:w-[60%]">
                        <h2 className="font-medium text-4xl md:text-6xl">
                            Waarom Semi-private personal boxing
                        </h2>

                        <div className="text-md md:text-lg">
                            Tijdens het traject heb je de support van een team
                            tot 5 andere sporters en wordt je intensief begeleid
                            door een coach met ervaring in zowel wedstrijd
                            boksen als recreatief boksen.
                        </div>

                        <div className="text-md md:text-lg">
                            De coach begeleidt je stap voor stap zodat je
                            gericht kunt trainen en elke week sterker, fitter en
                            technischer wordt. Je werkt zoals een bokser traint
                            – met discipline, structuur en duidelijke doelen –
                            maar op jouw niveau en in jouw tempo.
                        </div>

                        <Link
                            className="transition-colors rounded-3xl bg-black hover:bg-gray-900 text-white mt-8 font-bold text-center py-3 px-10 w-max text-lg"
                            href="#"
                        >
                            Meer weten?
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
}
