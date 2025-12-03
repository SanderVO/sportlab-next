import { cn } from "@/utilities/ui";
import { Slot } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    {
        defaultVariants: {
            size: "default",
            variant: "black",
        },
        variants: {
            size: {
                clear: "",
                default: "h-10 px-4 py-2",
                icon: "h-10 w-10",
                lg: "h-11 rounded px-8",
                sm: "h-9 rounded px-3",
            },
            variant: {
                beige: "w-max transition-colors rounded-3xl bg-sl-beige hover:bg-sl-beige-dark mt-8 font-bold text-center py-3 px-10 text-lg text-background",
                black: "transition-colors rounded-3xl bg-background mt-8 font-bold text-center py-3 px-10 w-max text-lg text-white md:self-center",
                orange: "transition-colors rounded-3xl bg-sl-orange hover:bg-sl-orange-dark mt-8 font-bold text-center py-3 px-10 w-max text-lg",
            },
        },
    }
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    asChild?: boolean;
    ref?: React.Ref<HTMLButtonElement>;
}

const Button: React.FC<ButtonProps> = ({
    asChild = false,
    className,
    size,
    variant,
    ref,
    ...props
}) => {
    const Comp = asChild ? Slot : "button";
    return (
        <Comp
            className={cn(buttonVariants({ className, size, variant }))}
            ref={ref}
            {...props}
        />
    );
};

export { Button, buttonVariants };
