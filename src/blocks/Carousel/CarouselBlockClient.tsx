"use client";

import { Media } from "@/components/Media";
import type { CarouselBlock as CarouselBlockProps } from "@/payload-types";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import React from "react";

export const CarouselBlockClient: React.FC<CarouselBlockProps> = (props) => {
    const { carouselItems } = props;

    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: true,
    });

    const onNextClick = () => {
        if (!emblaApi) return;
        emblaApi.scrollNext();
    };

    const onPrevClick = () => {
        if (!emblaApi) return;
        emblaApi.scrollPrev();
    };

    return (
        <div className="flex flex-row justify-between items-center gap-10">
            <div
                className="bg-sl-beige rounded-full w-20 h-20 text-background items-center justify-center text-4xl cursor-pointer transition-transform hover:scale-110 shrink-0 hidden md:flex"
                onClick={onPrevClick}
            >
                <ArrowLeft />
            </div>

            <div className="w-full overflow-hidden" ref={emblaRef}>
                <div className="flex flex-row -mx-2">
                    {carouselItems &&
                        carouselItems.map((carouselItem, index) => (
                            <div
                                key={carouselItem.id || index}
                                className="md:flex-[0_0_100%] min-w-0 w-[66.6667%] px-2 md:px-0 basis-[75%] shrink-0"
                            >
                                <div className="bg-sl-beige rounded-4xl h-[250px] md:mx-4 flex flex-col items-center py-4 px-8 text-black gap-4 justify-center">
                                    <Media
                                        fill
                                        resource={carouselItem.media}
                                        className="w-[50px] h-[50px] relative"
                                        imgClassName="object-cover object-center"
                                    />

                                    <p className="font-sl-montserrat text-sm font-medium basis-[40%] overflow-hidden">
                                        {carouselItem.text}
                                    </p>

                                    <div className="text-lg font-bold shrink-0">
                                        {carouselItem.name}
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
            </div>

            <div
                className="bg-sl-beige rounded-full p-4 w-20 h-20 text-background items-center justify-center text-4xl transition-transform hover:scale-110 shrink-0 cursor-pointer hidden md:flex"
                onClick={onNextClick}
            >
                <ArrowRight />
            </div>
        </div>
    );
};
