import { type ButtonProps } from "@/components/ui/button";
import type { Page, Post } from "@/payload-types";
import { cn } from "@/utilities/ui";
import Link from "next/link";
import React from "react";

const DefaultAppearanceClass =
    "block transition-colors rounded-3xl font-bold text-center py-3 px-10 w-max text-lg self-baseline no-underline";

export const CMSLinkAppearance = {
    beige:
        DefaultAppearanceClass +
        " bg-sl-beige hover:bg-sl-beige-dark text-background",
    black:
        DefaultAppearanceClass +
        " bg-background hover:bg-background/90 text-white",
    orange:
        DefaultAppearanceClass +
        " bg-sl-orange hover:bg-sl-orange-dark text-white",
};

export type CMSLinkType = {
    appearance?: keyof typeof CMSLinkAppearance | null;
    children?: React.ReactNode;
    className?: string;
    label?: string | null;
    newTab?: boolean | null;
    reference?: {
        relationTo: "pages" | "posts";
        value: Page | Post | string | number;
    } | null;
    size?: ButtonProps["size"] | null;
    type?: "custom" | "reference" | null;
    url?: string | null;
};

export const CMSLink: React.FC<CMSLinkType> = (props) => {
    const {
        type,
        children,
        label,
        newTab,
        reference,
        url,
        className,
        appearance,
    } = props;

    const href =
        type === "reference" &&
        typeof reference?.value === "object" &&
        reference.value.slug
            ? `${
                  reference?.relationTo !== "pages"
                      ? `/${reference?.relationTo}`
                      : ""
              }/${reference.value.slug}`
            : url;

    if (!href) return null;

    const newTabProps = newTab
        ? { rel: "noopener noreferrer", target: "_blank" }
        : {};

    return (
        <Link
            className={cn(
                appearance ? CMSLinkAppearance[appearance] : undefined,
                className
            )}
            href={href || url || ""}
            {...newTabProps}
        >
            {label && !children && label}
            {children && children}
        </Link>
    );
};
