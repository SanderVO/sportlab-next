import type { GlobalAfterChangeHook } from "payload";

import { revalidateTag } from "next/cache";
import { purgeCloudflareEverything } from "../../../utilities/purgeCloudflare";

export const revalidateHeader: GlobalAfterChangeHook = async ({
    doc,
    req: { payload, context },
}) => {
    if (!context.disableRevalidate) {
        payload.logger.info(`Revalidating header`);

        revalidateTag("global_header", "max");
        await purgeCloudflareEverything(payload.logger);
    }

    return doc;
};
