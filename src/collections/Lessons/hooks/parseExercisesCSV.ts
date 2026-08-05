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

    const workoutBlocks = Array.isArray(data?.workoutBlocks)
        ? data.workoutBlocks
        : [];
    const firstBlock = workoutBlocks[0];
    const firstWorkoutId =
        typeof firstBlock?.workout === "object"
            ? firstBlock.workout?.id
            : firstBlock?.workout;

    // --- 1. Parse CSV stored by the admin UI component and append to exercises ---
    if (
        typeof data?.exercisesCSVImport === "string" &&
        data.exercisesCSVImport.trim()
    ) {
        if (!firstWorkoutId) {
            throw new Error(
                "Selecteer eerst minimaal 1 workout voordat je oefeningen via CSV importeert.",
            );
        }

        const rows = parseCSVText(data.exercisesCSVImport);
        const csvExercises: Array<{
            exercise: string | number;
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

            csvExercises.push({
                exercise: exerciseId,
            });
        }

        const existingFirstExercises = Array.isArray(firstBlock?.exercises)
            ? firstBlock.exercises
            : [];
        const updatedBlocks = [...workoutBlocks];
        updatedBlocks[0] = {
            ...firstBlock,
            exercises: [...existingFirstExercises, ...csvExercises],
        };

        data = {
            ...data,
            workoutBlocks: updatedBlocks,
            exercisesCSVImport: null,
        };
    }

    // --- 2. Resolve exercises in each workout block ---
    if (
        !Array.isArray(data?.workoutBlocks) ||
        data.workoutBlocks.length === 0
    ) {
        return data;
    }

    const resolvedBlocks = [];
    for (const block of data.workoutBlocks) {
        const workoutId =
            typeof block?.workout === "object"
                ? block.workout?.id
                : block?.workout;

        if (!workoutId) {
            if (Array.isArray(block?.exercises) && block.exercises.length > 0) {
                throw new Error(
                    "Elke workoutblok met oefeningen moet een workout hebben.",
                );
            }

            resolvedBlocks.push(block);
            continue;
        }

        const blockExercises = Array.isArray(block?.exercises)
            ? block.exercises
            : [];

        const resolvedExercises = [];
        for (const item of blockExercises) {
            let exerciseId = item.exercise;

            if (typeof item.exercise === "string") {
                exerciseId = await findOrCreateExercise(
                    req.payload,
                    req,
                    item.exercise_name || item.exercise,
                    item.exercise,
                );
            }

            resolvedExercises.push({ ...item, exercise: exerciseId });
        }

        resolvedBlocks.push({
            ...block,
            workout: workoutId,
            exercises: resolvedExercises,
        });
    }

    return { ...data, workoutBlocks: resolvedBlocks };
};
