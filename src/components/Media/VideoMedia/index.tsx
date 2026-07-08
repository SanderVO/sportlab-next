"use client";

import customImageLoader from "@/utilities/imageLoader";
import { cn } from "@/utilities/ui";
import React, { useEffect, useRef, useState } from "react";
import type { Props as MediaProps } from "../types";

export const VideoMedia: React.FC<MediaProps> = (props) => {
    const { fill, onClick, priority, resource, videoClassName } = props;

    const videoRef = useRef<HTMLVideoElement>(null);
    const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
    const [shouldAutoplay, setShouldAutoplay] = useState(false);

    useEffect(() => {
        if (!priority || shouldLoadVideo) return;

        let timeoutId: number | undefined;
        let idleId: number | undefined;

        const loadVideo = () => setShouldLoadVideo(true);

        if (typeof window !== "undefined") {
            if ("requestIdleCallback" in window) {
                idleId = window.requestIdleCallback(loadVideo, {
                    timeout: 1800,
                });
            } else if ("setTimeout" in window) {
                timeoutId = window.setTimeout(loadVideo, 1200);
            }
        }

        return () => {
            if (typeof idleId === "number" && "cancelIdleCallback" in window) {
                window.cancelIdleCallback(idleId);
            }

            if (typeof timeoutId === "number") {
                window.clearTimeout(timeoutId);
            }
        };
    }, [priority, shouldLoadVideo]);

    useEffect(() => {
        if (shouldLoadVideo) return;

        const node = videoRef.current;

        if (!node) return;

        const observer = new IntersectionObserver(
            (entries: IntersectionObserverEntry[]) => {
                const [entry] = entries;

                if (!entry?.isIntersecting) return;

                setShouldLoadVideo(true);
                observer.disconnect();
            },
            {
                rootMargin: "300px",
            },
        );

        observer.observe(node);

        return () => {
            observer.disconnect();
        };
    }, [shouldLoadVideo]);

    useEffect(() => {
        const node = videoRef.current;

        if (!node) return;

        const observer = new IntersectionObserver((entries) => {
            const [entry] = entries;

            if (!entry) return;

            if (entry.isIntersecting) {
                setShouldLoadVideo(true);
                setShouldAutoplay(true);

                return;
            }

            setShouldAutoplay(false);
        });

        observer.observe(node);

        return () => {
            observer.disconnect();
        };
    }, []);

    useEffect(() => {
        const node = videoRef.current;

        if (!node) return;

        if (!shouldAutoplay) {
            node.pause();

            return;
        }

        const playPromise = node.play();

        if (playPromise && typeof playPromise.catch === "function") {
            playPromise.catch(() => {});
        }
    }, [shouldAutoplay, shouldLoadVideo]);

    if (resource && typeof resource === "object") {
        const { url, poster, thumbnailURL, width, height } = resource;

        let videoPoster: string | undefined;

        if (typeof poster === "object" && poster?.url) {
            videoPoster = customImageLoader({
                src: poster.url!,
                width: 1080,
                quality: 85,
            });
        } else if (thumbnailURL) {
            videoPoster = encodeURI(thumbnailURL);
        }

        return (
            <>
                {priority && videoPoster && videoPoster !== "" && (
                    <link
                        rel="preload"
                        as="image"
                        href={videoPoster}
                        fetchPriority="high"
                    />
                )}

                {url && (
                    <video
                        className={cn(
                            fill ? "absolute inset-0 h-full w-full" : "",
                            videoClassName,
                        )}
                        controls={false}
                        loop
                        muted
                        onClick={onClick}
                        playsInline
                        preload="none"
                        ref={videoRef}
                        poster={videoPoster}
                        width={!fill ? width || undefined : undefined}
                        height={!fill ? height || undefined : undefined}
                        style={
                            !fill && width && height
                                ? {
                                      aspectRatio: `${width} / ${height}`,
                                  }
                                : undefined
                        }
                        aria-hidden={videoPoster ? "true" : undefined}
                    >
                        {shouldLoadVideo && (
                            <source src={url} type="video/mp4" />
                        )}
                    </video>
                )}
            </>
        );
    }

    return null;
};
