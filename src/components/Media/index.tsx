import React, { Fragment } from "react";
import { ImageMedia } from "./ImageMedia";
import type { Props } from "./types";
import { VideoMedia } from "./VideoMedia";

export const Media: React.FC<Props> = (props) => {
    const { className, htmlElement = "div", resource } = props;

    const isVideo =
        typeof resource === "object" && resource?.mimeType?.includes("video");

    const Tag = htmlElement || Fragment;

    return (
        <Tag
            {...(htmlElement !== null
                ? {
                      className,
                  }
                : {})}
            aria-hidden={isVideo ? "true" : undefined}
        >
            {isVideo ? <VideoMedia {...props} /> : <ImageMedia {...props} />}
        </Tag>
    );
};
