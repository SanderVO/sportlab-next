"use client";

import { CMSLink } from "@/components/Link";
import { Media } from "@/components/Media";
import type { InstagramBlock as InstagramBlockProps } from "@/payload-types";
import useEmblaCarousel from "embla-carousel-react";
import React from "react";

export const InstagramBlockCarousel: React.FC<InstagramBlockProps> = ({
    images,
}) => {
    const [emblaRef] = useEmblaCarousel({
        loop: true,
        align: "start",
        containScroll: "trimSnaps",
        active: true,
    });

    return (
        <>
            <div className="w-full h-full overflow-hidden" ref={emblaRef}>
                <div className="flex flex-row h-full gap-0 md:gap-8 -mx-4">
                    {images?.map((image, index) => (
                        <div
                            key={index}
                            className="flex flex-row items-center text h-full shrink-0 w-[66.6667%] md:w-[25%] px-2"
                        >
                            <div className="h-full flex flex-col w-full relative">
                                {image.enableLink && (
                                    <CMSLink
                                        {...image.link}
                                        className="h-[400px]"
                                    >
                                        <Media
                                            fill
                                            imgClassName="object-cover object-top"
                                            resource={image.media}
                                        />
                                    </CMSLink>
                                )}

                                {!image.enableLink && (
                                    <div className="h-[400px]">
                                        <Media
                                            fill
                                            imgClassName="object-cover object-top"
                                            resource={image.media}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};
