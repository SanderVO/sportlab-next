import type { GlobalConfig } from "payload";
import { revalidateWhatsapp } from "./hooks/revalidateWhatsapp";

export const WhatsApp: GlobalConfig = {
    slug: "whatsApp",
    label: { en: "WhatsApp", nl: "WhatsApp" },
    access: {
        read: () => true,
    },
    fields: [
        {
            label: { en: "Phone number", nl: "Telefoonnummer" },
            name: "phoneNumber",
            type: "text",
            required: true,
            admin: {
                description:
                    { en: "Enter the phone number in international format, for example: +31612345678", nl: "Voer het telefoonnummer in in internationaal formaat, bijvoorbeeld: +31612345678" },
            },
        },
        {
            label: { en: "Pre-filled text", nl: "Tekst vooraf ingevuld" },
            name: "textPreFilled",
            type: "text",
            required: true,
        },
        {
            label: { en: "Button text", nl: "Tekst voor knop" },
            name: "buttonText",
            type: "text",
            required: true,
        },
    ],
    hooks: {
        afterChange: [revalidateWhatsapp],
    },
};
