import type { GlobalConfig } from "payload";
import { revalidateOrganization } from "./hooks/revalidateOrganization";

export const Organization: GlobalConfig = {
    slug: "organization",
    label: { en: "Organization", nl: "Organisatie" },
    access: {
        read: () => true,
    },
    fields: [
        {
            label: { en: "Name", nl: "Naam" },
            name: "name",
            type: "text",
            required: true,
        },
        {
            label: { en: "URL", nl: "URL" },
            name: "url",
            type: "text",
            required: true,
        },
        {
            label: { en: "Logo", nl: "Logo" },
            name: "logo",
            type: "upload",
            relationTo: "media",
            filterOptions: {
                mimeType: { contains: "image" },
            },
        },
        {
            label: { en: "Email address", nl: "E-mailadres" },
            name: "email",
            type: "email",
        },
        {
            label: { en: "Description", nl: "Omschrijving" },
            name: "description",
            type: "textarea",
        },
        {
            label: { en: "Contact person", nl: "Contactpersoon" },
            name: "contactPoint",
            type: "group",
            fields: [
                {
                    label: { en: "Phone number", nl: "Telefoonnummer" },
                    name: "telephone",
                    type: "text",
                    admin: {
                        description: {
                            en: "International format, for example: +31612345678",
                            nl: "Internationaal formaat, bijvoorbeeld: +31612345678",
                        },
                    },
                },
                {
                    label: { en: "Contact type", nl: "Type contact" },
                    name: "contactType",
                    type: "text",
                },
            ],
        },
        {
            label: { en: "Address", nl: "Adres" },
            name: "address",
            type: "group",
            fields: [
                {
                    label: {
                        en: "Street + house number",
                        nl: "Straat + huisnummer",
                    },
                    name: "streetAddress",
                    type: "text",
                },
                {
                    label: { en: "City", nl: "Stad" },
                    name: "addressLocality",
                    type: "text",
                },
                {
                    label: { en: "Postal code", nl: "Postcode" },
                    name: "postalCode",
                    type: "text",
                },
                {
                    label: { en: "Country code", nl: "Landcode" },
                    name: "addressCountry",
                    type: "text",
                    defaultValue: "NL",
                    admin: {
                        description: {
                            en: "ISO 3166-1 alpha-2, e.g. NL",
                            nl: "ISO 3166-1 alpha-2, bijv. NL",
                        },
                    },
                },
            ],
        },
        {
            label: { en: "Coordinates", nl: "Coördinaten" },
            name: "geo",
            type: "group",
            fields: [
                {
                    label: { en: "Latitude", nl: "Breedtegraad (latitude)" },
                    name: "latitude",
                    type: "number",
                    admin: {
                        description: {
                            en: "For example: 52.3676",
                            nl: "Bijvoorbeeld: 52.3676",
                        },
                    },
                },
                {
                    label: { en: "Longitude", nl: "Lengtegraad (longitude)" },
                    name: "longitude",
                    type: "number",
                    admin: {
                        description: {
                            en: "For example: 4.9041",
                            nl: "Bijvoorbeeld: 4.9041",
                        },
                    },
                },
            ],
        },
        {
            label: { en: "Social media", nl: "Social media" },
            name: "sameAs",
            type: "array",
            labels: {
                singular: {
                    en: "Social media profile",
                    nl: "Social media profiel",
                },
                plural: {
                    en: "Social media profiles",
                    nl: "Social media profielen",
                },
            },
            fields: [
                {
                    label: { en: "URL", nl: "URL" },
                    name: "url",
                    type: "text",
                    required: true,
                },
            ],
            admin: {
                description: {
                    en: "Add links to social media profiles (Facebook, Instagram, LinkedIn, etc.)",
                    nl: "Voeg links toe naar social media profielen (Facebook, Instagram, LinkedIn, etc.)",
                },
            },
        },
        {
            label: { en: "Price level", nl: "Prijsniveau" },
            name: "priceRange",
            type: "text",
            required: false,
            admin: {
                description: {
                    en: "For example: €€",
                    nl: "Bijvoorbeeld: €€",
                },
            },
        },
        {
            label: { en: "Opening hours", nl: "Openingstijden" },
            name: "openingHours",
            type: "array",
            required: false,
            labels: {
                singular: { en: "Opening hour", nl: "Openingstijd" },
                plural: { en: "Opening hours", nl: "Openingstijden" },
            },
            admin: {
                description: {
                    en: "Add one row per day/time combination (e.g. Monday 09:00-17:00 and Wednesday 14:00-20:00).",
                    nl: "Voeg één rij toe per dag/tijd combinatie (bijv. Maandag 09:00-17:00 én Woensdag 14:00-20:00).",
                },
            },
            fields: [
                {
                    label: { en: "Day of the week", nl: "Dag van de week" },
                    name: "dayOfWeek",
                    type: "select",
                    required: true,
                    options: [
                        {
                            label: { en: "Monday", nl: "Maandag" },
                            value: "monday",
                        },
                        {
                            label: { en: "Tuesday", nl: "Dinsdag" },
                            value: "tuesday",
                        },
                        {
                            label: { en: "Wednesday", nl: "Woensdag" },
                            value: "wednesday",
                        },
                        {
                            label: { en: "Thursday", nl: "Donderdag" },
                            value: "thursday",
                        },
                        {
                            label: { en: "Friday", nl: "Vrijdag" },
                            value: "friday",
                        },
                        {
                            label: { en: "Saturday", nl: "Zaterdag" },
                            value: "saturday",
                        },
                        {
                            label: { en: "Sunday", nl: "Zondag" },
                            value: "sunday",
                        },
                    ],
                },
                {
                    label: { en: "Opening time", nl: "Openingstijd" },
                    name: "opens",
                    type: "text",
                    required: true,
                    admin: {
                        description: {
                            en: "For example 09:00",
                            nl: "Bijvoorbeeld 09:00",
                        },
                    },
                },
                {
                    label: { en: "Closing time", nl: "Sluitingstijd" },
                    name: "closes",
                    type: "text",
                    required: true,
                    admin: {
                        description: {
                            en: "For example 17:00",
                            nl: "Bijvoorbeeld 17:00",
                        },
                    },
                },
            ],
        },
        {
            label: { en: "Images", nl: "Afbeeldingen" },
            name: "images",
            type: "array",
            required: false,
            admin: {
                description: {
                    en: "Upload images related to the organization",
                    nl: "Upload afbeeldingen gerelateerd aan de organisatie",
                },
            },
            fields: [
                {
                    label: { en: "Image", nl: "Afbeelding" },
                    name: "image",
                    type: "upload",
                    relationTo: "media",
                    filterOptions: {
                        mimeType: { contains: "image" },
                    },
                },
            ],
        },
    ],
    hooks: {
        afterChange: [revalidateOrganization],
    },
};
