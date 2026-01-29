import { Size, uiVariants, Variant } from "@/lib/ui/variants";
import { cn } from "@/utilities/ui";
import Link from "next/link";

export type ButtonProps = {
    url?: string | null;
    newTab?: boolean | null;
    variant?: Variant;
    size?: Size;
    classes?: string;
    children?: React.ReactNode;
};

export const Button: React.FC<
    ButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>
> = (props) => {
    const {
        url,
        newTab,
        variant = "inline",
        size = "md",
        classes,
        children,
    } = props;

    if (!url) {
        return (
            <button
                {...props}
                className={cn(
                    uiVariants.base,
                    uiVariants.variants[variant],
                    uiVariants.sizes[size],
                    classes,
                )}
            >
                {children}
            </button>
        );
    }

    const newTabProps = newTab
        ? { rel: "noopener noreferrer", target: "_blank" }
        : {};

    return (
        <Link
            className={cn(
                !["inline", "nav", "footer"].includes(variant) &&
                    uiVariants.base,
                uiVariants.variants[variant],
                uiVariants.sizes[size],
                classes,
            )}
            href={url}
            {...newTabProps}
        >
            {children}
        </Link>
    );
};
