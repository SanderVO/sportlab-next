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
                    label: "Link type",
                    name: "type",
                    type: "radio",
                    admin: {
                        layout: "horizontal",
                        width: "33%",
                    },
                    defaultValue: "reference",
                    options: [
                        {
                            label: "Interne link",
                            value: "reference",
                        },
                        {
                            label: "Externe URL",
                            value: "custom",
                        },
                    ],
                },
                {
                    label: "Openen in nieuw tabblad",
                    name: "newTab",
                    type: "checkbox",
                    admin: {
                        description:
                            "Schakel in als je wilt dat de link in een nieuw tabblad wordt geopend.",
                        style: {
                            alignSelf: "flex-end",
                        },
                        width: "33%",
                    },
                },
                {
                    label: "Label toevoegen",
                    name: "addLabel",
                    type: "checkbox",
                    admin: {
                        description:
                            "Schakel in als je wilt dat er een label aan de link wordt toegevoegd.",
                        style: {
                            alignSelf: "flex-end",
                        },
                        width: "33%",
                    },
                },
            ],
        },
        {
            label: "Interne link",
            name: "reference",
            type: "relationship",
            admin: {
                description:
                    "Kies een pagina, blogpost of gebruiker om naartoe te linken.",
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
            label: "Externe URL",
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
            label: "Label",
            required: true,
        },
    ],
    ...overrides,
});
