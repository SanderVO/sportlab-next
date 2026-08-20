"use client";

import { cn } from "@/utilities/ui";
import useEmblaCarousel from "embla-carousel-react";
import React, { useEffect, useState } from "react";

type Stage = {
    id?: string | null;
    weekLabel: string;
    phaseTitle: string;
    description: string;
};

type CycleTimelineBlockProps = {
    title: string;
    subtitle?: string | null;
    stages?: Stage[] | null;
    footerText?: string | null;
};

export const CycleTimelineBlock: React.FC<CycleTimelineBlockProps> = (
    props,
) => {
    const { title, subtitle, stages, footerText } = props;
    const [activeIndex, setActiveIndex] = useState(0);
    const [isUserInteracting, setIsUserInteracting] = useState(false);
    const [isPageVisible, setIsPageVisible] = useState(true);
    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: true,
        align: "start",
        containScroll: "trimSnaps",
        active: true,
    });

    useEffect(() => {
        if (!emblaApi) return;

        const updateActiveIndex = () => {
            setActiveIndex(emblaApi.selectedScrollSnap());
        };

        updateActiveIndex();
        emblaApi.on("select", updateActiveIndex);
        emblaApi.on("reInit", updateActiveIndex);

        return () => {
            emblaApi.off("select", updateActiveIndex);
            emblaApi.off("reInit", updateActiveIndex);
        };
    }, [emblaApi]);

    useEffect(() => {
        const handleVisibilityChange = () => {
            setIsPageVisible(!document.hidden);
        };

        handleVisibilityChange();
        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            document.removeEventListener(
                "visibilitychange",
                handleVisibilityChange,
            );
        };
    }, []);

    useEffect(() => {
        if (!emblaApi) return;

        const handlePointerDown = () => {
            setIsUserInteracting(true);
        };

        const handleSettle = () => {
            setIsUserInteracting(false);
        };

        emblaApi.on("pointerDown", handlePointerDown);
        emblaApi.on("settle", handleSettle);

        return () => {
            emblaApi.off("pointerDown", handlePointerDown);
            emblaApi.off("settle", handleSettle);
        };
    }, [emblaApi]);

    useEffect(() => {
        const count = stages?.length ?? 0;

        if (count <= 1 || isUserInteracting || !isPageVisible) return;

        const intervalId = window.setInterval(() => {
            if (emblaApi) {
                emblaApi.scrollNext();
                return;
            }

            setActiveIndex((previousIndex) => (previousIndex + 1) % count);
        }, 5000);

        return () => {
            window.clearInterval(intervalId);
        };
    }, [emblaApi, isPageVisible, isUserInteracting, stages?.length]);

    useEffect(() => {
        setActiveIndex(0);
    }, [stages?.length]);

    return (
        <div className="container m-auto py-14 lg:py-20">
            <div className="w-full">
                <h2 className="font-sl-montserrat text-3xl md:text-5xl font-bold leading-tight text-inherit">
                    {title}
                </h2>

                {subtitle && (
                    <p className="mt-4 max-w-3xl text-base md:text-lg text-inherit/85">
                        {subtitle}
                    </p>
                )}

                <div className="mt-10 md:hidden">
                    <div
                        className="w-full overflow-hidden"
                        ref={emblaRef}
                        onPointerUp={() => setIsUserInteracting(false)}
                        onPointerCancel={() => setIsUserInteracting(false)}
                    >
                        <div className="flex flex-row -mx-2 items-stretch">
                            {stages?.map((stage, index) => (
                                <div
                                    key={
                                        stage.id ||
                                        `${stage.weekLabel}-${stage.phaseTitle}`
                                    }
                                    className="min-w-0 w-[88%] shrink-0 px-2"
                                >
                                    <article
                                        className={cn(
                                            "h-full rounded-sm border border-current/20 bg-current/5 p-5 transition-colors duration-500",
                                            index === activeIndex &&
                                                "border-cta/80 bg-cta/10",
                                        )}
                                    >
                                        <p className="font-sl-archivo text-xs tracking-[0.14em] uppercase text-cta">
                                            {stage.weekLabel}
                                        </p>

                                        <h3 className="mt-2 font-sl-bebas text-3xl leading-none uppercase">
                                            {stage.phaseTitle}
                                        </h3>

                                        <p className="mt-3 text-sm leading-relaxed text-inherit/85">
                                            {stage.description}
                                        </p>
                                    </article>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-5 flex items-center justify-center gap-2">
                        {stages?.map((stage, index) => (
                            <button
                                key={stage.id || `${stage.weekLabel}-${index}`}
                                type="button"
                                aria-label={`Ga naar fase ${index + 1}`}
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

                <div className="mt-10 hidden grid-cols-1 gap-5 md:grid md:grid-cols-2 xl:grid-cols-5">
                    {stages?.map((stage, index) => (
                        <article
                            key={
                                stage.id ||
                                `${stage.weekLabel}-${stage.phaseTitle}`
                            }
                            className={cn(
                                "rounded-sm border border-current/20 bg-current/5 p-5 transition-colors duration-500",
                                index === activeIndex &&
                                    "border-cta/80 bg-cta/10",
                            )}
                        >
                            <p className="font-sl-archivo text-xs tracking-[0.14em] uppercase text-cta">
                                {stage.weekLabel}
                            </p>

                            <h3 className="mt-2 font-sl-bebas text-3xl leading-none uppercase">
                                {stage.phaseTitle}
                            </h3>

                            <p className="mt-3 text-sm leading-relaxed text-inherit/85">
                                {stage.description}
                            </p>
                        </article>
                    ))}
                </div>

                {footerText && (
                    <p className="mt-8 text-sm md:text-base text-gray-400">
                        {footerText}
                    </p>
                )}
            </div>
        </div>
    );
};
