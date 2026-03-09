import { revalidateTag } from "next/cache";
import type { GlobalAfterChangeHook } from "payload";

export const revalidateOrganization: GlobalAfterChangeHook = ({
    doc,
    req: { payload, context },
}) => {
    if (!context.disableRevalidate) {
        payload.logger.info(`Revalidating Organization`);

        revalidateTag("global_organization");
    }

    return doc;
};
