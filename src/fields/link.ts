import deepMerge from "@/utilities/deepMerge";
import type { Field, GroupField } from "payload";

export type LinkAppearances = "black" | "beige" | "orange";

export const appearanceOptions: Record<
    LinkAppearances,
    { label: string; value: string }
> = {
    black: {
        label: "Zwart",
        value: "black",
    },
    beige: {
        label: "Beige",
        value: "beige",
    },
    orange: {
        label: "Oranje",
        value: "orange",
    },
};

type LinkType = (options?: {
    appearances?: LinkAppearances[] | false;
    disableLabel?: boolean;
    overrides?: Partial<GroupField>;
}) => Field;

export const link: LinkType = ({
    appearances,
    disableLabel = false,
    overrides = {},
} = {}) => {
    const linkResult: GroupField = {
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
                            width: "50%",
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
                            width: "50%",
                        },
                    },
                ],
            },
        ],
    };

    const linkTypes: Field[] = [
        {
            label: "Interne link",
            name: "reference",
            type: "relationship",
            admin: {
                description:
                    "Kies een pagina of blogpost om naartoe te linken.",
                condition: (_, siblingData) =>
                    siblingData?.type === "reference",
            },
            relationTo: ["pages", "posts"],
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
    ];

    if (!disableLabel) {
        linkTypes.map((linkType) => ({
            ...linkType,
            admin: {
                ...linkType.admin,
                width: "50%",
            },
        }));

        linkResult.fields.push({
            type: "row",
            fields: [
                ...linkTypes,
                {
                    name: "label",
                    type: "text",
                    admin: {
                        width: "50%",
                    },
                    label: "Label",
                    required: true,
                },
            ],
        });
    } else {
        linkResult.fields = [...linkResult.fields, ...linkTypes];
    }

    if (appearances !== false) {
        let appearanceOptionsToUse = [
            appearanceOptions.black,
            appearanceOptions.beige,
            appearanceOptions.orange,
        ];

        if (appearances) {
            appearanceOptionsToUse = appearances.map(
                (appearance) => appearanceOptions[appearance],
            );
        }

        linkResult.fields.push({
            label: "Type",
            name: "appearance",
            type: "select",
            admin: {
                description: "Kies hoe de link eruitziet.",
            },
            defaultValue: "black",
            options: appearanceOptionsToUse,
        });
    }

    return deepMerge(linkResult, overrides);
};
