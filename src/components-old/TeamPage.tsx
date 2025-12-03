import Image from "next/image";
import { getClient } from "../lib-old/ApolloClient";
import { stripHtml } from "../lib-old/Content";
import {
    getMediaItems,
    GetMediaItemsResponse,
    MediaItem,
} from "../lib-old/Query";
import OptimizedImage from "./OptimizedImage";

export default async function TeamPage() {
    const { data } = await getClient().query<GetMediaItemsResponse>({
        query: getMediaItems,
        variables: {
            categoryName: "Team",
        },
    });

    return (
        <>
            <section className="bg-sl-beige w-full relative h-auto md:h-[65vh] flex flex-col md:flex-row">
                <div className="relative h-[200px] md:h-full md:basis-2/5 shrink-0 md:mb-0">
                    <OptimizedImage
                        fill
                        preload={true}
                        className="object-cover object-center"
                        alt="Sportlab Semi Private Training"
                        src="https://cdn-sportlab.sandervanooijen.dev/images/pt-1.jpg"
                    />
                </div>

                <div className="container flex items-center justify-center text-black h-full md:!ml-20 md:!mr-40 py-10 md:py-0">
                    <div className="flex flex-col w-full pb-8 md:pb-0">
                        <h1 className="font-sl-bebas text-5xl md:text-7xl">
                            Over ons
                        </h1>

                        <div className="flex flex-col gap-6 text-md">
                            <p>
                                Sportlab is een sportstudio waar de focus ligt
                                op persoonlijke aandacht en begeleiding. Iedere
                                sporter is uniek en heeft andere behoeften. In
                                een gesprek, tijdens een training en in
                                coaching. Als sporter maak je deel uit van ons
                                team. Oprechte interesse in elkaar maakt ons
                                winnaars.
                            </p>

                            <p>
                                Ons gedachtegoed om je meer en veelzijdiger te
                                laten bewegen uit zich in ons motto ‘One More’.
                                One more set, one more rep, one more workout.
                                Niet alleen in de gym, maar ook zeker
                                daarbuiten. Daarom staan we 24/7 voor je klaar
                                om je te ondersteunen bij je doelen.
                            </p>

                            <p>
                                We werken op afspraak en je zult dus altijd
                                contact hebben met een van onze coaches.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-white w-full relative h-auto py-20 flex flex-row">
                <div className="container flex items-center text-black h-full">
                    <div className="flex flex-col w-full pb-8 md:pb-0">
                        <h2 className="font-sl-bebas text-5xl md:text-7xl">
                            Meet the team
                        </h2>

                        <div className="px-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6 -mx-6">
                                {data?.mediaItems.nodes.map(
                                    (item: MediaItem) => (
                                        <div
                                            key={item.id}
                                            className="relative flex flex-col font-sl-open-sans"
                                        >
                                            <div className="group hover-source relative h-[400] w-full md:w-[300] mb-2 overflow-hidden">
                                                <Image
                                                    src={item.sourceUrl}
                                                    alt={item.altText}
                                                    fill
                                                    className="border-b-4 border-black object-cover object-center"
                                                    loading="lazy"
                                                    sizes={item.sizes}
                                                />

                                                <div className="absolute h-full w-full bg-sl-beige transition-transform translate-y-[440px] target group-hover:translate-y-0 p-8 text-sm opacity-95">
                                                    {stripHtml(
                                                        item.description || ""
                                                    )}
                                                </div>
                                            </div>

                                            <h3 className="font-bold text-sm">
                                                {item.title}
                                            </h3>

                                            <p className="text-xs text-gray-600">
                                                {stripHtml(item.caption || "")}
                                            </p>
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
