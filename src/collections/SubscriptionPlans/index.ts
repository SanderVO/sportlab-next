import { isAdmin } from "@/access/admin";
import { authenticated } from "@/access/authenticated";
import { relationshipID } from "@/utilities/relationshipID";
import { APIError, type CollectionConfig } from "payload";

/**
 * The reusable definition of a subscription: what it includes and which price is
 * currently offered. Members are linked to a plan through `subscriptions`; the plan's
 * prices are immutable rows in `subscription-plan-prices`, so changing the price
 * creates a new one instead of editing history.
 */
export const SubscriptionPlans: CollectionConfig = {
    slug: "subscription-plans",
    labels: {
        singular: { en: "Subscription plan", nl: "Abonnementplan" },
        plural: { en: "Subscription plans", nl: "Abonnementplannen" },
    },
    access: {
        create: isAdmin,
        delete: isAdmin,
        read: authenticated,
        update: isAdmin,
    },
    admin: {
        useAsTitle: "name",
        defaultColumns: [
            "name",
            "groupCreditsPerMonth",
            "ptCreditsPerWeek",
            "currentPrice",
            "active",
        ],
    },
    hooks: {
        beforeValidate: [
            async ({ data, originalDoc, req }) => {
                const priceID = relationshipID(data?.currentPrice);

                // Creating a plan: it has no id yet, so no price can belong to it.
                if (!priceID || !originalDoc?.id) return data;

                const result = await req.payload.find({
                    collection: "subscription-plan-prices",
                    where: { id: { equals: priceID } },
                    limit: 1,
                    depth: 0,
                    req,
                    overrideAccess: true,
                });
                const price = result.docs[0];

                if (
                    price &&
                    String(relationshipID(price.plan)) !==
                        String(originalDoc.id)
                ) {
                    throw new APIError(
                        "Dit tarief hoort bij een ander abonnementplan.",
                        400,
                    );
                }

                return data;
            },
        ],
        beforeDelete: [
            async ({ id, req }) => {
                const [subscriptions, prices] = await Promise.all([
                    req.payload.count({
                        collection: "subscriptions",
                        where: { plan: { equals: id } },
                        req,
                    }),
                    req.payload.count({
                        collection: "subscription-plan-prices",
                        where: { plan: { equals: id } },
                        req,
                    }),
                ]);

                if (subscriptions.totalDocs > 0) {
                    throw new APIError(
                        "Dit plan is nog aan leden gekoppeld. Zet het plan op inactief in plaats van het te verwijderen.",
                        400,
                    );
                }

                if (prices.totalDocs > 0) {
                    throw new APIError(
                        "Dit plan heeft nog tarieven. Zet het plan op inactief in plaats van het te verwijderen.",
                        400,
                    );
                }
            },
        ],
    },
    fields: [
        {
            label: { en: "Name", nl: "Naam" },
            name: "name",
            type: "text",
            required: true,
            admin: {
                description: {
                    en: "For example '9 groepslessen' or 'Personal training 2x per week'.",
                    nl: "Bijvoorbeeld '9 groepslessen' of 'Personal training 2x per week'.",
                },
            },
        },
        {
            label: { en: "Description", nl: "Omschrijving" },
            name: "description",
            type: "textarea",
            required: false,
            admin: {
                rows: 3,
            },
        },
        {
            label: { en: "Group credits per month", nl: "Groepscredits per maand" },
            name: "groupCreditsPerMonth",
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
                    en: "Group lesson credits included in this plan each calendar month.",
                    nl: "Aantal groepslescredits per kalendermaand in dit plan.",
                },
            },
        },
        {
            label: { en: "PT credits per week", nl: "PT-credits per week" },
            name: "ptCreditsPerWeek",
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
                    en: "PT and semi-PT credits included each week (Monday–Sunday).",
                    nl: "PT- en semi-PT-credits per week (maandag–zondag).",
                },
            },
        },
        {
            label: { en: "Current price", nl: "Huidig tarief" },
            name: "currentPrice",
            type: "relationship",
            relationTo: "subscription-plan-prices",
            required: false,
            index: true,
            filterOptions: ({ id }) => {
                // A new plan has no id yet, so it cannot have prices either.
                if (!id) return false;

                return { plan: { equals: id } };
            },
            admin: {
                condition: (data) => Boolean(data?.id),
                description: {
                    en: "Set automatically for the first price. To change the price, create the new price first, select it here, then archive the old one.",
                    nl: "Wordt automatisch gezet bij het eerste tarief. Maak bij een prijswijziging eerst het nieuwe tarief aan, kies het hier en archiveer daarna het oude.",
                },
            },
        },
        {
            label: { en: "Stripe product ID", nl: "Stripe-product-ID" },
            name: "stripeProductId",
            type: "text",
            required: false,
            index: true,
            admin: {
                description: {
                    en: "Stripe product ID (prod_...) of this plan.",
                    nl: "Stripe-product-ID (prod_...) van dit plan.",
                },
            },
        },
        {
            label: { en: "Active", nl: "Actief" },
            name: "active",
            type: "checkbox",
            required: true,
            defaultValue: true,
            admin: {
                description: {
                    en: "Inactive plans stay on existing subscriptions but cannot be chosen for new ones.",
                    nl: "Inactieve plannen blijven op bestaande abonnementen staan, maar zijn niet te kiezen voor nieuwe abonnementen.",
                },
            },
        },
        {
            label: { en: "Prices", nl: "Tarieven" },
            name: "prices",
            type: "join",
            collection: "subscription-plan-prices",
            on: "plan",
            defaultSort: "-createdAt",
            admin: {
                allowCreate: true,
                defaultColumns: [
                    "stripePriceId",
                    "amountCents",
                    "currency",
                    "interval",
                    "active",
                ],
                description: {
                    en: "All prices for this plan. Archived prices stay for existing subscriptions.",
                    nl: "Alle tarieven van dit plan. Archieftarieven blijven bestaan voor bestaande abonnementen.",
                },
            },
        },
        {
            label: { en: "Subscriptions", nl: "Abonnementen" },
            name: "subscriptions",
            type: "join",
            collection: "subscriptions",
            on: "plan",
            defaultSort: "-createdAt",
            admin: {
                allowCreate: true,
                defaultColumns: ["user", "status", "currentPeriodEnd"],
                description: {
                    en: "Members currently linked to this plan. Add a member here to assign the plan.",
                    nl: "Leden die aan dit plan gekoppeld zijn. Voeg hier een lid toe om het plan toe te wijzen.",
                },
            },
        },
    ],
};
