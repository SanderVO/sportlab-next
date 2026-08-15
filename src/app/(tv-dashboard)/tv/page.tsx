import { TVLessonDashboard } from "@/components/TVLessonDashboard/TVLessonDashboard";
import {
    clampTvDateParam,
    getTvDateRange,
    getTvLessons,
    parseTvDateParam,
} from "@/utilities/getTvLessons";
import configPromise from "@payload-config";
import { redirect } from "next/navigation";
import { getPayload } from "payload";

type PageProps = {
    searchParams: Promise<{
        date?: string | string[];
    }>;
};

export const revalidate = 60;

export default async function TvDashboardPage({ searchParams }: PageProps) {
    const params = await searchParams;
    const rawDate = Array.isArray(params.date) ? params.date[0] : params.date;
    const range = getTvDateRange();

    if (!rawDate) {
        redirect(`/tv?date=${range.today}`);
    }

    const parsedDate = parseTvDateParam(rawDate);

    if (!parsedDate) {
        redirect(`/tv?date=${range.today}`);
    }

    const selectedDate = clampTvDateParam(parsedDate, range);

    if (selectedDate !== parsedDate) {
        redirect(`/tv?date=${selectedDate}`);
    }

    const payload = await getPayload({ config: configPromise });

    const lessonsResult = await getTvLessons(payload, {
        page: 1,
        dateParam: selectedDate,
    });

    return (
        <TVLessonDashboard
            lessons={lessonsResult.docs}
            initialHasNextPage={lessonsResult.hasNextPage}
            initialNextPage={lessonsResult.nextPage ?? null}
            selectedDate={selectedDate}
            minDate={range.min}
            maxDate={range.max}
        />
    );
}
