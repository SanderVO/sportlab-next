import { isAdmin } from "@/access/admin";
import { adminOrSelf } from "@/access/adminOrSelf";
import { offerSpotsOnCreditChange } from "@/hooks/offerSpotsOnCreditChange";
import type { CollectionConfig } from "payload";
import { defaultPriceFromPlan } from "./hooks/defaultPriceFromPlan";

/**
 * Links a member to a reusable subscription plan and the price they were sold on.
 * The plan holds the credit allowance; this record holds the member-specific Stripe
 * state and billing period, which is written by Stripe webhooks rather than editors.
 */
export const Subscriptions: CollectionConfig = {
    slug: "subscriptions",
    labels: {
        singular: { en: "Subscription", nl: "Abonnement" },
        plural: { en: "Subscriptions", nl: "Abonnementen" },
    },
    access: {
        create: isAdmin,
        delete: isAdmin,
        read: adminOrSelf,
        update: isAdmin,
    },
    admin: {
        defaultColumns: [
            "user",
            "plan",
            "status",
            "currentPeriodEnd",
            "updatedAt",
        ],
    },
    hooks: {
        beforeValidate: [defaultPriceFromPlan],
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
            admin: {
                description: {
                    en: "The member this subscription belongs to.",
                    nl: "Het lid waar dit abonnement bij hoort.",
                },
            },
        },
        {
            label: { en: "Plan", nl: "Abonnementplan" },
            name: "plan",
            type: "relationship",
            relationTo: "subscription-plans",
            required: true,
            index: true,
            filterOptions: {
                active: { equals: true },
            },
            admin: {
                description: {
                    en: "The plan that defines the price and credit allowance.",
                    nl: "Het plan dat de prijs en het aantal credits bepaalt.",
                },
            },
        },
        {
            label: { en: "Price", nl: "Tarief" },
            name: "price",
            type: "relationship",
            relationTo: "subscription-plan-prices",
            required: false,
            index: true,
            admin: {
                description: {
                    en: "The price this subscription is billed on. Defaults to the plan's current price; keep the old price when a plan changes price.",
                    nl: "Het tarief waarop dit abonnement wordt gefactureerd. Standaard het huidige tarief van het plan; houd het oude tarief bij een prijswijziging.",
                },
            },
        },
        {
            label: { en: "Status", nl: "Status" },
            name: "status",
            type: "select",
            required: true,
            defaultValue: "active",
            options: [
                {
                    label: { en: "Trialing", nl: "Proefperiode" },
                    value: "trialing",
                },
                { label: { en: "Active", nl: "Actief" }, value: "active" },
                {
                    label: { en: "Past due", nl: "Betaling achterstallig" },
                    value: "past_due",
                },
                {
                    label: { en: "Cancelled", nl: "Opgezegd" },
                    value: "canceled",
                },
                { label: { en: "Unpaid", nl: "Onbetaald" }, value: "unpaid" },
                {
                    label: { en: "Incomplete", nl: "Onvolledig" },
                    value: "incomplete",
                },
                {
                    label: { en: "Incomplete expired", nl: "Onvolledig verlopen" },
                    value: "incomplete_expired",
                },
                { label: { en: "Paused", nl: "Gepauzeerd" }, value: "paused" },
            ],
            admin: {
                readOnly: true,
                description: {
                    en: "Mirrors the Stripe subscription status.",
                    nl: "Komt overeen met de status van het abonnement in Stripe.",
                },
            },
        },
        {
            label: { en: "Stripe subscription ID", nl: "Stripe-abonnement-ID" },
            name: "stripeSubscriptionId",
            type: "text",
            required: false,
            unique: true,
            admin: {
                description: {
                    en: "Stripe subscription ID (sub_...). Used to match webhook events.",
                    nl: "Stripe-abonnement-ID (sub_...). Hiermee worden webhook-events gekoppeld.",
                },
            },
        },
        {
            label: { en: "Current period start", nl: "Start huidige periode" },
            name: "currentPeriodStart",
            type: "date",
            required: false,
            admin: {
                readOnly: true,
                date: { pickerAppearance: "dayAndTime" },
                description: {
                    en: "Start of the period Stripe has already charged for.",
                    nl: "Start van de periode waarvoor Stripe al heeft geïncasseerd.",
                },
            },
        },
        {
            label: { en: "Current period end", nl: "Einde huidige periode" },
            name: "currentPeriodEnd",
            type: "date",
            required: false,
            index: true,
            admin: {
                readOnly: true,
                date: { pickerAppearance: "dayAndTime" },
                description: {
                    en: "End of the paid period. Credits top up again at the next period.",
                    nl: "Einde van de betaalde periode. Bij de volgende periode worden de credits weer aangevuld.",
                },
            },
        },
        {
            label: { en: "Cancel at period end", nl: "Opzeggen per periode-einde" },
            name: "cancelAtPeriodEnd",
            type: "checkbox",
            required: false,
            defaultValue: false,
            admin: {
                readOnly: true,
                description: {
                    en: "Set by Stripe when the member cancels at the end of the paid period.",
                    nl: "Wordt door Stripe gezet wanneer het lid opzegt per het einde van de betaalde periode.",
                },
            },
        },
        {
            label: { en: "Cancelled at", nl: "Opgezegd op" },
            name: "canceledAt",
            type: "date",
            required: false,
            admin: {
                readOnly: true,
                date: { pickerAppearance: "dayAndTime" },
                description: {
                    en: "Set by Stripe when the subscription is cancelled.",
                    nl: "Wordt door Stripe gezet wanneer het abonnement is opgezegd.",
                },
            },
        },
        {
            label: { en: "Trial ends at", nl: "Einde proefperiode" },
            name: "trialEndsAt",
            type: "date",
            required: false,
            admin: {
                readOnly: true,
                date: { pickerAppearance: "dayAndTime" },
                condition: (_, siblingData) => siblingData?.status === "trialing",
            },
        },
        {
            label: { en: "Started at", nl: "Gestart op" },
            name: "startedAt",
            type: "date",
            required: false,
            defaultValue: () => new Date().toISOString(),
            admin: {
                date: { pickerAppearance: "dayAndTime" },
            },
        },
        {
            label: { en: "Notes", nl: "Notities" },
            name: "notes",
            type: "textarea",
            required: false,
            admin: {
                rows: 3,
            },
        },
    ],
    indexes: [
        {
            fields: ["user", "status"],
        },
    ],
};
