"use client";

import { Media } from "@/components/Media";
import type { InstagramBlock as InstagramBlockProps } from "@/payload-types";
import useEmblaCarousel from "embla-carousel-react";
import Link from "next/link";
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
                                {image.enableLink && image.link?.url && (
                                    <Link
                                        href={image.link.url}
                                        target="_blank"
                                        rel="noopener noreferrer nofollow"
                                    >
                                        <Media
                                            size="(max-width: 768px) 250px, 350px"
                                            htmlElement={null}
                                            pictureClassName="h-[400px] w-[300px] block"
                                            imgClassName="object-cover object-top h-full w-full"
                                            resource={image.media}
                                            imgHeight={400}
                                            imgWidth={300}
                                        />
                                    </Link>
                                )}

                                {!image.enableLink && (
                                    <Media
                                        size="(max-width: 768px) 300px, 400px"
                                        htmlElement={null}
                                        pictureClassName="h-[400px]"
                                        imgClassName="object-cover object-top h-full"
                                        resource={image.media}
                                        imgHeight={400}
                                        imgWidth={300}
                                    />
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};
