/** The ID of a relationship value, whether Payload gave us an ID or a populated doc. */
export const relationshipID = (value: unknown): number | string | null => {
    if (value === null || value === undefined) return null;
    if (typeof value === "object" && "id" in value) {
        return (value as { id: number | string }).id;
    }

    return value as number | string;
};
