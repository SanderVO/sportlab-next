"use client";

import type { User } from "@/payload-types";
import { cn } from "@/utilities/ui";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { TeamBlockCarouselItem } from "./TeamBlockCarouselItem";

interface Props {
    type: string;
    backgroundColor: string;
    users: User[];
}

export const TeamBlockCarousel: React.FC<Props> = ({
    type,
    backgroundColor,
    users,
}: Props) => {
    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: true,
        align: "start",
        containScroll: "trimSnaps",
        active: type === "carousel",
    });

    const [showInfo, setShowInfo] = useState<{ [key: number]: boolean }>({});
    const [isTouch, setIsTouch] = useState(false);

    const showForIndex = (index: number) => setShowInfo({ [index]: true });
    const hideInfo = () => setShowInfo({});
    const toggleForIndex = (index: number) =>
        setShowInfo((prev) => ({ [index]: !prev[index] }));

    useEffect(() => {
        if (!isTouch) return;

        const handleClickOutside = () => setShowInfo({});
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, [isTouch]);

    useEffect(() => {
        setIsTouch(window.matchMedia("(hover: none)").matches);
    }, []);

    const teamItemContent = () => (
        <>
            {users &&
                users.map((user: User, index: number) => (
                    <div
                        key={index}
                        className={cn(
                            type === "carousel" &&
                                "flex flex-row items-center text h-full shrink-0 w-[300px] sm:w-[370px] last:mr-4 md:last:mr-6",
                        )}
                    >
                        <TeamBlockCarouselItem
                            showInfo={showInfo[index]}
                            onShow={
                                isTouch
                                    ? () => toggleForIndex(index)
                                    : () => showForIndex(index)
                            }
                            onHide={isTouch ? () => {} : hideInfo}
                            isTouch={isTouch}
                            backgroundColor={backgroundColor}
                            user={user}
                        />
                    </div>
                ))}
        </>
    );

    return (
        <>
            {type === "carousel" && (
                <div className="flex flex-col gap-6 w-full">
                    <div
                        className="w-full overflow-hidden h-full"
                        ref={emblaRef}
                    >
                        <div className="flex flex-row h-full gap-4 md:gap-6">
                            {teamItemContent()}
                        </div>
                    </div>

                    <div className="hidden md:flex flex-row gap-6 items-center justify-center">
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
            )}

            {type === "grid" && (
                <div className="w-full overflow-hidden h-full">
                    <div className="h-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
                        {teamItemContent()}
                    </div>
                </div>
            )}
        </>
    );
};
