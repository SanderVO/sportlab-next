import { getTvLessons } from "@/utilities/getTvLessons";
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

        const result = await getTvLessons(payload, {
            page,
        });

        return NextResponse.json({
            docs: result.docs,
            hasNextPage: result.hasNextPage,
            nextPage: result.nextPage,
            page: result.page,
        });
    } catch (error) {
        console.error("[tv-lessons]", error);

        return NextResponse.json(
            { error: "Kon lessen niet laden" },
            { status: 500 },
        );
    }
}
