import configPromise from "@payload-config";
import { unstable_cache } from "next/cache";
import { getPayload } from "payload";
import { getTvLessons, getTvMonthSummary } from "./getTvLessons";

export const TV_LESSONS_TAG = "tv-lessons";

// Tagged so saving or deleting a lesson refreshes the TV right away; the short
// window only covers edits that don't touch a lesson (e.g. a coach renamed).
const REVALIDATE_SECONDS = 300;

export const getCachedTvLessons = (args: { page: number; dateParam: string }) =>
    unstable_cache(
        async () =>
            getTvLessons(await getPayload({ config: configPromise }), args),
        ["tv-lessons", args.dateParam, String(args.page)],
        { tags: [TV_LESSONS_TAG], revalidate: REVALIDATE_SECONDS },
    )();

export const getCachedTvMonthSummary = (month: string) =>
    unstable_cache(
        async () =>
            getTvMonthSummary(
                await getPayload({ config: configPromise }),
                month,
            ),
        ["tv-lesson-summary", month],
        { tags: [TV_LESSONS_TAG], revalidate: REVALIDATE_SECONDS },
    )();
