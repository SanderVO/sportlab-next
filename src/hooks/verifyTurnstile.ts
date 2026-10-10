import { APIError, type CollectionBeforeValidateHook } from "payload";
import { TURNSTILE_HEADER } from "./turnstileHeader";

const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

/**
 * Rejects public form submissions that don't carry a valid Cloudflare Turnstile token.
 * Fails closed in production when TURNSTILE_SECRET_KEY is missing; skipped in development.
 */
export const verifyTurnstile: CollectionBeforeValidateHook = async ({
    data,
    operation,
    req,
}) => {
    // Server-side code (seeds, imports) creates submissions through the local API.
    if (operation !== "create" || req.payloadAPI === "local") return data;

    const secret = process.env.TURNSTILE_SECRET_KEY;

    if (!secret) {
        if (process.env.NODE_ENV === "production") {
            req.payload.logger.error(
                "TURNSTILE_SECRET_KEY is not set: rejecting form submission",
            );
            throw new APIError("Formulier tijdelijk niet beschikbaar.", 503);
        }

        return data;
    }

    const token = req.headers.get(TURNSTILE_HEADER);

    if (!token) {
        throw new APIError("Bevestig dat je geen robot bent.", 400);
    }

    const body = new URLSearchParams({ secret, response: token });
    const ip =
        req.headers.get("cf-connecting-ip") ??
        req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();

    if (ip) body.set("remoteip", ip);

    let success = false;

    try {
        const res = await fetch(VERIFY_URL, {
            method: "POST",
            body,
            signal: AbortSignal.timeout(5000),
        });

        success = res.ok && Boolean((await res.json()).success);
    } catch (error) {
        req.payload.logger.error(
            { err: error },
            "Turnstile verification failed",
        );
    }

    if (!success) {
        throw new APIError("Verificatie mislukt, probeer het opnieuw.", 400);
    }

    return data;
};
