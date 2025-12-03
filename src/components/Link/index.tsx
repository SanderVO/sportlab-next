import { type ButtonProps } from "@/components/ui/button";
import type { Page, Post } from "@/payload-types";
import Link from "next/link";
import React from "react";

export const CMSLinkAppearance = {
    beige: "transition-colors rounded-3xl bg-sl-beige hover:bg-sl-beige-dark mt-8 font-bold text-center py-3 px-10 w-max text-lg text-background self-baseline",
    black: "transition-colors rounded-3xl bg-background hover:bg-background/90 mt-8 font-bold text-center py-3 px-10 w-max text-lg text-white self-baseline",
    orange: "transition-colors rounded-3xl bg-sl-orange hover:bg-sl-orange-dark mt-8 font-bold text-center py-3 px-10 w-max text-lg text-white self-baseline",
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
            className={
                className
                    ? className
                    : appearance
                    ? CMSLinkAppearance[appearance]
                    : ""
            }
            href={href || url || ""}
            {...newTabProps}
        >
            {label && !children && label}
            {children && children}
        </Link>
    );
};
