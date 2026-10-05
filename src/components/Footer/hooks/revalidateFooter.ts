import type { GlobalAfterChangeHook } from "payload";

import { revalidateTag } from "next/cache";
import { purgeCloudflareEverything } from "../../../utilities/purgeCloudflare";

export const revalidateFooter: GlobalAfterChangeHook = async ({
    doc,
    req: { payload, context },
}) => {
    if (!context.disableRevalidate) {
        payload.logger.info(`Revalidating footer`);

        revalidateTag("global_footer", "max");
        await purgeCloudflareEverything(payload.logger);
    }

    return doc;
};
