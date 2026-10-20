import { RolesEnum } from "@/collections/Users/roles";
import { APIError, type CollectionBeforeChangeHook } from "payload";
import { isLessonFull, isOccupyingStatus, lockLesson, toId } from "../waitlist";

/**
 * Keeps a lesson within its number of spots, and maintains the waitlist timestamps.
 * - Taking a spot (new enrollment, or leaving the waitlist/cancelled state) fails when the lesson is full.
 * - A member can only leave the waitlist after a spot was offered to them.
 */
export const enforceLessonCapacity: CollectionBeforeChangeHook = async ({
    data,
    originalDoc,
    operation,
    req,
}) => {
    const status: string = data.status ?? originalDoc?.status ?? "assigned";
    const previousStatus: string | undefined = originalDoc?.status;

    if (status === "waitlisted" && previousStatus !== "waitlisted") {
        data.waitlistedAt = new Date().toISOString();
        data.waitlistNotifiedAt = null;
    }

    if (!isOccupyingStatus(status) || isOccupyingStatus(previousStatus)) {
        return data;
    }

    const lessonId = toId(data.lesson ?? originalDoc?.lesson);

    if (!lessonId) return data;

    const roles = Array.isArray(req.user?.roles) ? req.user.roles : [];
    const isStaff =
        roles.includes(RolesEnum.ADMIN) || roles.includes(RolesEnum.COACH);

    if (
        !isStaff &&
        operation === "update" &&
        previousStatus === "waitlisted" &&
        !originalDoc?.waitlistNotifiedAt
    ) {
        throw new APIError(
            "Er is nog geen plek voor je vrijgekomen.",
            400,
            undefined,
            true,
        );
    }

    // Serialize claims per lesson so two people can't both take the last spot.
    const context = { payload: req.payload, req };

    await lockLesson(context, lessonId);

    if (await isLessonFull(context, lessonId, toId(originalDoc?.id))) {
        throw new APIError(
            "Deze les is vol. Je kunt je op de wachtlijst zetten.",
            400,
            undefined,
            true,
        );
    }

    return data;
};
