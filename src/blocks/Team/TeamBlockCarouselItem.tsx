"use client";

import { Media } from "@/components/Media";
import { Button } from "@/components/ui/Button";
import { User } from "@/payload-types";
import { cn } from "@/utilities/ui";
import { useState } from "react";

export const TeamBlockCarouselItem = ({
    index,
    type,
    backgroundColor,
    user,
}: {
    index: number;
    type: "carousel" | "grid";
    backgroundColor: string;
    user: User;
}) => {
    const [showInfo, setShowInfo] = useState(false);

    if (!user) {
        return null;
    }

    return (
        <div
            key={index}
            className={cn(
                type === "carousel" &&
                    "flex flex-row items-center text h-full shrink-0 w-[300px] sm:w-[370px] px-2",
            )}
        >
            <div className="h-full flex flex-col gap-2 w-full">
                <div
                    className="flex h-[440px] w-full max-w-[400px] relative overflow-hidden cursor-pointer"
                    onClick={() => setShowInfo(!showInfo)}
                >
                    <Media
                        size="(max-width: 768px) 300px, 400px"
                        resource={user.avatar}
                        htmlElement={null}
                        pictureClassName="h-full relative"
                        imgClassName={cn(
                            "object-cover object-top h-full aspect-1/2 transform-gpu transition-transform duration-300",
                            showInfo && "scale-125",
                        )}
                        imgWidth={400}
                        imgHeight={440}
                    />

                    {showInfo && (
                        <div className="absolute top-0 p-4 bg-black/65 text-white text-sm h-full w-full flex flex-col gap-4 justify-end">
                            <div className="italic">{user.about}</div>

                            <Button
                                variant="orange"
                                size="sm"
                                url={`/team/${user.slug}`}
                                className="p-4"
                            >
                                Lees meer
                            </Button>
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-1">
                    <div
                        className={cn(
                            "text-xl",
                            backgroundColor === "backgroundLight" &&
                                "text-background",
                            backgroundColor === "backgroundDark" &&
                                "text-white",
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
        </div>
    );
};
