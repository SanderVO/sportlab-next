import type { CollectionBeforeOperationHook } from "payload";

/**
 * Updates made through the MCP endpoint are saved as a draft version, never straight onto the
 * published page. A person reviews and publishes the draft in the CMS. This is enforced here
 * instead of trusting the client to pass `draft: true`.
 */
export const draftOnMcpUpdate: CollectionBeforeOperationHook<"pages"> = ({
    args,
    operation,
    req,
}) => {
    if (operation === "update" && req.payloadAPI === "MCP") {
        return { ...args, draft: true };
    }

    return args;
};
