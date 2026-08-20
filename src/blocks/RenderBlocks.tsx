import { CarouselBlock } from "@/blocks/Carousel/CarouselBlock";
import { ContentBlock } from "@/blocks/Content/ContentBlock";
import { CycleTimelineBlock } from "@/blocks/CycleTimeline/CycleTimelineBlock";
import { FormBlock } from "@/blocks/Form/FormBlock";
import { InstagramBlock } from "@/blocks/Instagram/InstagramBlock";
import { MediaCarouselBlock } from "@/blocks/MediaCarousel/MediaCarouselBlock";
import { TeamBlock } from "@/blocks/Team/TeamBlock";
import type { Page } from "@/payload-types";
import { cn } from "@/utilities/ui";
import React, { Fragment } from "react";
import { ColumnsBlock } from "./Columns/config";

const blockComponents = {
    content: ContentBlock,
    carousel: CarouselBlock,
    team: TeamBlock,
    instagram: InstagramBlock,
    cycleTimeline: CycleTimelineBlock,
    form: FormBlock,
    columns: ColumnsBlock,
    mediaCarousel: MediaCarouselBlock,
};

export const RenderBlocks: React.FC<{
    blocks: Page["layout"][0][];
}> = (props) => {
    const { blocks } = props;

    const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0;

    if (hasBlocks) {
        return (
            <Fragment>
                {blocks.map((block, index) => {
                    const { blockType, backgroundColor } = block;
                    const autoHeightBlockSlugs = ["carousel", "mediaCarousel"];
                    const isAutoHeightBlock = autoHeightBlockSlugs.includes(
                        String(blockType),
                    );

                    if (blockType && blockType in blockComponents) {
                        const Block = blockComponents[blockType];

                        if (Block) {
                            return (
                                <section
                                    className={cn(
                                        "flex items-center w-full relative h-auto flex-row lg:py-12",
                                        backgroundColor === "backgroundDark" &&
                                            "bg-background text-sand",
                                        backgroundColor === "backgroundLight" &&
                                            "bg-sand text-background",
                                        backgroundColor === "backgroundWhite" &&
                                            "bg-white text-background",
                                        isAutoHeightBlock && "min-h-auto",
                                        !isAutoHeightBlock &&
                                            "sm:min-h-180 xxl:min-h-[1080px]",
                                    )}
                                    key={index}
                                >
                                    {/* @ts-expect-error there may be some mismatch between the expected types here */}
                                    <Block {...block} disableInnerContainer />
                                </section>
                            );
                        }
                    }
                    return null;
                })}
            </Fragment>
        );
    }

    return null;
};
