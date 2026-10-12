import { getCachedTvMonthSummary } from "@/utilities/getCachedTvLessons";
import { parseTvMonthParam } from "@/utilities/getTvLessons";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest): Promise<NextResponse> {
    const month = parseTvMonthParam(request.nextUrl.searchParams.get("month"));

    if (!month) {
        return NextResponse.json({ error: "Ongeldige maand" }, { status: 400 });
    }

    try {
        return NextResponse.json(
            { month, days: await getCachedTvMonthSummary(month) },
            {
                headers: {
                    "Cache-Control":
                        "public, s-maxage=60, stale-while-revalidate=300",
                },
            },
        );
    } catch (error) {
        console.error("[tv-lesson-summary]", error);

        return NextResponse.json(
            { error: "Kon lessen niet laden" },
            { status: 500 },
        );
    }
}
