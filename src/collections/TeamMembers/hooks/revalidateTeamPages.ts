import { revalidatePath } from "next/cache";
import type {
    BasePayload,
    CollectionAfterChangeHook,
    CollectionAfterDeleteHook,
    RequestContext,
} from "payload";
import type { TeamMember } from "../../../payload-types";

const revalidatePages = (
    doc: TeamMember,
    context: RequestContext,
    payload?: BasePayload
) => {
    if (!context.disableRevalidate) {
        const paths = ["/teams", "/home"];

        for (const path of paths) {
            if (payload) {
                payload.logger.info(`Revalidating page at path: ${path}`);
            }

            revalidatePath(path);
        }
    }

    return doc;
};

export const revalidateTeamPages: CollectionAfterChangeHook<TeamMember> = ({
    doc,
    previousDoc,
    req: { payload, context },
}) => {
    return revalidatePages(doc, context, payload);
};

export const revalidateTeamPagesDelete: CollectionAfterDeleteHook<
    TeamMember
> = ({ doc, req: { context } }) => {
    return revalidatePages(doc, context);
};
