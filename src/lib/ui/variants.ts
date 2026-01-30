export const uiVariants = {
    base: [
        "inline-flex items-center justify-center",
        "rounded-md font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2",
    ].join(" "),

    variants: {
        beige: "bg-sl-beige hover:bg-sl-beige-dark text-background",
        black: "bg-background hover:bg-background/90 text-white",
        orange: "bg-sl-orange hover:bg-sl-orange-dark text-white",
        nav: "uppercase font-semibold text-neutral-400 hover:text-white justify-center !px-0",
        footer: "text-neutral-400 hover:text-white",
        inline: "underline underline-offset-2 font-semibold !p-0",
    },

    sizes: {
        sm: "h-8 px-3 text-sm",
        md: "h-10 px-4 text-base",
        lg: "h-12 px-6 text-lg",
    },
} as const;

export type Variant = keyof typeof uiVariants.variants;
export type Size = keyof typeof uiVariants.sizes;
