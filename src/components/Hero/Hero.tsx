import { Media } from "@/components/Media";
import RichText from "@/components/RichText";
import type { Page } from "@/payload-types";
import React from "react";

export const Hero: React.FC<Page["hero"]> = (props) => {
    const { media, text } = props;

    return (
        <section className="flex flex-col sm:flex-row w-full relative h-auto xxl:h-[1080px] justify-end min-h-[calc(100svh-200px)] sm:min-h-[720px]">
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

            <div className="container mx-auto z-20 flex items-center justify-start h-full self-end">
                <div className="flex flex-col w-full self-end sm:w-[50%] sm:mb-[100px] pb-8 md:pb-0">
                    {text && (
                        <div className="font-sl-open-sans text-lg md:w-4/5">
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
