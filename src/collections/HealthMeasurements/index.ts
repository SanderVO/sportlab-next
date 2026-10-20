import { RolesEnum } from "@/collections/Users/roles";
import type {
    Access,
    CollectionBeforeValidateHook,
    CollectionConfig,
    Field,
} from "payload";

const isAuthenticated: Access = ({ req: { user } }) => Boolean(user);

const ownRecords: Access = ({ req: { user } }) => {
    if (!user) {
        return false;
    }

    return { user: { equals: user.id } };
};

/** Coaches and admins may read every measurement, members only their own. Nobody but the owner may write. */
const readOwnOrStaff: Access = ({ req: { user } }) => {
    if (!user) {
        return false;
    }

    const roles = Array.isArray(user.roles) ? user.roles : [];

    if (roles.includes(RolesEnum.ADMIN) || roles.includes(RolesEnum.COACH)) {
        return true;
    }

    return { user: { equals: user.id } };
};

const relationId = (value: unknown): unknown =>
    value && typeof value === "object" && "id" in value
        ? (value as { id: unknown }).id
        : value;

/** Ownership is never taken from the request body. */
const enforceOwner: CollectionBeforeValidateHook = ({
    data,
    operation,
    originalDoc,
    req,
}) => {
    if (!data) {
        return data;
    }

    if (operation === "create" && req.user) {
        return { ...data, user: req.user.id };
    }

    if (operation === "update" && originalDoc) {
        return { ...data, user: relationId(originalDoc.user) };
    }

    return data;
};

/** BMI = kg / m², derived unless the user entered the value from their own scale. */
const deriveBmi: CollectionBeforeValidateHook = ({ data, originalDoc }) => {
    if (!data || typeof data.bmi === "number") {
        return data;
    }

    const height = data.height ?? originalDoc?.height;
    const weight = data.weight ?? originalDoc?.weight;

    if (typeof height !== "number" || typeof weight !== "number") {
        return data;
    }

    // On update, a stored (possibly manual) BMI only changes when height or weight does.
    if (originalDoc && data.height === undefined && data.weight === undefined) {
        return data;
    }

    const meters = height / 100;

    return { ...data, bmi: Math.round((weight / (meters * meters)) * 10) / 10 };
};

const measurementField = (
    name: string,
    label: { en: string; nl: string },
    unit: string,
    min: number,
    max: number,
): Field => ({
    name,
    type: "number",
    label,
    required: false,
    min,
    max,
    admin: { description: { en: unit, nl: unit } },
});

export const HealthMeasurements: CollectionConfig = {
    slug: "health-measurements",
    labels: {
        singular: { en: "Health measurement", nl: "Gezondheidsmeting" },
        plural: { en: "Health measurements", nl: "Gezondheidsmetingen" },
    },
    // Only used by the member dashboard, so it stays out of the CMS and the GraphQL API.
    admin: { hidden: true },
    custom: { dashboardOnly: true },
    graphQL: false,
    access: {
        create: isAuthenticated,
        read: readOwnOrStaff,
        update: ownRecords,
        delete: ownRecords,
    },
    defaultSort: "-measuredAt",
    hooks: {
        beforeValidate: [enforceOwner, deriveBmi],
    },
    fields: [
        {
            name: "user",
            type: "relationship",
            relationTo: "users",
            required: true,
            index: true,
            label: { en: "User", nl: "Gebruiker" },
        },
        {
            name: "measuredAt",
            type: "date",
            required: true,
            defaultValue: () => new Date().toISOString(),
            label: { en: "Measured at", nl: "Gemeten op" },
        },
        measurementField("height", { en: "Height", nl: "Lengte" }, "cm", 50, 250),
        measurementField("weight", { en: "Weight", nl: "Gewicht" }, "kg", 20, 400),
        measurementField(
            "bodyFatPercentage",
            { en: "Body fat", nl: "Vetpercentage" },
            "%",
            1,
            80,
        ),
        measurementField(
            "muscleMass",
            { en: "Muscle mass", nl: "Spiermassa" },
            "kg",
            5,
            200,
        ),
        measurementField(
            "visceralFat",
            { en: "Visceral fat", nl: "Visceraal vet" },
            "rating",
            1,
            59,
        ),
        measurementField(
            "boneMass",
            { en: "Bone mass", nl: "Botmassa" },
            "kg",
            0.5,
            10,
        ),
        measurementField("bmi", { en: "BMI", nl: "BMI" }, "kg/m²", 5, 100),
        measurementField(
            "bmr",
            { en: "BMR", nl: "Basaal metabolisme (BMR)" },
            "kcal / day",
            500,
            6000,
        ),
        measurementField(
            "metabolicAge",
            { en: "Metabolic age", nl: "Metabolische leeftijd" },
            "years",
            5,
            120,
        ),
        measurementField(
            "bodyWaterPercentage",
            { en: "Body water", nl: "Vochtpercentage" },
            "%",
            10,
            90,
        ),
    ],
    // Serves the development graph: one user's measurements in date order.
    indexes: [{ fields: ["user", "measuredAt"] }],
};
