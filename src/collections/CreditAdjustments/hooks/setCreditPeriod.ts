import { getCreditPeriod, type CreditType } from "@/utilities/creditPeriod";
import type { CollectionBeforeValidateHook } from "payload";

/**
 * Stores the calendar period an adjustment belongs to. Admins pick any date in the
 * target period; the period is derived here so group credits always reset per month
 * and PT credits per week, regardless of the time zone of the editor.
 */
export const setCreditPeriod: CollectionBeforeValidateHook = ({
    data,
    originalDoc,
}) => {
    if (!data) return data;

    const creditType = (data.creditType ??
        originalDoc?.creditType) as CreditType | undefined;
    const dateValue = data.date ?? originalDoc?.date;

    if (!creditType || !dateValue) {
        return data;
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
        return data;
    }

    const { start, end } = getCreditPeriod(creditType, date);

    data.periodStart = start.toISOString();
    data.periodEnd = end.toISOString();

    return data;
};
