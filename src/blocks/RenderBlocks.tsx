import { CarouselBlock } from "@/blocks/Carousel/CarouselBlock";
import { ContentBlock } from "@/blocks/Content/ContentBlock";
import { FormBlock } from "@/blocks/Form/FormBlock";
import { InstagramBlock } from "@/blocks/Instagram/InstagramBlock";
import { TeamBlock } from "@/blocks/Team/TeamBlock";
import type { Page } from "@/payload-types";
import { cn } from "@/utilities/ui";
import React, { Fragment } from "react";
import { CallToActionBlock } from "./CallToAction/config";
import { ColumnsBlock } from "./Columns/config";

const blockComponents = {
    content: ContentBlock,
    carousel: CarouselBlock,
    team: TeamBlock,
    instagram: InstagramBlock,
    form: FormBlock,
    callToAction: CallToActionBlock,
    columns: ColumnsBlock,
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

                    if (blockType && blockType in blockComponents) {
                        const Block = blockComponents[blockType];

                        if (Block) {
                            return (
                                <section
                                    className={cn(
                                        "flex items-center w-full relative h-auto sm:min-h-[720px] xxl:min-h-[1080px] flex-row md:py-12",
                                        backgroundColor === "backgroundDark" &&
                                            "bg-background text-sl-beige",
                                        backgroundColor === "backgroundLight" &&
                                            "bg-sl-beige text-background",
                                        backgroundColor === "backgroundWhite" &&
                                            "bg-white text-background"
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
