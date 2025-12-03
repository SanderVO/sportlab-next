"use client";

import OptimizedImage from "@/images/OptimizedImage";
import type { InstagramBlock as InstagramBlockProps } from "@/payload-types";
import { useIsMobile } from "@/utilities/useIsMobile";
import useEmblaCarousel from "embla-carousel-react";
import React from "react";

export const InstagramBlockCarousel: React.FC<InstagramBlockProps> = () => {
    const isMobile = useIsMobile();

    const [emblaRef] = useEmblaCarousel({
        loop: true,
        align: "start",
        containScroll: "trimSnaps",
        active: isMobile,
    });

    const images = [
        "https://cdn-sportlab.sandervanooijen.dev/images/group-4.jpg",
        "https://cdn-sportlab.sandervanooijen.dev/images/group-4.jpg",
        "https://cdn-sportlab.sandervanooijen.dev/images/group-4.jpg",
        "https://cdn-sportlab.sandervanooijen.dev/images/group-4.jpg",
    ];

    return (
        <>
            <div className="w-full h-full overflow-hidden" ref={emblaRef}>
                <div className="flex flex-row h-full gap-0 md:gap-8 -mx-4">
                    {images.map((src, index) => (
                        <div
                            key={index}
                            className="flex flex-row items-center text h-full shrink-0 w-[66.6667%] md:w-[25%] px-2"
                        >
                            <div className="h-full flex flex-col w-full relative">
                                <OptimizedImage
                                    fill
                                    customHeight={400}
                                    loading="lazy"
                                    className="object-cover object-top"
                                    alt="Sportlab Semi Private Training"
                                    src={src}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};
