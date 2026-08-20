"use client";

import { Media } from "@/components/Media";
import type { Media as MediaType } from "@/payload-types";
import { cn } from "@/utilities/ui";
import useEmblaCarousel from "embla-carousel-react";
import React, { useEffect, useState } from "react";

type GalleryImage = {
    id?: string | null;
    media?: number | MediaType | null;
    caption?: string | null;
};

type MediaCarouselBlockProps = {
    title: string;
    mainMedia?: number | MediaType | null;
    galleryImages?: GalleryImage[] | null;
    quote?: {
        text?: string | null;
        author?: string | null;
    } | null;
};

export const MediaCarouselBlock: React.FC<MediaCarouselBlockProps> = (
    props,
) => {
    const { title, mainMedia, galleryImages, quote } = props;
    const [activeIndex, setActiveIndex] = useState(0);
    const [activeModalImage, setActiveModalImage] = useState<
        number | MediaType | null
    >(null);
    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: true,
        align: "start",
        containScroll: "trimSnaps",
    });

    useEffect(() => {
        if (!emblaApi) return;

        const updateActiveIndex = () => {
            setActiveIndex(emblaApi.selectedScrollSnap());
        };

        updateActiveIndex();
        emblaApi.on("reInit", updateActiveIndex);
        emblaApi.on("select", updateActiveIndex);

        return () => {
            emblaApi.off("reInit", updateActiveIndex);
            emblaApi.off("select", updateActiveIndex);
        };
    }, [emblaApi]);

    useEffect(() => {
        if (!activeModalImage) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setActiveModalImage(null);
            }
        };

        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.body.style.overflow = originalOverflow;
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [activeModalImage]);

    return (
        <div className="container m-auto py-14 lg:py-20">
            <div className="w-full">
                <h2 className="font-sl-montserrat text-3xl md:text-5xl font-bold leading-tight text-inherit">
                    {title}
                </h2>

                {mainMedia && (
                    <div className="mt-8 rounded-sm border border-current/20 bg-current/5 p-2 md:p-3">
                        <Media
                            resource={mainMedia}
                            htmlElement={null}
                            pictureClassName="relative aspect-[16/9] w-full overflow-hidden rounded-sm"
                            imgClassName="h-full w-full object-cover"
                            videoClassName="h-full w-full object-cover"
                            imgWidth={1600}
                            imgHeight={900}
                        />
                    </div>
                )}

                {galleryImages && galleryImages.length > 0 && (
                    <div className="mt-6 md:mt-8">
                        <div className="overflow-hidden" ref={emblaRef}>
                            <div className="-ml-4 flex">
                                {galleryImages.map((item, index) => (
                                    <div
                                        key={
                                            item.id || `gallery-image-${index}`
                                        }
                                        className="min-w-0 shrink-0 basis-[80%] pl-4 sm:basis-[45%] lg:basis-1/4"
                                    >
                                        <figure className="h-full rounded-sm border border-current/15 bg-current/5 p-2">
                                            {item.media && (
                                                <button
                                                    type="button"
                                                    className="block w-full cursor-zoom-in"
                                                    aria-label={`Open afbeelding ${index + 1} in groot formaat`}
                                                    onClick={() =>
                                                        setActiveModalImage(
                                                            item.media ?? null,
                                                        )
                                                    }
                                                >
                                                    <Media
                                                        resource={item.media}
                                                        htmlElement={null}
                                                        pictureClassName="relative aspect-[4/3] w-full overflow-hidden rounded-sm"
                                                        imgClassName="h-full w-full object-cover"
                                                        imgWidth={640}
                                                        imgHeight={480}
                                                    />
                                                </button>
                                            )}

                                            {item.caption && (
                                                <figcaption className="mt-2 text-sm text-inherit/75">
                                                    {item.caption}
                                                </figcaption>
                                            )}
                                        </figure>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mt-5 flex items-center justify-center gap-2 md:hidden">
                            {galleryImages.map((item, index) => (
                                <button
                                    key={item.id || `gallery-dot-${index}`}
                                    type="button"
                                    aria-label={`Ga naar afbeelding ${index + 1}`}
                                    aria-current={index === activeIndex}
                                    className={cn(
                                        "h-2 rounded-full transition-all duration-300",
                                        index === activeIndex
                                            ? "w-8 bg-cta"
                                            : "w-2 bg-current/30",
                                    )}
                                    onClick={() => emblaApi?.scrollTo(index)}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {quote?.text && (
                    <figure className="mt-8 md:mt-10 text-center">
                        <blockquote className="font-sl-montserrat text-xl md:text-3xl font-semibold leading-tight text-inherit">
                            {`\"${quote.text}\"`}
                        </blockquote>

                        {quote.author && (
                            <figcaption className="mt-3 text-sm md:text-base text-inherit/70">
                                {`- ${quote.author}`}
                            </figcaption>
                        )}
                    </figure>
                )}

                {activeModalImage && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-background/85 p-4 md:p-8"
                        role="dialog"
                        aria-modal="true"
                        aria-label="Vergrote afbeelding"
                        onClick={() => setActiveModalImage(null)}
                    >
                        <div
                            className="relative w-full max-w-6xl"
                            onClick={(event) => event.stopPropagation()}
                        >
                            <button
                                type="button"
                                className={cn(
                                    "absolute right-3 top-3 z-10 rounded-full bg-background/80 px-3 py-1 text-sm font-semibold text-warm-white transition-colors hover:bg-background",
                                )}
                                aria-label="Sluit afbeelding"
                                onClick={() => setActiveModalImage(null)}
                            >
                                Sluiten
                            </button>

                            <Media
                                resource={activeModalImage}
                                htmlElement={null}
                                pictureClassName="relative max-h-[85vh] w-full overflow-hidden rounded-sm"
                                imgClassName="max-h-[85vh] w-full bg-background object-contain"
                                imgWidth={2000}
                                imgHeight={1333}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
