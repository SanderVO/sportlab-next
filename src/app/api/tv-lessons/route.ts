import { getCachedTvLessons } from "@/utilities/getCachedTvLessons";
import { getTvDateRange, parseTvDateParam } from "@/utilities/getTvLessons";
import { hasTvAccess } from "@/utilities/tvAccess";
import { NextRequest, NextResponse } from "next/server";

// Short browser cache: the TV polls this and lessons rarely change within a minute.
// Private so a shared CDN never serves it to clients without the PIN cookie.
const TV_CACHE_CONTROL = "private, max-age=30";
const MAX_PAGE = 50;

export async function GET(request: NextRequest): Promise<NextResponse> {
    if (!(await hasTvAccess())) {
        return NextResponse.json({ error: "Geen toegang" }, { status: 401 });
    }

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
