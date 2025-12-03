"use client";

import { Media } from "@/components/Media";
import type { TeamBlock as TeamBlockProps, TeamMember } from "@/payload-types";
import { cn } from "@/utilities/ui";
import { useIsMobile } from "@/utilities/useIsMobile";
import useEmblaCarousel from "embla-carousel-react";

export const TeamBlockCarousel: React.FC<TeamBlockProps> = (props) => {
    const { teamItems, backgroundColor, type } = props;

    const isMobile = useIsMobile();

    const [emblaRef] = useEmblaCarousel({
        loop: true,
        align: "start",
        containScroll: "trimSnaps",
        active: isMobile && type === "carousel",
    });

    const teamItemContent = () => (
        <>
            {teamItems &&
                teamItems.map((teamItem, index: number) => {
                    const teamMember = teamItem?.teamMember as TeamMember;

                    if (!teamMember) {
                        return null;
                    }

                    return (
                        <div
                            key={index}
                            className={cn(
                                type === "carousel" &&
                                    "flex flex-row items-center text h-full shrink-0 w-[66.6667%] md:w-[30%] px-2"
                            )}
                        >
                            <div
                                className={cn(
                                    "h-full flex flex-col gap-2 w-full",
                                    type === "grid" && "h-[400px]"
                                )}
                            >
                                <div className="h-full w-full relative">
                                    <Media
                                        fill
                                        resource={teamMember?.media}
                                        imgClassName="object-cover object-top rounded-3xl"
                                    />
                                </div>

                                <div
                                    className={cn(
                                        "text-xs",
                                        backgroundColor === "backgroundLight" &&
                                            "text-background",
                                        backgroundColor === "backgroundDark" &&
                                            "text-white",
                                        backgroundColor === "backgroundWhite" &&
                                            "text-background"
                                    )}
                                >
                                    {teamMember?.name}
                                </div>
                            </div>
                        </div>
                    );
                })}
        </>
    );

    return (
        <>
            {type === "carousel" && (
                <div className="w-full overflow-hidden h-full" ref={emblaRef}>
                    <div className="flex flex-row h-full gap-0 md:gap-8 -mx-2">
                        {teamItemContent()}
                    </div>
                </div>
            )}

            {type === "grid" && (
                <div className="w-full overflow-hidden h-full">
                    <div className="h-full grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-8">
                        {teamItemContent()}
                    </div>
                </div>
            )}
        </>
    );
};
