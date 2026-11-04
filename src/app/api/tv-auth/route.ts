import {
    TV_ACCESS_COOKIE,
    createTvAccessToken,
    getTvAccessSettings,
    isValidTvPin,
} from "@/utilities/tvAccess";
import { NextRequest, NextResponse } from "next/server";

// A 4-digit PIN has 10,000 combinations, so limit guesses per IP. In-memory: resets on
// restart and is per instance, which is fine as a deterrent.
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;
const LOCKOUT_MS = 60 * 1000;
const attempts = new Map<string, { count: number; resetAt: number }>();

const COOKIE_MAX_AGE = 60 * 60 * 24 * 365 * 5;

function getClientIp(request: NextRequest): string {
    return (
        request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        request.headers.get("x-real-ip") ||
        "unknown"
    );
}

export async function POST(request: NextRequest): Promise<NextResponse> {
    const ip = getClientIp(request);
    const now = Date.now();

    for (const [key, entry] of attempts) {
        if (entry.resetAt <= now) {
            attempts.delete(key);
        }
    }

    const entry = attempts.get(ip);

    if (entry && entry.count >= MAX_ATTEMPTS) {
        return NextResponse.json(
            {
                error: "Te veel pogingen. Probeer het later opnieuw.",
                retryAfter: Math.ceil((entry.resetAt - now) / 1000),
            },
            {
                status: 429,
                headers: {
                    "Retry-After": String(
                        Math.ceil((entry.resetAt - now) / 1000),
                    ),
                },
            },
        );
    }

    const body = (await request.json().catch(() => null)) as {
        pin?: unknown;
    } | null;
    const input = typeof body?.pin === "string" ? body.pin : "";
    const { enabled, pin } = await getTvAccessSettings();

    if (!enabled) {
        return NextResponse.json({ ok: true });
    }

    if (!isValidTvPin(input, pin)) {
        const count = (entry?.count ?? 0) + 1;

        // The last wrong try starts a short lockout instead of a long window.
        attempts.set(ip, {
            count,
            resetAt:
                count >= MAX_ATTEMPTS
                    ? now + LOCKOUT_MS
                    : (entry?.resetAt ?? now + WINDOW_MS),
        });

        if (count >= MAX_ATTEMPTS) {
            return NextResponse.json(
                {
                    error: "Te veel pogingen. Probeer het later opnieuw.",
                    retryAfter: LOCKOUT_MS / 1000,
                },
                {
                    status: 429,
                    headers: { "Retry-After": String(LOCKOUT_MS / 1000) },
                },
            );
        }

        return NextResponse.json(
            {
                error: "Onjuiste pincode",
                attemptsLeft: MAX_ATTEMPTS - count,
            },
            { status: 401 },
        );
    }

    attempts.delete(ip);

    const response = NextResponse.json({ ok: true });

    response.cookies.set(TV_ACCESS_COOKIE, createTvAccessToken(pin), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: COOKIE_MAX_AGE,
    });

    return response;
}
