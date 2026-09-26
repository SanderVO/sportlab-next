"use client";

import { cssVariables } from "@/cssVariables";
import OptimizedImage from "@/images/OptimizedImage";
import { cn } from "@/utilities/ui";
import type { StaticImageData } from "next/image";
import React from "react";
import type { Props as MediaProps } from "../types";

const { breakpoints } = cssVariables;

const placeholderBlur =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8'%3E%3Crect width='8' height='8' fill='%23f6f2ea'/%3E%3C/svg%3E";

export const ImageMedia: React.FC<MediaProps> = (props) => {
    const {
        alt: altFromProps,
        fill,
        pictureClassName,
        imgClassName,
        priority,
        resource,
        size: sizeFromProps,
        src: srcFromProps,
        loading: loadingFromProps,
        imgWidth: widthFromProps,
        imgHeight: heightFromProps,
    } = props;

    let width: number | undefined = widthFromProps;
    let height: number | undefined = heightFromProps;
    let src: StaticImageData | string = srcFromProps?.src || "";
    let alt = altFromProps;
    let optimizedClassName = imgClassName;

    if (resource && typeof resource === "object") {
        const {
            alt: altFromResource,
            height: fullHeight,
            width: fullWidth,
            objectPositionDesktop,
            objectPositionMobile,
        } = resource;

        width = widthFromProps || fullWidth || undefined;
        height = heightFromProps || fullHeight || undefined;
        alt = altFromProps || altFromResource || "";

        optimizedClassName = cn(
            imgClassName,
            objectPositionDesktop ? `lg:object-${objectPositionDesktop}` : "",
            objectPositionMobile ? `object-${objectPositionMobile}` : "",
        );

        src = resource?.url || srcFromProps?.src || "";
    } else if (typeof resource === "string") {
        src = resource;
    }

    src = encodeURI(src);

    const loading = loadingFromProps || (!priority ? "lazy" : undefined);

    const sizes = sizeFromProps
        ? sizeFromProps
        : Object.entries(breakpoints)
              .map(([, value]) => `(max-width: ${value}px) ${value * 2}w`)
              .join(", ");

    return (
        <picture className={cn(pictureClassName)}>
            <OptimizedImage
                alt={alt || ""}
                className={optimizedClassName}
                fill={fill}
                height={!fill ? height : undefined}
                placeholder={priority ? "empty" : "blur"}
                blurDataURL={priority ? undefined : placeholderBlur}
                priority={priority}
                fetchPriority={priority ? "high" : "auto"}
                quality={85}
                loading={loading}
                sizes={sizes}
                src={src}
                width={!fill ? width : undefined}
            />
        </picture>
    );
};
