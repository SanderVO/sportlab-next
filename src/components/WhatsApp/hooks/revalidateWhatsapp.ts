import type { GlobalAfterChangeHook } from "payload";

import { revalidateTag } from "next/cache";

export const revalidateWhatsapp: GlobalAfterChangeHook = ({
    doc,
    req: { payload, context },
}) => {
    if (!context.disableRevalidate) {
        payload.logger.info(`Revalidating WhatsApp`);

        revalidateTag("global_whatsApp", {});
    }

    return doc;
};
