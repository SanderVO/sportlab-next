"use client";

import customImageLoader from "@/utilities/imageLoader";
import Image, { ImageProps } from "next/image";

interface CustomImageProps extends Omit<ImageProps, "loader"> {
    fit?: "fill" | "contain" | "cover" | "none" | "scale-down";
    customHeight?: number;
}

export default function OptimizedImage({
    fit,
    customHeight,
    ...props
}: CustomImageProps) {
    const { src } = props;

    return (
        <>
            {src && (
                <Image
                    {...props}
                    alt={props.alt || "Optimized Image"}
                    loader={(args) =>
                        customImageLoader({
                            ...args,
                            fit,
                            height: customHeight,
                        })
                    }
                />
            )}
        </>
    );
}
