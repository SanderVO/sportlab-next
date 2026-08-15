import {
    clampTvDateParam,
    getTvDateRange,
    getTvLessons,
    parseTvDateParam,
} from "@/utilities/getTvLessons";
import configPromise from "@payload-config";
import { NextRequest, NextResponse } from "next/server";
import { getPayload } from "payload";

export async function GET(request: NextRequest): Promise<NextResponse> {
    try {
        const payload = await getPayload({ config: configPromise });
        const pageParam = Number(
            request.nextUrl.searchParams.get("page") ?? "1",
        );
        const page = Number.isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;
        const rawDate = request.nextUrl.searchParams.get("date");
        const range = getTvDateRange();
        const parsedDate = parseTvDateParam(rawDate);
        const selectedDate = clampTvDateParam(parsedDate ?? range.today, range);

        const result = await getTvLessons(payload, {
            page,
            dateParam: selectedDate,
        });

        return NextResponse.json({
            docs: result.docs,
            hasNextPage: result.hasNextPage,
            nextPage: result.nextPage,
            page: result.page,
            date: selectedDate,
        });
    } catch (error) {
        console.error("[tv-lessons]", error);

        return NextResponse.json(
            { error: "Kon lessen niet laden" },
            { status: 500 },
        );
    }
}
