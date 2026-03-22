import type { SelectField } from "payload";

export const variantField = (
    variants: { label: string; value: string }[],
): SelectField => ({
    label: "Variant",
    name: "variant",
    type: "select",
    defaultValue: "orange",
    options: variants,
});

export const sizeField = (
    sizes: { label: string; value: string }[],
): SelectField => ({
    label: "Grootte",
    name: "size",
    type: "select",
    defaultValue: "md",
    options: sizes,
});

export const buttonSpacingField = (
    spacingOptions: { label: string; value: string }[],
): SelectField => ({
    label: "Knop marge",
    name: "buttonSpacing",
    type: "select",
    defaultValue: "md",
    options: spacingOptions,
    admin: {
        condition: (_data, siblingData) => siblingData?.variant !== "inline",
    },
});
