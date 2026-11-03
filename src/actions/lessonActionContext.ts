import { languageOf, message } from "@/utilities/messages";
import config from "@payload-config";
import { headers } from "next/headers";
import { APIError, getPayload } from "payload";

export type ActionResult = { ok: true } | { ok: false; error: string };

/** The Payload instance, the signed-in user and the language to answer them in. */
export const getLessonActionContext = async () => {
    const payload = await getPayload({ config });
    const requestHeaders = await headers();
    const { user } = await payload.auth({ headers: requestHeaders });

    return { payload, user, language: languageOf(user, requestHeaders) };
};

/** An error for the user: what a hook refused with, or a generic message for anything else. */
export const actionError = (
    error: unknown,
    language: ReturnType<typeof languageOf>,
): ActionResult => ({
    ok: false,
    error:
        error instanceof APIError && error.isPublic
            ? error.message
            : message(language, "genericError"),
});
