"use client";

import { Media } from "@/components/Media";
import type { InstagramBlock as InstagramBlockProps } from "@/payload-types";
import { EmblaViewportRefType } from "embla-carousel-react";
import Link from "next/link";
import React from "react";

export const InstagramBlockCarousel: React.FC<
    InstagramBlockProps & { emblaRef: EmblaViewportRefType }
> = ({ images, emblaRef }) => {
    const mediaItemContent = (
        image: NonNullable<InstagramBlockProps["images"]>[number],
    ) => (
        <Media
            size="(max-width: 768px) 300px, 350px"
            fill
            htmlElement={null}
            pictureClassName="h-[400px] w-[300px] md:h-[450px] md:w-[350px] block"
            imgClassName="object-cover object-top h-full w-full"
            resource={image.media}
        />
    );

    return (
        <>
            <div className="w-full h-full overflow-hidden" ref={emblaRef}>
                <div className="flex flex-row h-full gap-4 md:gap-6">
                    {images?.map((image, index) => (
                        <div
                            key={index}
                            className="flex flex-row items-center text h-full shrink-0 last:mr-4 md:last:mr-6"
                        >
                            <div className="h-full flex flex-col w-full relative">
                                {image.enableLink && image.link?.url && (
                                    <Link
                                        href={image.link.url}
                                        target="_blank"
                                        rel="noopener noreferrer nofollow"
                                    >
                                        mediaItemContent(image)
                                    </Link>
                                )}

                                {!image.enableLink && mediaItemContent(image)}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};
