import { BasePayload, PaginatedDocs } from "payload";

export async function buildFullSlug(
    page: PaginatedDocs["docs"][0],
    payload: BasePayload,
): Promise<string> {
    const segments = [page.slug];

    let current = page;

    while (current.parent) {
        // `parent` is an id, or a populated document depending on query depth.
        const parentId =
            typeof current.parent === "object"
                ? current.parent.id
                : current.parent;

        current = await payload.findByID({
            collection: "pages",
            id: parentId,
            depth: 0,
        });
        segments.unshift(current.slug);
    }

    return "/" + segments.join("/");
}
