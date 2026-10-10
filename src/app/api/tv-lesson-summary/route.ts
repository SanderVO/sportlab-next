import { getTvMonthSummary, parseTvMonthParam } from "@/utilities/getTvLessons";
import configPromise from "@payload-config";
import { NextRequest, NextResponse } from "next/server";
import { getPayload } from "payload";

export async function GET(request: NextRequest): Promise<NextResponse> {
    const month = parseTvMonthParam(request.nextUrl.searchParams.get("month"));

    if (!month) {
        return NextResponse.json({ error: "Ongeldige maand" }, { status: 400 });
    }

    try {
        const payload = await getPayload({ config: configPromise });

        return NextResponse.json({
            month,
            days: await getTvMonthSummary(payload, month),
        });
    } catch (error) {
        console.error("[tv-lesson-summary]", error);

        return NextResponse.json(
            { error: "Kon lessen niet laden" },
            { status: 500 },
        );
    }
}
