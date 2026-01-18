import { Media } from "@/components/Media";
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
    const [isHover, setIsHover] = useState(false);

    if (!user) {
        return null;
    }

    return (
        <div
            key={index}
            className={cn(
                type === "carousel" &&
                    "flex flex-row items-center text h-full shrink-0 w-[66.6667%] md:w-[25%] px-2",
            )}
        >
            <div
                className={cn(
                    "h-full flex flex-col gap-2 w-full",
                    type === "grid" && "h-[400px]",
                )}
            >
                <div
                    className="h-full w-full relative overflow-hidden cursor-pointer"
                    onMouseEnter={() => setIsHover(true)}
                    onMouseLeave={() => setIsHover(false)}
                    onTouchStart={() => setIsHover(true)}
                    onTouchEnd={() => setIsHover(false)}
                >
                    <Media
                        fill
                        resource={user.avatar}
                        htmlElement={null}
                        imgClassName="object-cover object-top"
                    />

                    {isHover && (
                        <div className="absolute top-0 py-2 px-4 bg-black/65 text-white text-sm h-full w-full flex items-center justify-center italic">
                            &ldquo;{user.about}&rdquo;
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
