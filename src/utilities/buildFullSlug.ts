import { BasePayload, PaginatedDocs } from "payload";

export async function buildFullSlug(
    page: PaginatedDocs["docs"][0],
    payload: BasePayload,
): Promise<string> {
    const segments = [page.slug];

    let current = page;

    while (current.parent) {
        current = await payload.findByID({
            collection: "pages",
            id: current.parent,
        });
        segments.unshift(current.slug);
    }

    return "/" + segments.join("/");
}
