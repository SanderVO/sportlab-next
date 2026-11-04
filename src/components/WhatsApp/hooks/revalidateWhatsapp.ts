import type { GlobalAfterChangeHook } from "payload";

import { revalidateTag } from "next/cache";
import { purgeCloudflareEverything } from "../../../utilities/purgeCloudflare";

export const revalidateWhatsapp: GlobalAfterChangeHook = async ({
    doc,
    req: { payload, context },
}) => {
    if (!context.disableRevalidate) {
        payload.logger.info(`Revalidating WhatsApp`);

        revalidateTag("global_whatsApp", "max");
        await purgeCloudflareEverything(payload.logger);
    }

    return doc;
};
