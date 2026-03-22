import { Size, Variant } from "@/lib/ui/variants";
import { Page, Post, User } from "@/payload-types";
import { Button } from "./Button";

const labelColorClasses: Record<string, string> = {
    beige: "text-sl-beige",
    orange: "text-sl-orange",
    neutral: "text-neutral-400",
    white: "text-white",
};

export type LinkProps = {
    children?: React.ReactNode;
    className?: string;
    label?: string | null;
    labelColor?: string | null;
    newTab?: boolean | null;
    reference?: {
        relationTo: "pages" | "posts" | "users";
        value: Page | Post | User | string | number;
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
        labelColor,
        className,
        children,
    } = props;

    const rawHref =
        type === "reference" &&
        typeof reference?.value === "object" &&
        reference.value.slug
            ? `${
                  reference?.relationTo !== "pages"
                      ? `/${reference?.relationTo === "users" ? "team" : reference?.relationTo}`
                      : ""
              }/${reference.value.slug}`
            : url;

    // Ensure custom URLs always have a protocol so Next.js doesn't treat
    // them as relative paths (e.g. "example.com" → "https://example.com").
    const href =
        type === "custom" &&
        rawHref &&
        !/^[a-zA-Z][a-zA-Z0-9+\-.]*:/.test(rawHref) &&
        !rawHref.startsWith("/")
            ? `https://${rawHref}`
            : rawHref;

    const labelNode =
        label && !children ? (
            labelColor &&
            labelColor !== "default" &&
            labelColorClasses[labelColor] ? (
                <span className={labelColorClasses[labelColor]}>{label}</span>
            ) : (
                label
            )
        ) : null;

    return (
        <Button
            url={href}
            newTab={newTab}
            variant={variant as Variant}
            size={size as Size}
            classes={className}
        >
            {labelNode}
            {children}
        </Button>
    );
};
