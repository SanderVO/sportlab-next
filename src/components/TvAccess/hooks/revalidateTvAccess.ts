import type { GlobalAfterChangeHook } from "payload";

import { revalidateTag } from "next/cache";

export const revalidateTvAccess: GlobalAfterChangeHook = ({
    doc,
    req: { payload, context },
}) => {
    if (!context.disableRevalidate) {
        payload.logger.info(`Revalidating TV access`);

        revalidateTag("global_tvAccess", "max");
    }

    return doc;
};
