import { getCachedTvLessons } from "@/utilities/getCachedTvLessons";
import { getTvDateRange, parseTvDateParam } from "@/utilities/getTvLessons";
import { NextRequest, NextResponse } from "next/server";

// Short edge cache: the TV polls this and lessons rarely change within a minute.
const TV_CACHE_CONTROL = "public, s-maxage=30, stale-while-revalidate=60";
const MAX_PAGE = 50;

export async function GET(request: NextRequest): Promise<NextResponse> {
    try {
        const pageParam = Number(
            request.nextUrl.searchParams.get("page") ?? "1",
        );
        const page =
            Number.isInteger(pageParam) && pageParam >= 1
                ? Math.min(pageParam, MAX_PAGE)
                : 1;
        const rawDate = request.nextUrl.searchParams.get("date");
        const range = getTvDateRange();
        const parsedDate = parseTvDateParam(rawDate);
        const selectedDate = parsedDate ?? range.today;

        const result = await getCachedTvLessons({
            page,
            dateParam: selectedDate,
        });

        return NextResponse.json(
            {
                docs: result.docs,
                hasNextPage: result.hasNextPage,
                nextPage: result.nextPage,
                page: result.page,
                date: selectedDate,
            },
            { headers: { "Cache-Control": TV_CACHE_CONTROL } },
        );
    } catch (error) {
        console.error("[tv-lessons]", error);

        return NextResponse.json(
            { error: "Kon lessen niet laden" },
            { status: 500 },
        );
    }
}
