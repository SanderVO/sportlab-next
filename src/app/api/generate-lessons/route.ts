import { generateLessons } from "@/utilities/generateLessons";
import config from "@payload-config";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { getPayload } from "payload";

export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        const payload = await getPayload({ config });

        // Allow admin users (from the Payload session) or a CRON_SECRET bearer token
        const reqHeaders = await headers();
        const { user } = await payload.auth({ headers: reqHeaders });
        const isAdmin = (user as { role?: string } | null)?.role === "ADMIN";

        const authHeader = req.headers.get("Authorization");
        const cronSecret = process.env.CRON_SECRET;
        const hasCronSecret =
            !!cronSecret && authHeader === `Bearer ${cronSecret}`;

        if (!isAdmin && !hasCronSecret) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 },
            );
        }

        const body = (await req.json().catch(() => ({}))) as {
            daysAhead?: number;
        };

        const daysAhead =
            typeof body?.daysAhead === "number" ? body.daysAhead : 31;

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
