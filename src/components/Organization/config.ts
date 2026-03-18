import type { GlobalConfig } from "payload";
import { revalidateOrganization } from "./hooks/revalidateOrganization";

export const Organization: GlobalConfig = {
    slug: "organization",
    label: "Organisatie",
    access: {
        read: () => true,
    },
    fields: [
        {
            label: "Naam",
            name: "name",
            type: "text",
            required: true,
        },
        {
            label: "URL",
            name: "url",
            type: "text",
            required: true,
        },
        {
            label: "Logo",
            name: "logo",
            type: "upload",
            relationTo: "media",
            filterOptions: {
                mimeType: { contains: "image" },
            },
        },
        {
            label: "E-mailadres",
            name: "email",
            type: "email",
        },
        {
            label: "Omschrijving",
            name: "description",
            type: "textarea",
        },
        {
            label: "Contactpersoon",
            name: "contactPoint",
            type: "group",
            fields: [
                {
                    label: "Telefoonnummer",
                    name: "telephone",
                    type: "text",
                    admin: {
                        description:
                            "Internationaal formaat, bijvoorbeeld: +31612345678",
                    },
                },
                {
                    label: "Type contact",
                    name: "contactType",
                    type: "text",
                },
            ],
        },
        {
            label: "Adres",
            name: "address",
            type: "group",
            fields: [
                {
                    label: "Straat + huisnummer",
                    name: "streetAddress",
                    type: "text",
                },
                {
                    label: "Stad",
                    name: "addressLocality",
                    type: "text",
                },
                {
                    label: "Postcode",
                    name: "postalCode",
                    type: "text",
                },
                {
                    label: "Landcode",
                    name: "addressCountry",
                    type: "text",
                    defaultValue: "NL",
                    admin: {
                        description: "ISO 3166-1 alpha-2, bijv. NL",
                    },
                },
            ],
        },
        {
            label: "Coördinaten",
            name: "geo",
            type: "group",
            fields: [
                {
                    label: "Breedtegraad (latitude)",
                    name: "latitude",
                    type: "number",
                    admin: {
                        description: "Bijvoorbeeld: 52.3676",
                    },
                },
                {
                    label: "Lengtegraad (longitude)",
                    name: "longitude",
                    type: "number",
                    admin: {
                        description: "Bijvoorbeeld: 4.9041",
                    },
                },
            ],
        },
        {
            label: "Social media",
            name: "sameAs",
            type: "array",
            labels: {
                singular: "Social media profiel",
                plural: "Social media profielen",
            },
            fields: [
                {
                    label: "URL",
                    name: "url",
                    type: "text",
                    required: true,
                },
            ],
            admin: {
                description:
                    "Voeg links toe naar social media profielen (Facebook, Instagram, LinkedIn, etc.)",
            },
        },
    ],
    hooks: {
        afterChange: [revalidateOrganization],
    },
};
