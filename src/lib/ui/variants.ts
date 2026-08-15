export const uiVariants = {
    base: [
        "inline-flex items-center justify-center",
        "rounded-full font-semibold transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta/60 focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal",
        "disabled:opacity-50 disabled:pointer-events-none",
        "cursor-pointer select-none whitespace-nowrap font-sl-poppins",
    ].join(" "),

    variants: {
        beige: "bg-sand text-ink hover:bg-[#d8cfbb]",
        beigeBorder:
            "border border-sand bg-transparent text-sand hover:bg-sand hover:text-charcoal",
        black: "bg-charcoal text-warm-white hover:bg-[#1a1713]",
        blackBorder:
            "border border-charcoal bg-transparent text-charcoal hover:bg-charcoal hover:text-warm-white",
        orange: "bg-cta text-warm-white hover:bg-cta-dark",
        orangeBorder:
            "border border-cta bg-transparent text-cta hover:bg-cta hover:text-ink",
        nav: "justify-center !px-0 uppercase tracking-[0.12em] text-warm-white hover:text-sand",
        footer: "text-sand/70 hover:text-warm-white",
        inline: "!p-0 font-semibold underline underline-offset-4 decoration-[1.5px]",
        service: "!h-auto font-semibold leading-normal",
    },

    sizes: {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-5 text-base",
        lg: "h-12 px-6 text-lg",
    },
} as const;

export type Variant = keyof typeof uiVariants.variants;
export type Size = keyof typeof uiVariants.sizes;
