import { Media } from "@/components/Media";
import RichText from "@/components/RichText";
import type { ContentBlock as ContentBlockProps } from "@/payload-types";
import { cn } from "@/utilities/ui";
import React from "react";

export const ContentBlock: React.FC<ContentBlockProps> = (props) => {
    const { columns } = props;

    return (
        <div
            className={cn(
                "container m-auto flex py-15 sm:py-0 h-full",
                columns && columns.length > 1
                    ? "flex-col sm:flex-row gap-10 sm:gap-50 justify-between"
                    : "justify-between static!",
            )}
        >
            {columns &&
                columns.length > 0 &&
                columns.map((col, index) => {
                    const { richText, media, contentPosition, imageSize } = col;

                    return (
                        <div
                            key={index}
                            className={cn(
                                "flex h-full justify-between self-center",
                                columns.length > 1 && "w-full",
                                columns.length === 1 && "w-full",
                            )}
                        >
                            {media && contentPosition === "contentRight" && (
                                <div
                                    className={cn(
                                        imageSize === "imageTopCut" &&
                                            "absolute left-0 bottom-0 w-1/3 hidden sm:block h-9/10",
                                        imageSize === "imageFull" &&
                                            "absolute left-0 bottom-0 w-1/3 hidden sm:block h-full",
                                        imageSize === "imageCenter" &&
                                            "h-[300px] sm:h-auto sm:min-h-[600px] w-full sm:w-[400px] relative shrink-0 hidden sm:block",
                                    )}
                                >
                                    <Media
                                        resource={media}
                                        fill
                                        imgClassName={cn(
                                            "object-cover object-center",
                                        )}
                                    />
                                </div>
                            )}

                            <div
                                className={cn(
                                    "flex flex-col gap-4 sm:gap-0 w-full relative self-center",
                                    columns.length == 1 && "sm:w-full",
                                    contentPosition === "contentLeft" &&
                                        "sm:max-w-[60%]",
                                    contentPosition === "contentRight" &&
                                        "sm:pl-[40%]",
                                )}
                                key={col.id || index}
                            >
                                {media && (
                                    <Media
                                        resource={media}
                                        fill
                                        htmlElement={null}
                                        pictureClassName={cn(
                                            "h-[300px] sm:h-[200px] w-full relative mb-4",
                                            contentPosition !==
                                                "contentBottom" && "sm:hidden",
                                        )}
                                        imgClassName={cn(
                                            "object-cover",
                                            contentPosition !==
                                                "contentBottom" && "object-top",
                                            contentPosition ===
                                                "contentBottom" &&
                                                "object-center",
                                        )}
                                    />
                                )}

                                {richText && (
                                    <RichText
                                        data={richText}
                                        enableGutter={false}
                                        enableProse={false}
                                    />
                                )}
                            </div>

                            {media && contentPosition === "contentLeft" && (
                                <div
                                    className={cn(
                                        imageSize === "imageTopCut" &&
                                            "absolute right-0 bottom-0 w-1/3 hidden sm:block h-9/10",
                                        imageSize === "imageFull" &&
                                            "absolute right-0 bottom-0 w-1/3 hidden sm:block h-full",
                                        imageSize === "imageCenter" &&
                                            "h-[300px] sm:h-auto sm:min-h-[600px] w-full sm:w-[400px] relative shrink-0 hidden sm:block",
                                    )}
                                >
                                    <Media
                                        resource={media}
                                        fill
                                        imgClassName={cn(
                                            "object-cover object-center",
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
