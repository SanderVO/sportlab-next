import { CMSLink } from "@/components/Link";
import { Media } from "@/components/Media";
import RichText from "@/components/RichText";
import type { Page } from "@/payload-types";
import { cn } from "@/utilities/ui";
import React from "react";

export const Hero: React.FC<Page["hero"]> = (props) => {
    const { color, link, media } = props;

    return (
        <section
            className={cn(
                "flex flex-col sm:flex-row w-full relative h-auto xxl:h-[1080px] justify-end min-h-[calc(100svh-250px)] sm:min-h-[720px]"
            )}
        >
            <Media
                fill
                resource={media}
                imgClassName="absolute object-cover"
                videoClassName="absolute object-cover h-full w-full"
                priority={true}
            />

            <div className="absolute inset-0 bg-black/70 z-10" />

            <div
                className={cn(
                    "container mx-auto z-20 flex items-center justify-start h-full self-end",
                    color === "beige" && "text-sl-beige",
                    color === "white" && "text-white",
                    color === "black" && "text-background"
                )}
            >
                <div
                    className={cn(
                        "flex flex-col w-full self-end sm:w-[50%] sm:mb-[100px] pb-8 md:pb-0"
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
