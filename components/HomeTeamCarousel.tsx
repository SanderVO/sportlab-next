"use client";

import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { MediaItem } from "../lib/Query";

interface Props {
    items: MediaItem[];
}

export default function HomeTeamCarousel({ items }: Props) {
    const [isMobile, setIsMobile] = useState(false);

    const [emblaRef] = useEmblaCarousel({
        loop: true,
        align: "start",
        containScroll: "trimSnaps",
        active: isMobile,
    });

    useEffect(() => {
        const checkScreen = () => setIsMobile(window.innerWidth < 768);
        checkScreen();
        window.addEventListener("resize", checkScreen);
        return () => window.removeEventListener("resize", checkScreen);
    }, []);

    return (
        <div className="w-full overflow-hidden" ref={emblaRef}>
            <div className="flex flex-row h-full md:gap-8 -mx-2">
                {items.map((teamItem: MediaItem, index: number) => (
                    <div
                        key={index}
                        className="flex flex-row items-center text h-full flex-shrink-0 w-[66.6667%] md:w-[30%] px-2"
                    >
                        <div className="h-full flex flex-col gap-2 w-full">
                            <div className="h-full w-full relative">
                                <Image
                                    fill
                                    loading="lazy"
                                    className="object-cover object-top rounded-3xl"
                                    alt={teamItem.altText}
                                    src={teamItem.sourceUrl}
                                    sizes={teamItem.sizes}
                                />
                            </div>

                            <div className="text-sl-beige text-xs">
                                {teamItem.description}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
