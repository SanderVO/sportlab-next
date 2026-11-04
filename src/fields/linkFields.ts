import type { SelectField } from "payload";

export const variantField = (
    variants: { label: string; value: string }[],
): SelectField => ({
    label: { en: "Variant", nl: "Variant" },
    name: "variant",
    type: "select",
    defaultValue: "orange",
    options: variants,
});

export const sizeField = (
    sizes: { label: string; value: string }[],
): SelectField => ({
    label: { en: "Size", nl: "Grootte" },
    name: "size",
    type: "select",
    defaultValue: "md",
    options: sizes,
});

export const buttonSpacingField = (
    spacingOptions: { label: string; value: string }[],
): SelectField => ({
    label: { en: "Button spacing", nl: "Knop marge" },
    name: "buttonSpacing",
    type: "select",
    defaultValue: "md",
    options: spacingOptions,
    admin: {
        condition: (_data, siblingData) => siblingData?.variant !== "inline",
    },
});

export const alignmentField = (): SelectField => ({
    label: { en: "Alignment", nl: "Uitlijning" },
    name: "alignment",
    type: "select",
    defaultValue: "left",
    options: [
        { label: { en: "Left", nl: "Links" }, value: "left" },
        { label: { en: "Centered", nl: "Gecentreerd" }, value: "center" },
    ],
    admin: {
        condition: (_data, siblingData) => siblingData?.variant !== "inline",
    },
});
