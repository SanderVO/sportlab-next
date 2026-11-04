import { userHasAdminAccess } from "@/access/admin";
import { generateLessons } from "@/utilities/generateLessons";
import config from "@payload-config";
import { timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import type { PayloadRequest } from "payload";
import { getPayload } from "payload";

const MAX_DAYS_AHEAD = 120;

const isValidCronSecret = (header: string | null): boolean => {
    const secret = process.env.CRON_SECRET;

    if (!secret || !header) return false;

    const expected = Buffer.from(`Bearer ${secret}`);
    const received = Buffer.from(header);

    return (
        expected.length === received.length &&
        timingSafeEqual(expected, received)
    );
};

export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        const payload = await getPayload({ config });

        // Allow admin users (from the Payload session) or a CRON_SECRET bearer token
        const { user } = await payload.auth({
            req: req as unknown as PayloadRequest,
            headers: req.headers,
        });
        const isAdmin = await userHasAdminAccess({
            payload,
            user,
        });

        const hasCronSecret = isValidCronSecret(
            req.headers.get("Authorization"),
        );

        if (!isAdmin && !hasCronSecret) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 },
            );
        }

        const body = (await req.json().catch(() => ({}))) as {
            daysAhead?: number;
        };

        const requested =
            typeof body?.daysAhead === "number" &&
            Number.isFinite(body.daysAhead)
                ? Math.floor(body.daysAhead)
                : 31;
        const daysAhead = Math.min(Math.max(requested, 1), MAX_DAYS_AHEAD);

        const result = await generateLessons(payload, daysAhead);

        return NextResponse.json({
            ok: true,
            created: result.created,
            skipped: result.skipped,
            message: `${result.created} lessen aangemaakt, ${result.skipped} overgeslagen.`,
        });
    } catch (err) {
        console.error("[generate-lessons]", err);
        return NextResponse.json(
            { error: "Genereren mislukt" },
            { status: 500 },
        );
    }
}
