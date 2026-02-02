"use client";

import { Media } from "@/components/Media";
import { Button } from "@/components/ui/Button";
import { User } from "@/payload-types";
import { cn } from "@/utilities/ui";

export const TeamBlockCarouselItem = ({
    index,
    backgroundColor,
    user,
    showInfo,
    setShowInfo,
}: {
    index: number;
    backgroundColor: string;
    user: User;
    showInfo: boolean;
    setShowInfo: (index: number) => void;
}) => {
    if (!user) {
        return null;
    }

    return (
        <div className="h-full flex flex-col gap-2 w-full">
            <div
                className="flex h-[440px] md:h-[600px] w-full max-w-[400px] relative overflow-hidden cursor-pointer"
                onClick={() => setShowInfo(index)}
            >
                <Media
                    size="(max-width: 768px) 300px, 450px"
                    resource={user.avatar}
                    htmlElement={null}
                    pictureClassName="h-full relative"
                    imgClassName={cn(
                        "object-cover object-top h-full aspect-1/2 transform-gpu transition-transform duration-300 hover:scale-105",
                        showInfo && "scale-125",
                    )}
                    imgWidth={400}
                    imgHeight={440}
                />

                {showInfo && (
                    <div className="absolute top-0 p-4 bg-black/65 text-white text-sm h-full w-full flex flex-col gap-4 justify-end">
                        <div className="italic max-h-[50%] overflow-hidden">
                            {user.about}
                        </div>

                        {user.slug && (
                            <Button
                                variant="orange"
                                size="sm"
                                url={`/team/${user.slug}`}
                                className="px-4 py-8"
                            >
                                Lees meer
                            </Button>
                        )}
                    </div>
                )}
            </div>

            <div className="flex flex-col gap-1">
                <div
                    className={cn(
                        "text-xl",
                        backgroundColor === "backgroundLight" &&
                            "text-background",
                        backgroundColor === "backgroundDark" && "text-white",
                        backgroundColor === "backgroundWhite" &&
                            "text-background",
                    )}
                >
                    {user.name}
                </div>

                {user.subtitle && (
                    <div
                        className={cn(
                            "text-sm",
                            backgroundColor === "backgroundLight" &&
                                "text-background/70",
                            backgroundColor === "backgroundDark" &&
                                "text-white/70",
                            backgroundColor === "backgroundWhite" &&
                                "text-background/70",
                        )}
                    >
                        {user.subtitle}
                    </div>
                )}
            </div>
        </div>
    );
};
