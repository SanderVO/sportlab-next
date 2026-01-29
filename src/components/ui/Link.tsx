import { Size, Variant } from "@/lib/ui/variants";
import { Page, Post } from "@/payload-types";
import { Button } from "./Button";

export type LinkProps = {
    children?: React.ReactNode;
    className?: string;
    label?: string | null;
    newTab?: boolean | null;
    reference?: {
        relationTo: "pages" | "posts";
        value: Page | Post | string | number;
    } | null;
    type?: "custom" | "reference" | null | undefined;
    url?: string | null;
    size?: Size | null;
    variant?: Variant | null;
};

export const CMSLink: React.FC<LinkProps> = (props) => {
    const {
        reference,
        type,
        newTab,
        url,
        variant,
        size,
        label,
        className,
        children,
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

    return (
        <Button
            url={href}
            newTab={newTab}
            variant={variant as Variant}
            size={size as Size}
            classes={className}
        >
            {label && !children && label}
            {children && children}
        </Button>
    );
};
