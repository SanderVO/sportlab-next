export const uiVariants = {
    base: [
        "inline-flex items-center justify-center",
        "rounded-md font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2",
        "disabled:opacity-50 disabled:pointer-events-none",
        "transition-colors cursor-pointer font-sl-poppins",
    ].join(" "),

    variants: {
        beige: "bg-sand hover:bg-sand/90 text-ink",
        beigeBorder:
            "border border-sand bg-transparent text-sand hover:bg-sand hover:text-background",
        black: "bg-charcoal hover:bg-charcoal/90 text-warm-white",
        blackBorder:
            "border border-charcoal bg-transparent text-charcoal hover:bg-charcoal hover:text-warm-white",
        orange: "bg-cta hover:bg-cta-dark text-warm-white",
        orangeBorder:
            "border border-cta bg-transparent text-cta hover:bg-cta hover:text-warm-white",
        nav: "transition-colors uppercase font-semibold text-warm-white hover:text-warm-white/90 justify-center !px-0",
        footer: "text-neutral-400 hover:text-white",
        inline: "underline underline-offset-2 font-semibold !p-0",
        service: "font-semibold !h-auto",
    },

    sizes: {
        sm: "h-8 px-3 text-sm",
        md: "h-10 px-4 text-base",
        lg: "h-12 px-6 text-lg",
    },
} as const;

export type Variant = keyof typeof uiVariants.variants;
export type Size = keyof typeof uiVariants.sizes;
