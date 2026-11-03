import { adminCoachOrSelf } from "@/access/adminCoachOrSelf";
import { isAdminOrCoach } from "@/access/isAdminOrCoach";
import { staffOnlyField } from "@/access/staffOnlyField";
import { offerSpotsOnCreditChange } from "@/hooks/offerSpotsOnCreditChange";
import type { CollectionConfig } from "payload";
import { setCreditPeriod } from "./hooks/setCreditPeriod";
import { validateSubscriptionOwner } from "./hooks/validateSubscriptionOwner";

/**
 * Manual or system changes to a member's credit balance for one period. The balance
 * itself is calculated from the subscription allowance plus these adjustments minus
 * the lessons used; adjustments are the audit trail for "Inclusief 1 extra credit van Jesse".
 */
export const CreditAdjustments: CollectionConfig = {
    slug: "credit-adjustments",
    labels: {
        singular: { en: "Credit adjustment", nl: "Creditaanpassing" },
        plural: { en: "Credit adjustments", nl: "Creditaanpassingen" },
    },
    access: {
        create: isAdminOrCoach,
        delete: isAdminOrCoach,
        read: adminCoachOrSelf,
        update: isAdminOrCoach,
    },
    admin: {
        useAsTitle: "id",
        defaultColumns: [
            "user",
            "creditType",
            "amount",
            "periodStart",
            "addedBy",
        ],
    },
    hooks: {
        beforeValidate: [validateSubscriptionOwner, setCreditPeriod],
        afterChange: [offerSpotsOnCreditChange],
    },
    fields: [
        {
            label: { en: "Member", nl: "Lid" },
            name: "user",
            type: "relationship",
            relationTo: "users",
            required: true,
            index: true,
            access: { create: staffOnlyField, update: staffOnlyField },
        },
        {
            label: { en: "Subscription", nl: "Abonnement" },
            name: "subscription",
            type: "relationship",
            relationTo: "subscriptions",
            required: false,
            index: true,
            access: { create: staffOnlyField, update: staffOnlyField },
            admin: {
                description: {
                    en: "Optional: the subscription this adjustment belongs to. Must be the member's own subscription.",
                    nl: "Optioneel: het abonnement waar deze aanpassing bij hoort. Moet van hetzelfde lid zijn.",
                },
            },
        },
        {
            label: { en: "Credit type", nl: "Soort credit" },
            name: "creditType",
            type: "select",
            required: true,
            options: [
                {
                    label: { en: "Group lessons", nl: "Groepslessen" },
                    value: "group",
                },
                {
                    label: { en: "Personal training", nl: "Personal training" },
                    value: "pt",
                },
            ],
            access: { create: staffOnlyField, update: staffOnlyField },
            admin: {
                description: {
                    en: "Group credits count per calendar month; PT credits per week (Monday–Sunday).",
                    nl: "Groepscredits tellen per kalendermaand; PT-credits per week (maandag–zondag).",
                },
            },
        },
        {
            label: { en: "Amount", nl: "Aantal credits" },
            name: "amount",
            type: "number",
            required: true,
            validate: (value: number | null | undefined) => {
                if (typeof value !== "number" || !Number.isInteger(value)) {
                    return "Gebruik een heel getal.";
                }

                if (value === 0) {
                    return "Gebruik een getal anders dan 0.";
                }

                return true;
            },
            access: { create: staffOnlyField, update: staffOnlyField },
            admin: {
                description: {
                    en: "Positive to add credits, negative to remove them.",
                    nl: "Positief om credits toe te voegen, negatief om credits te verwijderen.",
                },
            },
        },
        {
            label: { en: "Date in period", nl: "Datum in periode" },
            name: "date",
            type: "date",
            required: true,
            defaultValue: () => new Date().toISOString(),
            access: { create: staffOnlyField, update: staffOnlyField },
            admin: {
                date: { pickerAppearance: "dayOnly" },
                description: {
                    en: "Any date in the period the adjustment applies to. The period is calculated automatically.",
                    nl: "Een datum in de periode waarop de aanpassing geldt. De periode wordt automatisch berekend.",
                },
            },
        },
        {
            label: { en: "Period start", nl: "Start periode" },
            name: "periodStart",
            type: "date",
            required: true,
            index: true,
            admin: {
                readOnly: true,
                date: { pickerAppearance: "dayAndTime" },
            },
        },
        {
            label: { en: "Period end", nl: "Einde periode" },
            name: "periodEnd",
            type: "date",
            required: true,
            admin: {
                readOnly: true,
                date: { pickerAppearance: "dayAndTime" },
            },
        },
        {
            label: { en: "Source", nl: "Bron" },
            name: "source",
            type: "select",
            required: true,
            defaultValue: "manual",
            options: [
                { label: { en: "Manual", nl: "Handmatig" }, value: "manual" },
                { label: { en: "Stripe", nl: "Stripe" }, value: "stripe" },
                { label: { en: "System", nl: "Systeem" }, value: "system" },
            ],
            access: { create: staffOnlyField, update: staffOnlyField },
        },
        {
            label: { en: "Reason", nl: "Reden" },
            name: "reason",
            type: "textarea",
            required: false,
            admin: {
                rows: 2,
                description: {
                    en: "Optional note, for example '1 extra credit van Jesse'.",
                    nl: "Optionele notitie, bijvoorbeeld '1 extra credit van Jesse'.",
                },
            },
        },
        {
            label: { en: "Added by", nl: "Toegevoegd door" },
            name: "addedBy",
            type: "relationship",
            relationTo: "users",
            required: false,
            access: { create: staffOnlyField, update: staffOnlyField },
            admin: {
                readOnly: true,
                description: {
                    en: "Automatically set via a hook.",
                    nl: "Wordt automatisch gezet via een hook.",
                },
            },
            hooks: {
                beforeChange: [
                    ({ req, value }) => {
                        if (value) return value;
                        return req.user?.id;
                    },
                ],
            },
        },
    ],
    indexes: [
        {
            fields: ["user", "creditType", "periodStart"],
        },
    ],
};
