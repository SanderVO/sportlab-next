"use client";

import { CMSLink } from "@/components/Link";
import { Media } from "@/components/Media";
import RichText from "@/components/RichText";
import type { ServiceCardBlock as ServiceCardBlockProps } from "@/payload-types";
import { cn } from "@/utilities/ui";
import useEmblaCarousel from "embla-carousel-react";
import React from "react";

export const ServiceCardBlock: React.FC<ServiceCardBlockProps> = (props) => {
    const { columns } = props;

    const [emblaRef] = useEmblaCarousel({
        loop: true,
        align: "start",
        containScroll: "trimSnaps",
        active: true,
    });

    return (
        <>
            <div className="w-full h-full overflow-hidden" ref={emblaRef}>
                <div className="flex flex-row h-full gap-4 sm:gap-8">
                    {columns?.map((column, index) => (
                        <div
                            key={index}
                            className={cn(
                                "flex flex-col w-64 h-full shrink-0 sm:w-96",
                                column.backgroundColor === "black" &&
                                    "bg-background",
                                column.backgroundColor === "beige" &&
                                    "bg-sl-beige",
                                column.backgroundColor === "white" && "bg-white"
                            )}
                        >
                            <div className="w-full h-64 relative">
                                <Media
                                    fill
                                    resource={column.image}
                                    imgClassName="object-cover object-center w-full"
                                />
                            </div>

                            <div className="w-full h-96 container py-4 flex flex-col justify-between">
                                <RichText
                                    data={column.content}
                                    enableProse={false}
                                    enableGutter={false}
                                />

                                <div className="flex flex-row items-center">
                                    <div className="flex flex-col">
                                        <div className="text-gray-800 text-xs font-normal italic">
                                            {column.priceType}
                                        </div>

                                        <div className="text-black text-xl font-bold">
                                            € {column.price}
                                        </div>
                                    </div>

                                    <CMSLink
                                        {...column.link}
                                        className="ml-auto"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};
