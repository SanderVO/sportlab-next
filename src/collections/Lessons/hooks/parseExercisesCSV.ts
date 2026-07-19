import { BasePayload, CollectionBeforeChangeHook } from "payload";

function parseCSVText(csvText: string): Record<string, string>[] {
    const lines = csvText
        .trim()
        .split("\n")
        .filter((l) => l.trim());
    if (lines.length < 2) return [];

    const headers = lines[0]
        .split(",")
        .map((h) => h.trim().toLowerCase().replace(/^"|"$/g, ""));

    return lines.slice(1).map((line) => {
        const values: string[] = [];
        let current = "";
        let inQuotes = false;
        for (const ch of line) {
            if (ch === '"') {
                inQuotes = !inQuotes;
            } else if (ch === "," && !inQuotes) {
                values.push(current.trim());
                current = "";
            } else {
                current += ch;
            }
        }
        values.push(current.trim());

        return headers.reduce(
            (obj, header, i) => {
                obj[header] = (values[i] ?? "").replace(/^"|"$/g, "");
                return obj;
            },
            {} as Record<string, string>,
        );
    });
}

async function findOrCreateExercise(
    payload: BasePayload,
    req: Parameters<CollectionBeforeChangeHook>[0]["req"],
    exerciseName: string,
    externalId?: string,
): Promise<string | number> {
    if (externalId) {
        const existing = await payload.find({
            collection: "exercises",
            where: { externalId: { equals: externalId } },
            limit: 1,
            req,
        });
        if (existing.docs.length > 0) return existing.docs[0].id;

        const created = await payload.create({
            collection: "exercises",
            data: { name: exerciseName || externalId, externalId },
            req,
            overrideAccess: true,
        });
        return created.id;
    }

    const existing = await payload.find({
        collection: "exercises",
        where: { name: { equals: exerciseName } },
        limit: 1,
        req,
    });
    if (existing.docs.length > 0) return existing.docs[0].id;

    const created = await payload.create({
        collection: "exercises",
        data: { name: exerciseName },
        req,
        overrideAccess: true,
    });
    return created.id;
}

export const resolveExercises: CollectionBeforeChangeHook = async ({
    data,
    req,
    operation,
}) => {
    if (operation !== "create" && operation !== "update") {
        return data;
    }

    // --- 1. Parse CSV stored by the admin UI component and append to exercises ---
    if (
        typeof data?.exercisesCSVImport === "string" &&
        data.exercisesCSVImport.trim()
    ) {
        const rows = parseCSVText(data.exercisesCSVImport);
        const csvExercises: Array<{
            exercise: string | number;
            sets?: number;
            reps?: string;
            notes?: string;
        }> = [];

        for (const row of rows) {
            const name = row["exercise_name"] ?? "";
            const externalId = row["exercise_external_id"] || undefined;

            if (!name && !externalId) continue;

            const exerciseId = await findOrCreateExercise(
                req.payload,
                req,
                name,
                externalId,
            );

            const sets = row["sets"] ? parseInt(row["sets"], 10) : undefined;

            csvExercises.push({
                exercise: exerciseId,
                sets: Number.isNaN(sets) ? undefined : sets,
                reps: row["reps"] || undefined,
                notes: row["notes"] || undefined,
            });
        }

        const existing = Array.isArray(data.exercises) ? data.exercises : [];
        data = {
            ...data,
            exercises: [...existing, ...csvExercises],
            exercisesCSVImport: null,
        };
    }

    // --- 2. Resolve any exercises still referenced by string (externalId) ---
    if (!Array.isArray(data?.exercises) || data.exercises.length === 0) {
        return data;
    }

    const resolved = [];
    for (const item of data.exercises) {
        let exerciseId = item.exercise;

        if (typeof item.exercise === "string") {
            exerciseId = await findOrCreateExercise(
                req.payload,
                req,
                item.exercise_name || item.exercise,
                item.exercise,
            );
        }

        resolved.push({ ...item, exercise: exerciseId });
    }

    return { ...data, exercises: resolved };
};
