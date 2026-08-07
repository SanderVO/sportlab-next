import { TVLessonDashboard } from "@/components/TVLessonDashboard/TVLessonDashboard";
import { getTvLessons } from "@/utilities/getTvLessons";
import configPromise from "@payload-config";
import { getPayload } from "payload";

type PageProps = Record<string, never>;

export const revalidate = 60;

export default async function TvDashboardPage(_: PageProps) {
    const payload = await getPayload({ config: configPromise });

    const lessonsResult = await getTvLessons(payload, {
        page: 1,
    });

    return (
        <TVLessonDashboard
            lessons={lessonsResult.docs}
            initialHasNextPage={lessonsResult.hasNextPage}
            initialNextPage={lessonsResult.nextPage ?? null}
        />
    );
}
