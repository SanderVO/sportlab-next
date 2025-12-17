import { CMSLink } from "@/components/Link";
import { Media } from "@/components/Media";
import RichText from "@/components/RichText";
import type { Page } from "@/payload-types";
import { cn } from "@/utilities/ui";
import React from "react";

export const Hero: React.FC<Page["hero"]> = (props) => {
    const { color, link, type, backgroundColor, media } = props;

    return (
        <section
            className={cn(
                "flex flex-col sm:flex-row w-full relative h-auto xxl:h-[1080px]",
                backgroundColor === "beige" && "bg-sl-beige",
                backgroundColor === "white" && "bg-white",
                backgroundColor === "black" && "bg-background",
                type === "background" && "justify-end min-h-[720px]",
                type === "left" && "sm:h-[720px] sm:min-h-[720px]"
            )}
        >
            {type === "background" && (
                <>
                    <Media
                        fill
                        resource={media}
                        imgClassName="absolute object-cover"
                        priority={true}
                    />

                    <div className="absolute inset-0 bg-black/50 z-10" />
                </>
            )}

            {type === "left" && (
                <div className="relative h-[200px] md:h-full md:basis-2/5 shrink-0 md:mb-0">
                    <Media
                        fill
                        resource={media}
                        imgClassName="absolute object-cover h-full"
                        priority={true}
                    />
                </div>
            )}

            <div
                className={cn(
                    "container mx-auto z-20 flex items-center justify-start h-full",
                    color === "beige" && "text-sl-beige",
                    color === "white" && "text-white",
                    color === "black" && "text-background",
                    type === "background" && "self-end"
                )}
            >
                <div
                    className={cn(
                        "flex flex-col w-full",
                        type === "background" &&
                            "self-end sm:w-[50%] sm:mb-[100px] pb-8 md:pb-0",
                        type === "left" && "my-10 sm:ml-6 sm:my-0"
                    )}
                >
                    <h1 className="font-sl-bebas text-5xl md:text-7xl">
                        {props.title}
                    </h1>

                    {props.text && (
                        <div className="font-sl-open-sans text-lg md:w-4/5">
                            <RichText
                                data={props.text}
                                enableGutter={false}
                                enableProse={false}
                            />
                        </div>
                    )}

                    {link && <CMSLink {...link} />}
                </div>
            </div>
        </section>
    );
};
