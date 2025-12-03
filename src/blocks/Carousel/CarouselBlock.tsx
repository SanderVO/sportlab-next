import type { CarouselBlock as CarouselBlockProps } from "@/payload-types";
import React from "react";
import { CarouselBlockClient } from "./CarouselBlockClient";

export const CarouselBlock: React.FC<CarouselBlockProps> = (props) => {
    const { title, subtitle } = props;

    return (
        <div className="container mx-auto flex flex-col h-full justify-center py-15 md:py-0">
            <div className="flex flex-col">
                <div className="text-gray-400">{subtitle}</div>

                <h2 className="text-5xl md:text-7xl font-sl-bebas text-background mt-2">
                    {title}
                </h2>

                <div className="border-b-4 border-background w-[100px]"></div>
            </div>

            <div className="mt-10">
                <CarouselBlockClient {...props} />
            </div>
        </div>
    );
};
