"use client";

import type { User } from "@/payload-types";
import useEmblaCarousel from "embla-carousel-react";
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
    const [emblaRef] = useEmblaCarousel({
        loop: true,
        align: "start",
        containScroll: "trimSnaps",
        active: type === "carousel",
    });

    const teamItemContent = () => (
        <>
            {users &&
                users.map((user: User, index: number) => (
                    <TeamBlockCarouselItem
                        key={index}
                        index={index}
                        type={type === "carousel" ? "carousel" : "grid"}
                        backgroundColor={backgroundColor}
                        user={user}
                    />
                ))}
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
                    <div className="h-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
                        {teamItemContent()}
                    </div>
                </div>
            )}
        </>
    );
};
