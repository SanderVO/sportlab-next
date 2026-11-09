import { rolesOf } from "@/access/rolesOf";
import { RolesEnum } from "@/collections/Users/roles";
import type { CollectionSlug, PayloadRequest } from "payload";
import { getPayload } from "payload";

import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

import configPromise from "@payload-config";

export async function GET(req: NextRequest): Promise<Response> {
    const payload = await getPayload({ config: configPromise });

    const { searchParams } = new URL(req.url);

    const path = searchParams.get("path");
    const collection = searchParams.get("collection") as CollectionSlug;
    const slug = searchParams.get("slug");
    const previewSecret = searchParams.get("previewSecret");
    const expectedPreviewSecret = process.env.PREVIEW_SECRET;

    // An unset or empty PREVIEW_SECRET is not a secret: reject both instead of
    // letting "?previewSecret=" match an empty configured value.
    if (!expectedPreviewSecret || previewSecret !== expectedPreviewSecret) {
        return new Response("You are not allowed to preview this page", {
            status: 403,
        });
    }

    if (!path || !collection || !slug) {
        return new Response("Insufficient search params", { status: 404 });
    }

    // "//host" and "/\\host" are protocol-relative and would redirect off-site.
    if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) {
        return new Response(
            "This endpoint can only be used for relative previews",
            { status: 400 },
        );
    }

    let user;

    try {
        ({ user } = await payload.auth({
            req: req as unknown as PayloadRequest,
            headers: req.headers,
        }));
    } catch (error) {
        payload.logger.error(
            { err: error },
            "Error verifying token for live preview",
        );
        return new Response("You are not allowed to preview this page", {
            status: 403,
        });
    }

    const draft = await draftMode();

    if (!user) {
        draft.disable();
        return new Response("You are not allowed to preview this page", {
            status: 403,
        });
    }

    // Draft mode bypasses the published-only read filter, so only content staff
    // (not ordinary members) may enable it.
    const roles = rolesOf(user);

    if (
        !roles.includes(RolesEnum.ADMIN) &&
        !roles.includes(RolesEnum.EDITOR)
    ) {
        draft.disable();
        return new Response("You are not allowed to preview this page", {
            status: 403,
        });
    }

    draft.enable();

    redirect(path);
}
