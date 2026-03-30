import { Media } from "@/components/Media";
import RichText from "@/components/RichText";
import type { Page } from "@/payload-types";
import React from "react";

export const Hero: React.FC<Page["hero"]> = (props) => {
    const { media, text, contentPosition } = props;
    const isCentered = contentPosition === "center";

    return (
        <section className="flex flex-col lg:flex-row w-full relative h-auto justify-end min-h-[calc(100svh-150px)]">
            <Media
                fill
                resource={media}
                htmlElement={null}
                pictureClassName="absolute w-full h-full overflow-hidden"
                imgClassName="object-cover"
                videoClassName="absolute object-cover h-full w-full"
                priority={true}
            />

            <div className="absolute inset-0 bg-black/65 z-10" />

            <div
                className={`container mx-auto z-20 flex items-center h-full self-end overflow-hidden pt-24 ${
                    isCentered ? "justify-center" : "justify-start"
                }`}
            >
                <div
                    className={`flex flex-col w-full lg:w-[50%] ${
                        isCentered
                            ? "items-center text-center lg:my-auto"
                            : "items-start text-left lg:mb-25 self-end pb-8 lg:pb-0"
                    }`}
                >
                    {text && (
                        <div className="font-sl-open-sans text-lg lg:w-4/5">
                            <RichText
                                data={text}
                                enableGutter={false}
                                enableProse={false}
                            />
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};
