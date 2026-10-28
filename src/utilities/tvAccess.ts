import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import type { TvAccess } from "@/payload-types";
import { getCachedGlobal } from "./getGlobals";

export const TV_ACCESS_COOKIE = "tv_access";

const sign = (pin: string) =>
    createHmac("sha256", process.env.PAYLOAD_SECRET || "ignore")
        .update(`tv-access:${pin}`)
        .digest("hex");

const safeEqual = (a: string, b: string) => {
    const bufA = Buffer.from(a);
    const bufB = Buffer.from(b);

    return bufA.length === bufB.length && timingSafeEqual(bufA, bufB);
};

export async function getTvAccessSettings() {
    const { enabled, pin } = (await getCachedGlobal("tvAccess")) as TvAccess;

    return { enabled: Boolean(enabled) && Boolean(pin), pin: pin ?? "" };
}

/** Cookie value bound to the current PIN, so changing the PIN invalidates every unlocked TV. */
export const createTvAccessToken = (pin: string) => sign(pin);

export const isValidTvPin = (input: string, pin: string) =>
    /^\d{4}$/.test(input) && safeEqual(input, pin);

/** True when the PIN gate is off, or the request carries a cookie for the current PIN. */
export async function hasTvAccess(): Promise<boolean> {
    const { enabled, pin } = await getTvAccessSettings();

    if (!enabled) {
        return true;
    }

    const token = (await cookies()).get(TV_ACCESS_COOKIE)?.value;

    return Boolean(token) && safeEqual(token as string, sign(pin));
}
