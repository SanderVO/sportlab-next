import { TV_LESSONS_TAG } from "@/utilities/getCachedTvLessons";
import { revalidateTag } from "next/cache";
import type {
    CollectionAfterChangeHook,
    CollectionAfterDeleteHook,
} from "payload";

export const revalidateTvLessonsOnChange: CollectionAfterChangeHook = ({
    doc,
    req: { context },
}) => {
    if (!context.disableRevalidate) revalidateTag(TV_LESSONS_TAG, "max");

    return doc;
};

export const revalidateTvLessonsOnDelete: CollectionAfterDeleteHook = ({
    doc,
    req: { context },
}) => {
    if (!context.disableRevalidate) revalidateTag(TV_LESSONS_TAG, "max");

    return doc;
};
