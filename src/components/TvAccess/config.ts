import { RolesEnum } from "@/collections/Users/roles";
import type { Access, GlobalConfig, TextFieldSingleValidation } from "payload";
import { revalidateTvAccess } from "./hooks/revalidateTvAccess";

const hasRole =
    (...allowed: RolesEnum[]): Access =>
    ({ req: { user } }) => {
        const roles: string[] = Array.isArray(user?.roles) ? user.roles : [];

        return allowed.some((role) => roles.includes(role));
    };

// Not wrapped in withCoachGlobalVisibility: coaches need to see the PIN in the CMS.
export const TvAccess: GlobalConfig = {
    slug: "tvAccess",
    label: { en: "TV access", nl: "TV-toegang" },
    access: {
        read: hasRole(RolesEnum.ADMIN, RolesEnum.EDITOR, RolesEnum.COACH),
        update: hasRole(RolesEnum.ADMIN, RolesEnum.EDITOR),
    },
    fields: [
        {
            label: { en: "Require PIN", nl: "Pincode vereist" },
            name: "enabled",
            type: "checkbox",
            defaultValue: false,
            admin: {
                description: {
                    en: "When enabled, the TV dashboard can only be opened after entering the PIN.",
                    nl: "Als dit aan staat, is het TV-dashboard pas te openen na het invoeren van de pincode.",
                },
            },
        },
        {
            label: { en: "PIN", nl: "Pincode" },
            name: "pin",
            type: "text",
            admin: {
                description: {
                    en: "4 digits. Changing the PIN locks every TV that is currently unlocked.",
                    nl: "4 cijfers. Bij een nieuwe pincode moeten alle TV's opnieuw worden ontgrendeld.",
                },
            },
            validate: ((value, { siblingData }) => {
                const enabled = Boolean(
                    (siblingData as { enabled?: boolean } | undefined)?.enabled,
                );

                if (!value) {
                    return enabled ? "Enter a 4-digit PIN" : true;
                }

                return /^\d{4}$/.test(value) || "PIN must be exactly 4 digits";
            }) satisfies TextFieldSingleValidation,
        },
    ],
    hooks: {
        afterChange: [revalidateTvAccess],
    },
};
