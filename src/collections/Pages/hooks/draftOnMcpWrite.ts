import type { CollectionBeforeOperationHook } from "payload";

/**
 * Pages created or updated through the MCP endpoint are saved as a draft (concept), never straight
 * as a published page. A person reviews and publishes the draft in the CMS. This is enforced here
 * instead of trusting the client to pass `draft: true`.
 */
export const draftOnMcpWrite: CollectionBeforeOperationHook<"pages"> = ({
    args,
    operation,
    req,
}) => {
    if (
        (operation === "create" || operation === "update") &&
        req.payloadAPI === "MCP"
    ) {
        return { ...args, draft: true };
    }

    return args;
};
