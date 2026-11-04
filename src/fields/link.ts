import type { GroupField } from "payload";

export const link = (overrides?: Partial<GroupField>): GroupField => ({
    name: "link",
    type: "group",
    admin: {
        hideGutter: true,
    },
    fields: [
        {
            type: "row",
            fields: [
                {
                    label: { en: "Link type", nl: "Link type" },
                    name: "type",
                    type: "radio",
                    admin: {
                        layout: "horizontal",
                        width: "33%",
                    },
                    defaultValue: "reference",
                    options: [
                        {
                            label: { en: "Internal link", nl: "Interne link" },
                            value: "reference",
                        },
                        {
                            label: { en: "External URL", nl: "Externe URL" },
                            value: "custom",
                        },
                    ],
                },
                {
                    label: { en: "Open in new tab", nl: "Openen in nieuw tabblad" },
                    name: "newTab",
                    type: "checkbox",
                    admin: {
                        description:
                            { en: "Enable if you want the link to open in a new tab.", nl: "Schakel in als je wilt dat de link in een nieuw tabblad wordt geopend." },
                        style: {
                            alignSelf: "flex-end",
                        },
                        width: "33%",
                    },
                },
                {
                    label: { en: "Add label", nl: "Label toevoegen" },
                    name: "addLabel",
                    type: "checkbox",
                    admin: {
                        description:
                            { en: "Enable if you want a label to be added to the link.", nl: "Schakel in als je wilt dat er een label aan de link wordt toegevoegd." },
                        style: {
                            alignSelf: "flex-end",
                        },
                        width: "33%",
                    },
                },
            ],
        },
        {
            label: { en: "Internal link", nl: "Interne link" },
            name: "reference",
            type: "relationship",
            admin: {
                description:
                    { en: "Choose a page, blog post or user to link to.", nl: "Kies een pagina, blogpost of gebruiker om naartoe te linken." },
                condition: (_, siblingData) =>
                    siblingData?.type === "reference",
            },
            relationTo: ["pages", "posts", "users"],
            filterOptions: ({ relationTo }) => {
                if (relationTo === "users") {
                    return {
                        slug: {
                            exists: true,
                        },
                    };
                }
                return true;
            },
            required: true,
        },
        {
            label: { en: "External URL", nl: "Externe URL" },
            name: "url",
            type: "text",
            admin: {
                condition: (_, siblingData) => siblingData?.type === "custom",
            },
            required: true,
        },
        {
            name: "label",
            type: "text",
            admin: {
                condition: (_, siblingData) => siblingData?.addLabel === true,
            },
            label: { en: "Label", nl: "Label" },
            required: true,
        },
        {
            label: { en: "Label color", nl: "Label kleur" },
            name: "labelColor",
            type: "select",
            defaultValue: "default",
            admin: {
                condition: (_, siblingData) => siblingData?.addLabel === true,
            },
            options: [
                { label: { en: "Default", nl: "Standaard" }, value: "default" },
                { label: { en: "Beige", nl: "Beige" }, value: "beige" },
                { label: { en: "Orange", nl: "Oranje" }, value: "orange" },
                { label: { en: "Gray", nl: "Grijs" }, value: "neutral" },
                { label: { en: "White", nl: "Wit" }, value: "white" },
            ],
        },
    ],
    ...overrides,
});
