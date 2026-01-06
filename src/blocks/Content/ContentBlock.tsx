import { Media } from "@/components/Media";
import RichText from "@/components/RichText";
import type { ContentBlock as ContentBlockProps } from "@/payload-types";
import { cn } from "@/utilities/ui";
import React from "react";
import { CMSLink } from "../../components/Link";

export const ContentBlock: React.FC<ContentBlockProps> = (props) => {
    const { columns } = props;

    return (
        <div
            className={cn(
                "container m-auto flex py-15 md:py-0 h-full",
                columns && columns.length > 1
                    ? "flex-col md:flex-row gap-10 md:gap-50 justify-between"
                    : "justify-between static!"
            )}
        >
            {columns &&
                columns.length > 0 &&
                columns.map((col, index) => {
                    const {
                        enableLink,
                        link,
                        richText,
                        title,
                        media,
                        contentPosition,
                        imageSize,
                    } = col;

                    return (
                        <div
                            key={index}
                            className={cn(
                                "flex w-full h-full justify-between self-center"
                            )}
                        >
                            {media && contentPosition === "contentRight" && (
                                <div
                                    className={cn(
                                        imageSize === "imageTopCut" &&
                                            "absolute left-0 bottom-0 w-1/3 hidden md:block h-9/10",
                                        imageSize === "imageFull" &&
                                            "absolute left-0 bottom-0 w-1/3 hidden md:block h-full",
                                        imageSize === "imageCenter" &&
                                            "h-[200px] md:h-auto md:min-h-[600px] w-full md:w-[400px] relative shrink-0 hidden md:block"
                                    )}
                                >
                                    <Media
                                        resource={media}
                                        fill
                                        imgClassName={cn(
                                            "object-cover object-center"
                                        )}
                                    />
                                </div>
                            )}

                            <div
                                className={cn(
                                    "flex flex-col gap-4 md:gap-0 w-full relative self-center",
                                    columns.length == 1 && "md:w-1/2",
                                    contentPosition === "contentRight" &&
                                        "md:pl-[40%]"
                                )}
                                key={col.id || index}
                            >
                                {media &&
                                    contentPosition === "contentBottom" && (
                                        <Media
                                            resource={media}
                                            fill
                                            className="h-[175px] w-full relative mb-4"
                                            imgClassName="object-cover object-center"
                                        />
                                    )}

                                {title && (
                                    <h2 className="text-5xl md:text-6xl font-sl-bebas">
                                        {title}
                                    </h2>
                                )}

                                {richText && (
                                    <RichText
                                        data={richText}
                                        enableGutter={false}
                                        enableProse={false}
                                    />
                                )}

                                {enableLink && <CMSLink {...link} />}
                            </div>

                            {media && contentPosition === "contentLeft" && (
                                <div
                                    className={cn(
                                        imageSize === "imageTopCut" &&
                                            "absolute right-0 bottom-0 w-1/3 hidden md:block h-9/10",
                                        imageSize === "imageFull" &&
                                            "absolute right-0 bottom-0 w-1/3 hidden md:block h-full",
                                        imageSize === "imageCenter" &&
                                            "h-[200px] md:h-auto md:min-h-[600px] w-full md:w-[400px] relative shrink-0 hidden md:block"
                                    )}
                                >
                                    <Media
                                        resource={media}
                                        fill
                                        imgClassName={cn(
                                            "object-cover object-center"
                                        )}
                                    />
                                </div>
                            )}
                        </div>
                    );
                })}
        </div>
    );
};
