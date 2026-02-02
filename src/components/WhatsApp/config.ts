import type { GlobalConfig } from "payload";
import { revalidateWhatsapp } from "./hooks/revalidateWhatsapp";

export const WhatsApp: GlobalConfig = {
    slug: "whatsApp",
    label: "WhatsApp",
    access: {
        read: () => true,
    },
    fields: [
        {
            label: "Telefoonnummer",
            name: "phoneNumber",
            type: "text",
            required: true,
            admin: {
                description:
                    "Voer het telefoonnummer in in internationaal formaat, bijvoorbeeld: +31612345678",
            },
        },
        {
            label: "Tekst vooraf ingevuld",
            name: "textPreFilled",
            type: "text",
            required: true,
        },
        {
            label: "Tekst voor knop",
            name: "buttonText",
            type: "text",
            required: true,
        },
    ],
    hooks: {
        afterChange: [revalidateWhatsapp],
    },
};
