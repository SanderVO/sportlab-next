"use client";

import RichText from "@/components/RichText";
import type { InstagramBlock as InstagramBlockProps } from "@/payload-types";
import { cn } from "@/utilities/ui";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import React from "react";
import { InstagramBlockCarousel } from "./InstagramBlockCarousel";

export const InstagramBlock: React.FC<InstagramBlockProps> = (props) => {
    const { title, content, backgroundColor } = props;

    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: true,
        align: "start",
        containScroll: "trimSnaps",
        active: true,
    });

    return (
        <div className="container mx-auto flex flex-col h-full justify-center py-8 md:py-0 gap-6">
            <div className="flex flex-row h-auto">
                <InstagramBlockCarousel emblaRef={emblaRef} {...props} />
            </div>

            <div className="flex flex-row justify-between">
                <div className="flex flex-col">
                    <div className="border-b-4 border-background w-[100px]"></div>

                    <h2
                        className={cn(
                            "text-4xl md:text-7xl font-sl-bebas mt-2",
                            backgroundColor === "backgroundDark"
                                ? "text-sl-beige"
                                : "text-background",
                        )}
                    >
                        {title}
                    </h2>

                    <div className="text-sm md:text-md">
                        <RichText
                            data={content}
                            enableProse={false}
                            enableGutter={false}
                        />
                    </div>
                </div>

                <div className="hidden md:flex flex-row gap-6 items-center justify-end">
                    <div
                        className={cn(
                            "flex justify-center items-center w-14 h-14 rounded-full cursor-pointer",
                            backgroundColor === "backgroundDark"
                                ? "bg-sl-beige text-background"
                                : "bg-background text-sl-beige",
                        )}
                        onClick={() => emblaApi?.scrollPrev()}
                    >
                        <ArrowLeftIcon width={32} height={32} />
                    </div>

                    <div
                        className={cn(
                            "flex justify-center items-center w-14 h-14 rounded-full cursor-pointer",
                            backgroundColor === "backgroundDark"
                                ? "bg-sl-beige text-background"
                                : "bg-background text-sl-beige",
                        )}
                        onClick={() => emblaApi?.scrollNext()}
                    >
                        <ArrowRightIcon width={32} height={32} />
                    </div>
                </div>
            </div>
        </div>
    );
};
