import { revalidateTag } from "next/cache";
import { purgeCloudflareEverything } from "../../../utilities/purgeCloudflare";
import type { GlobalAfterChangeHook } from "payload";

export const revalidateOrganization: GlobalAfterChangeHook = async ({
    doc,
    req: { payload, context },
}) => {
    if (!context.disableRevalidate) {
        payload.logger.info(`Revalidating Organization`);

        revalidateTag("global_organization", "max");
        await purgeCloudflareEverything(payload.logger);
    }

    return doc;
};
