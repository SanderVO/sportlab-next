/**
 * Credit periods follow the gym's local calendar: group credits reset per calendar month,
 * PT and semi-PT credits per week (Monday 00:00 – Sunday 23:59:59.999, Europe/Amsterdam).
 * A credit belongs to the period of the lesson, not of the booking.
 */

export const CREDIT_TIME_ZONE = "Europe/Amsterdam";

export type CreditType = "group" | "pt";

export type LessonType = "pt" | "semi_pt" | "group" | "open_gym";

export type CreditPeriod = {
    start: Date;
    end: Date;
};

const MS_PER_DAY = 24 * 60 * 60 * 1000;

const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: CREDIT_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
});

type DateTimeParts = {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
    second: number;
};

const partsInTimeZone = (date: Date): DateTimeParts => {
    const parts = formatter.formatToParts(date);
    const read = (type: Intl.DateTimeFormatPartTypes): number =>
        Number(parts.find((part) => part.type === type)?.value);

    return {
        year: read("year"),
        month: read("month"),
        day: read("day"),
        hour: read("hour"),
        minute: read("minute"),
        second: read("second"),
    };
};

/** The time zone's offset from UTC at this instant, in milliseconds. */
const offsetMs = (date: Date): number => {
    const parts = partsInTimeZone(date);
    const asUtc = Date.UTC(
        parts.year,
        parts.month - 1,
        parts.day,
        parts.hour,
        parts.minute,
        parts.second,
    );

    return asUtc - Math.floor(date.getTime() / 1000) * 1000;
};

/** Midnight at the start of a local calendar day, returned as the matching UTC instant. */
const zonedMidnight = (year: number, month: number, day: number): Date => {
    const utcGuess = Date.UTC(year, month - 1, day);

    // Two passes: the offset can change between the UTC guess and the actual instant
    // (daylight saving time starts or ends).
    let instant = utcGuess - offsetMs(new Date(utcGuess));
    instant = utcGuess - offsetMs(new Date(instant));

    return new Date(instant);
};

export const creditTypeForLessonType = (
    lessonType: LessonType,
): CreditType | null => {
    if (lessonType === "group") return "group";
    if (lessonType === "pt" || lessonType === "semi_pt") return "pt";

    return null;
};

/**
 * The period the lesson (or credit adjustment) belongs to:
 * the calendar month for group credits, the ISO week (Monday–Sunday) for PT credits.
 */
export const getCreditPeriod = (
    creditType: CreditType,
    value: Date | string,
): CreditPeriod => {
    const date = value instanceof Date ? value : new Date(value);

    if (Number.isNaN(date.getTime())) {
        throw new TypeError(`Invalid date: ${String(value)}`);
    }

    const local = partsInTimeZone(date);

    if (creditType === "group") {
        const nextMonth =
            local.month === 12
                ? { year: local.year + 1, month: 1 }
                : { year: local.year, month: local.month + 1 };

        return {
            start: zonedMidnight(local.year, local.month, 1),
            end: new Date(
                zonedMidnight(nextMonth.year, nextMonth.month, 1).getTime() - 1,
            ),
        };
    }

    const localDate = Date.UTC(local.year, local.month - 1, local.day);
    const weekday = new Date(localDate).getUTCDay();
    const daysSinceMonday = (weekday + 6) % 7;
    const monday = new Date(localDate - daysSinceMonday * MS_PER_DAY);
    const nextMonday = new Date(monday.getTime() + 7 * MS_PER_DAY);

    return {
        start: zonedMidnight(
            monday.getUTCFullYear(),
            monday.getUTCMonth() + 1,
            monday.getUTCDate(),
        ),
        end: new Date(
            zonedMidnight(
                nextMonday.getUTCFullYear(),
                nextMonday.getUTCMonth() + 1,
                nextMonday.getUTCDate(),
            ).getTime() - 1,
        ),
    };
};
