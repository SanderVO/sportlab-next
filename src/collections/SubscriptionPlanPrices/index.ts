import { isAdmin } from "@/access/admin";
import { authenticated } from "@/access/authenticated";
import { relationshipID } from "@/utilities/relationshipID";
import { APIError, type CollectionConfig } from "payload";

/**
 * An immutable price for a subscription plan. Stripe Prices cannot be edited, so a
 * plan price change creates a new row here and archives the old one; existing
 * subscriptions keep pointing at the price they were sold on.
 */
export const SubscriptionPlanPrices: CollectionConfig = {
    slug: "subscription-plan-prices",
    labels: {
        singular: { en: "Subscription price", nl: "Abonnementstarief" },
        plural: { en: "Subscription prices", nl: "Abonnementstarieven" },
    },
    access: {
        create: isAdmin,
        delete: isAdmin,
        read: authenticated,
        update: isAdmin,
    },
    admin: {
        useAsTitle: "stripePriceId",
        defaultColumns: [
            "plan",
            "amountCents",
            "currency",
            "interval",
            "active",
        ],
    },
    hooks: {
        afterChange: [
            async ({ doc, operation, req }) => {
                if (operation !== "create" || !doc.active) return;

                const planID = relationshipID(doc.plan);
                if (!planID) return;

                const plan = await req.payload.findByID({
                    collection: "subscription-plans",
                    id: planID,
                    depth: 0,
                    req,
                    overrideAccess: true,
                });

                if (plan?.currentPrice) return;

                await req.payload.update({
                    collection: "subscription-plans",
                    id: planID,
                    data: { currentPrice: doc.id },
                    req,
                    overrideAccess: true,
                });
            },
        ],
        beforeDelete: [
            async ({ id, req }) => {
                const [subscriptions, plans] = await Promise.all([
                    req.payload.count({
                        collection: "subscriptions",
                        where: { price: { equals: id } },
                        req,
                    }),
                    req.payload.count({
                        collection: "subscription-plans",
                        where: { currentPrice: { equals: id } },
                        req,
                    }),
                ]);

                if (subscriptions.totalDocs > 0 || plans.totalDocs > 0) {
                    throw new APIError(
                        "Dit tarief is nog gekoppeld aan een abonnement of is het huidige tarief van een plan. Zet het tarief op inactief in plaats van het te verwijderen.",
                        400,
                    );
                }
            },
        ],
    },
    fields: [
        {
            label: { en: "Plan", nl: "Abonnementplan" },
            name: "plan",
            type: "relationship",
            relationTo: "subscription-plans",
            required: true,
            index: true,
        },
        {
            label: { en: "Stripe price ID", nl: "Stripe-prijs-ID" },
            name: "stripePriceId",
            type: "text",
            required: false,
            unique: true,
            admin: {
                description: {
                    en: "Stripe price ID (price_...). Leave empty until the Stripe price exists.",
                    nl: "Stripe-prijs-ID (price_...). Laat leeg totdat de Stripe-prijs bestaat.",
                },
            },
        },
        {
            label: { en: "Amount", nl: "Bedrag" },
            name: "amountCents",
            type: "number",
            required: true,
            defaultValue: 0,
            min: 0,
            validate: (value: number | null | undefined) =>
                value === null ||
                value === undefined ||
                (Number.isInteger(value) && value >= 0) ||
                "Gebruik een heel getal van 0 of hoger.",
            admin: {
                description: {
                    en: "The recurring amount in cents, for example 6450 for €64.50.",
                    nl: "Het terugkerende bedrag in centen, bijvoorbeeld 6450 voor € 64,50.",
                },
            },
        },
        {
            label: { en: "Currency", nl: "Valuta" },
            name: "currency",
            type: "text",
            required: true,
            defaultValue: "eur",
            admin: {
                description: {
                    en: "ISO currency code, for example eur.",
                    nl: "ISO-valutacode, bijvoorbeeld eur.",
                },
            },
        },
        {
            label: { en: "Billing interval", nl: "Betaalperiode" },
            name: "interval",
            type: "select",
            required: true,
            defaultValue: "month",
            options: [
                { label: { en: "Weekly", nl: "Per week" }, value: "week" },
                { label: { en: "Monthly", nl: "Per maand" }, value: "month" },
                { label: { en: "Yearly", nl: "Per jaar" }, value: "year" },
            ],
        },
        {
            label: { en: "Active", nl: "Actief" },
            name: "active",
            type: "checkbox",
            required: true,
            defaultValue: true,
            admin: {
                description: {
                    en: "Archived prices stay on existing subscriptions but cannot be chosen for new ones.",
                    nl: "Archieftarieven blijven op bestaande abonnementen staan, maar zijn niet te kiezen voor nieuwe abonnementen.",
                },
            },
        },
        {
            label: { en: "Subscriptions", nl: "Abonnementen" },
            name: "subscriptions",
            type: "join",
            collection: "subscriptions",
            on: "price",
            defaultSort: "-createdAt",
            admin: {
                allowCreate: false,
                defaultColumns: ["user", "status", "currentPeriodEnd"],
                description: {
                    en: "Members currently billed on this price.",
                    nl: "Leden die op dit tarief worden gefactureerd.",
                },
            },
        },
    ],
};
