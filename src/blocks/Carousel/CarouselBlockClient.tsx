"use client";

import { Media } from "@/components/Media";
import { GoogleIcon } from "@/components/Social/Icons";
import type { CarouselBlock as CarouselBlockProps } from "@/payload-types";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight, Star } from "lucide-react";
import Link from "next/link";
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
                                <div className="bg-sl-beige rounded-4xl h-[300px] sm:h-[250px] md:mx-4 flex flex-col py-6 px-8 text-black gap-4">
                                    <div className="flex flex-row items-center justify-between">
                                        <div className="flex flex-row items-center gap-4">
                                            <Media
                                                fill
                                                resource={carouselItem.media}
                                                className="w-[50px] h-[50px] sm:w-[75px] sm:h-[75px] relative"
                                                imgClassName="object-cover object-center rounded-full"
                                            />

                                            <div className="flex flex-col justify-between gap-1">
                                                <div className="text-lg font-bold shrink-0">
                                                    {carouselItem.name}
                                                </div>

                                                <div className="text-sl-orange flex flex-row gap-1">
                                                    {[1, 2, 3, 4, 5].map(
                                                        (star) => (
                                                            <div
                                                                key={
                                                                    "star-" +
                                                                    star
                                                                }
                                                            >
                                                                <Star
                                                                    className="hidden sm:block"
                                                                    height={20}
                                                                    width={20}
                                                                    fill="#ff914d"
                                                                />

                                                                <Star
                                                                    className="block sm:hidden"
                                                                    height={15}
                                                                    width={15}
                                                                    fill="#ff914d"
                                                                />
                                                            </div>
                                                        ),
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {carouselItem.google_url && (
                                            <Link
                                                href={carouselItem.google_url}
                                                target="_blank"
                                                className="text-black"
                                            >
                                                <GoogleIcon
                                                    width={30}
                                                    height={30}
                                                />
                                            </Link>
                                        )}
                                    </div>

                                    <p className="font-sl-montserrat text-sm font-medium overflow-hidden">
                                        {carouselItem.text}
                                    </p>
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
