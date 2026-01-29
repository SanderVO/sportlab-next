"use client";

import customImageLoader from "@/utilities/imageLoader";
import { cn } from "@/utilities/ui";
import React, { useRef } from "react";
import type { Props as MediaProps } from "../types";

export const VideoMedia: React.FC<MediaProps> = (props) => {
    const { onClick, resource, videoClassName } = props;

    const videoRef = useRef<HTMLVideoElement>(null);

    if (resource && typeof resource === "object") {
        const { url, poster } = resource;

        let videoPoster;

        if (typeof poster === "object" && poster?.url) {
            videoPoster = customImageLoader({
                src: poster.url!,
                width: 1080,
                quality: 85,
            });
        }

        return (
            <>
                {videoPoster && videoPoster !== "" && (
                    <link
                        rel="preload"
                        as="image"
                        href={videoPoster}
                        fetchPriority="high"
                    />
                )}

                {url && (
                    <video
                        autoPlay
                        className={cn(videoClassName)}
                        controls={false}
                        loop
                        muted
                        onClick={onClick}
                        playsInline
                        ref={videoRef}
                        poster={videoPoster}
                        aria-hidden={videoPoster ? "true" : undefined}
                    >
                        <source src={url} />
                    </video>
                )}
            </>
        );
    }

    return null;
};
