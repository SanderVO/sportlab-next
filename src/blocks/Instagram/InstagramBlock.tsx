import RichText from "@/components/RichText";
import type { InstagramBlock as InstagramBlockProps } from "@/payload-types";
import React from "react";
import { InstagramBlockCarousel } from "./InstagramBlockCarousel";

export const InstagramBlock: React.FC<InstagramBlockProps> = (props) => {
    const { title, content } = props;

    return (
        <div className="container mx-auto flex flex-col h-full justify-center py-8 md:py-0 gap-6">
            <div className="flex flex-row h-auto">
                <InstagramBlockCarousel {...props} />
            </div>

            <div className="flex flex-col">
                <div className="border-b-4 border-background w-[100px]"></div>

                <h2 className="text-4xl md:text-7xl font-sl-bebas text-background mt-2">
                    {title}
                </h2>

                <div className="text-sm md:text-md">
                    <RichText
                        data={content}
                        enableProse={false}
                        enableGutter={false}
                    />
                </div>
            </div>
        </div>
    );
};
