"use client";

import { Media } from "@/components/Media";
import RichText from "@/components/RichText";
import { CMSLink } from "@/components/ui/Link";
import type { ServiceCardBlock as ServiceCardBlockProps } from "@/payload-types";
import { cn } from "@/utilities/ui";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import React from "react";

export const ServiceCardBlock: React.FC<ServiceCardBlockProps> = (props) => {
    const { columns, arrowBackgroundColor } = props;

    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: true,
        align: "start",
        containScroll: "trimSnaps",
        active: true,
    });

    return (
        <>
            <div className="w-full overflow-hidden" ref={emblaRef}>
                <div className="flex flex-row items-stretch gap-4 sm:gap-8">
                    {columns?.map((column, index) => (
                        <div
                            key={index}
                            className={cn(
                                "flex flex-col w-64 shrink-0 self-stretch sm:w-96 last:mr-4 sm:last:mr-8",
                                column.backgroundColor === "black" &&
                                    "bg-background",
                                column.backgroundColor === "beige" &&
                                    "bg-sl-beige",
                                column.backgroundColor === "white" &&
                                    "bg-white",
                            )}
                        >
                            <div className="w-full h-64 relative">
                                <Media
                                    fill
                                    resource={column.image}
                                    imgClassName="object-cover object-center w-full"
                                />
                            </div>

                            <div className="w-full min-h-96 flex-1 container py-4 flex flex-col justify-between">
                                <RichText
                                    data={column.content}
                                    enableProse={false}
                                    enableGutter={false}
                                />

                                <div
                                    className={cn(
                                        "flex flex-row items-center",
                                        column.priceAlignment === "center" &&
                                            "justify-center",
                                        column.priceAlignment === "right" &&
                                            "justify-end",
                                    )}
                                >
                                    <div
                                        className={cn(
                                            "flex flex-col",
                                            column.priceAlignment ===
                                                "center" && "items-center",
                                            column.priceAlignment === "right" &&
                                                "items-end",
                                        )}
                                    >
                                        <div className="text-gray-800 text-xs font-normal italic">
                                            {column.priceType}
                                        </div>

                                        <div className="text-black text-xl font-bold">
                                            € {column.price}
                                        </div>
                                    </div>

                                    <CMSLink
                                        {...column.link}
                                        variant="service"
                                        className={cn(
                                            column.priceAlignment === "left" &&
                                                "ml-auto",
                                            column.priceAlignment ===
                                                "center" && "ml-4",
                                        )}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex flex-row gap-6 items-center justify-end mt-4">
                <div
                    className={cn(
                        "flex justify-center items-center w-14 h-14 rounded-full cursor-pointer",
                        arrowBackgroundColor === "black" &&
                            "bg-background text-sl-beige",
                        arrowBackgroundColor === "beige" &&
                            "bg-sl-beige text-background",
                        arrowBackgroundColor === "white" &&
                            "bg-white text-background",
                    )}
                    onClick={() => emblaApi?.scrollPrev()}
                >
                    <ArrowLeftIcon width={32} height={32} />
                </div>

                <div
                    className={cn(
                        "flex justify-center items-center w-14 h-14 rounded-full cursor-pointer",
                        arrowBackgroundColor === "black" &&
                            "bg-background text-sl-beige",
                        arrowBackgroundColor === "beige" &&
                            "bg-sl-beige text-background",
                        arrowBackgroundColor === "white" &&
                            "bg-white text-background",
                    )}
                    onClick={() => emblaApi?.scrollNext()}
                >
                    <ArrowRightIcon width={32} height={32} />
                </div>
            </div>
        </>
    );
};
