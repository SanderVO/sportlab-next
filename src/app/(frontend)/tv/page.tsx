import { TVLessonDashboard } from "@/components/TVLessonDashboard/TVLessonDashboard";
import {
    getTvDateRange,
    parseTvDateParam,
} from "@/utilities/getTvLessons";
import { getCachedTvLessons } from "@/utilities/getCachedTvLessons";
import { redirect } from "next/navigation";

type PageProps = {
    searchParams: Promise<{
        date?: string | string[];
    }>;
};

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

    const selectedDate = parsedDate;

    const lessonsResult = await getCachedTvLessons({
        page: 1,
        dateParam: selectedDate,
    });

    return (
        <TVLessonDashboard
            key={selectedDate}
            lessons={lessonsResult.docs}
            initialHasNextPage={lessonsResult.hasNextPage}
            initialNextPage={lessonsResult.nextPage ?? null}
            selectedDate={selectedDate}
        />
    );
}
