"use client";

import { cn } from "@/utilities/ui";
import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";

const labelVariants = cva(
    "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
);

export interface LabelProps
    extends
        React.LabelHTMLAttributes<HTMLLabelElement>,
        VariantProps<typeof labelVariants> {
    ref?: React.Ref<HTMLLabelElement>;
}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
    ({ className, ...props }, ref) => (
        <label
            className={cn(labelVariants(), className)}
            ref={ref}
            {...props}
        />
    ),
);

Label.displayName = "Label";
