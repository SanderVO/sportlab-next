import { cn } from "@/utilities/ui";
import * as React from "react";

const Textarea: React.FC<
    {
        ref?: React.Ref<HTMLTextAreaElement>;
    } & React.TextareaHTMLAttributes<HTMLTextAreaElement>
> = ({ className, ref, ...props }) => {
    return (
        <textarea
            className={cn(
                "flex min-h-20 w-full rounded border border-s-gray-300 bg-white px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
                className
            )}
            ref={ref}
            {...props}
        />
    );
};

export { Textarea };
