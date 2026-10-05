"use client";

import customImageLoader from "@/utilities/imageLoader";
import { cn } from "@/utilities/ui";
import React, { useEffect, useRef, useState } from "react";
import { ImageMedia } from "../ImageMedia";
import type { Props as MediaProps } from "../types";

export const VideoMedia: React.FC<MediaProps> = (props) => {
    const { fill, onClick, priority, resource, videoClassName } = props;

    const videoRef = useRef<HTMLVideoElement>(null);
    const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
    const [shouldAutoplay, setShouldAutoplay] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);

    // Priority videos defer their source until the page (including the LCP
    // poster image) has loaded, so the MP4 never competes with it.
    useEffect(() => {
        if (!priority || shouldLoadVideo) return;

        let timeoutId: number | undefined;
        let idleId: number | undefined;

        const loadVideo = () => setShouldLoadVideo(true);

        const schedule = () => {
            if (typeof window.requestIdleCallback === "function") {
                idleId = window.requestIdleCallback(loadVideo, {
                    timeout: 1800,
                });
            } else {
                timeoutId = window.setTimeout(loadVideo, 1200);
            }
        };

        if (document.readyState === "complete") {
            schedule();
        } else {
            window.addEventListener("load", schedule, { once: true });
        }

        return () => {
            window.removeEventListener("load", schedule);

            if (
                typeof idleId === "number" &&
                typeof window.cancelIdleCallback === "function"
            ) {
                window.cancelIdleCallback(idleId);
            }

            if (typeof timeoutId === "number") {
                window.clearTimeout(timeoutId);
            }
        };
    }, [priority, shouldLoadVideo]);

    useEffect(() => {
        if (priority || shouldLoadVideo) return;

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
    }, [priority, shouldLoadVideo]);

    useEffect(() => {
        const node = videoRef.current;

        if (!node) return;

        const observer = new IntersectionObserver((entries) => {
            const [entry] = entries;

            if (!entry) return;

            if (entry.isIntersecting) {
                if (!priority) setShouldLoadVideo(true);
                setShouldAutoplay(true);

                return;
            }

            setShouldAutoplay(false);
        });

        observer.observe(node);

        return () => {
            observer.disconnect();
        };
    }, [priority]);

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
                quality: 75,
            });
        } else if (thumbnailURL) {
            videoPoster = encodeURI(thumbnailURL);
        }

        // Render the poster as a real <img> for priority videos so it is a
        // proper LCP candidate (fetchpriority=high, responsive srcset).
        const posterResource =
            typeof poster === "object" && poster?.url ? poster : thumbnailURL;
        const showPosterImage = !!priority && !!posterResource;

        return (
            <>
                {showPosterImage && (
                    <ImageMedia
                        fill
                        priority
                        resource={posterResource}
                        pictureClassName="absolute inset-0 h-full w-full overflow-hidden"
                        imgClassName="object-cover"
                        size="100vw"
                    />
                )}

                {url && (
                    <video
                        className={cn(
                            fill ? "absolute inset-0 h-full w-full" : "",
                            videoClassName,
                            showPosterImage &&
                                "transition-opacity duration-500",
                            showPosterImage && !isPlaying && "opacity-0",
                        )}
                        onPlaying={() => setIsPlaying(true)}
                        controls={false}
                        loop
                        muted
                        onClick={onClick}
                        playsInline
                        preload="none"
                        ref={videoRef}
                        poster={showPosterImage ? undefined : videoPoster}
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
