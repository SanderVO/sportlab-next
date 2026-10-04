import Papa from "papaparse";

export const LESSON_TYPES = ["pt", "semi_pt", "group", "open_gym"] as const;
export const LESSON_STATUSES = ["open", "closed"] as const;

export const CSV_HEADERS = [
    "title",
    "type",
    "status",
    "start_date",
    "end_date",
    "spots",
    "coaches",
    "block_name",
    "block_description",
    "block_duration",
    "exercise_name",
    "exercise_description",
] as const;

export const CSV_EXAMPLE = `${CSV_HEADERS.join(",")}
Friday Strength,group,open,2026-10-09T18:00,2026-10-09T19:00,12,coach@example.com|other@example.com,Warm-up,Get the joints moving,10,Jumping jacks,3 x 30 seconds
,,,,,,,Warm-up,,,Air squats,15 reps
,,,,,,,Main set,EMOM 20 minutes,20,Deadlift,5 reps @ 80%
,,,,,,,Main set,,,Pull-ups,Max reps
,,,,,,,Finisher,AMRAP 8 minutes,8,Burpees,
`;

/** Instructions that can be pasted into Claude (or another LLM) together with the template. */
export const LLM_INSTRUCTIONS = `Generate a Sportlab lesson as a CSV file (comma separated, UTF-8, first line is the header) using exactly these columns:

${CSV_HEADERS.join(",")}

Structure: one row per exercise. Lesson fields are read from the FIRST data row only (leave them empty on later rows). A lesson has one or more workout blocks, and each block has zero or more exercises.

Lesson columns (first data row only):
- title: lesson title (required)
- type: one of pt, semi_pt, group, open_gym (required)
- status: open or closed. Only used for group and open_gym; pt and semi_pt are always closed. Default: closed
- start_date, end_date: local date and time as YYYY-MM-DDTHH:mm, e.g. 2026-10-09T18:00 (optional)
- spots: whole number of available spots (optional)
- coaches: coach email addresses separated by | (optional)

Block columns:
- block_name: name of the workout block (required). A row with a new block_name starts a new block; empty block_name, or the same name as the previous row, adds the row to the current block
- block_description: description of the block (optional, taken from the block's first row)
- block_duration: duration in whole minutes (required, taken from the block's first row)

Exercise columns:
- exercise_name: name of the exercise (leave empty for a block without exercises)
- exercise_description: sets, reps, load, notes (optional)

Rules: wrap any value that contains a comma or a line break in double quotes.

Output (important): the result MUST be a real file, not text in the chat.
1. Use your code execution / file creation tool to write the CSV to a file named lesson-import.csv (UTF-8, comma separated). Write the file with code, for example Python's csv module, so quoting is correct.
2. Save it where downloads are offered (for example the outputs directory) and present it as a downloadable file or attachment.
3. Reply only with a one-line confirmation and the file. Do not paste the CSV content in the chat.
4. If you have no tool that can create a downloadable file, do not pretend to: say so in one sentence and then give the CSV in a single code block.

Example:
${CSV_EXAMPLE}`;

export type ParsedLesson = {
    title?: string;
    type?: (typeof LESSON_TYPES)[number];
    status?: (typeof LESSON_STATUSES)[number];
    startDate?: string;
    endDate?: string;
    spots?: number;
    coachEmails: string[];
    workoutBlocks: Array<{
        name: string;
        description: string;
        duration: number;
        exercises: Array<{ name: string; description: string }>;
    }>;
};

export type ParseResult =
    | { ok: true; lesson: ParsedLesson }
    | { ok: false; errors: string[] };

const toIsoDate = (value: string) => {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
};

export const parseLessonCsv = (
    text: string,
    options: { hasTemplate: boolean },
): ParseResult => {
    const errors: string[] = [];
    const parsed = Papa.parse<Record<string, string>>(
        text.replace(/^﻿/, ""),
        {
            header: true,
            skipEmptyLines: "greedy",
            transformHeader: (header) => header.trim().toLowerCase(),
        },
    );

    const missing = CSV_HEADERS.filter(
        (header) => !parsed.meta.fields?.includes(header),
    );
    if (missing.length > 0) {
        return {
            ok: false,
            errors: [`Missing column(s): ${missing.join(", ")}`],
        };
    }
    if (parsed.data.length === 0) {
        return { ok: false, errors: ["The file contains no data rows."] };
    }

    const rows = parsed.data.map((row) => {
        const clean: Record<string, string> = {};
        for (const header of CSV_HEADERS) {
            clean[header] = (row[header] ?? "").trim();
        }
        return clean;
    });

    const first = rows[0]!;
    const lesson: ParsedLesson = { coachEmails: [], workoutBlocks: [] };

    if (first.coaches) {
        lesson.coachEmails = first.coaches
            .split("|")
            .map((email) => email.trim().toLowerCase())
            .filter(Boolean);
    }

    if (!options.hasTemplate) {
        lesson.title = first.title;
        if (!lesson.title) errors.push("Row 1: title is required.");

        if (
            !LESSON_TYPES.includes(first.type as (typeof LESSON_TYPES)[number])
        ) {
            errors.push(
                `Row 1: type must be one of ${LESSON_TYPES.join(", ")}.`,
            );
        } else {
            lesson.type = first.type as (typeof LESSON_TYPES)[number];
        }

        if (lesson.type === "group" || lesson.type === "open_gym") {
            if (
                first.status &&
                !LESSON_STATUSES.includes(
                    first.status as (typeof LESSON_STATUSES)[number],
                )
            ) {
                errors.push(
                    `Row 1: status must be one of ${LESSON_STATUSES.join(", ")}.`,
                );
            } else {
                lesson.status =
                    (first.status as (typeof LESSON_STATUSES)[number]) ||
                    "closed";
            }
        } else if (lesson.type) {
            lesson.status = "closed";
        }

        for (const [column, key] of [
            ["start_date", "startDate"],
            ["end_date", "endDate"],
        ] as const) {
            if (!first[column]) continue;
            const iso = toIsoDate(first[column]);
            if (iso) lesson[key] = iso;
            else
                errors.push(
                    `Row 1: ${column} must look like 2026-10-09T18:00.`,
                );
        }

        if (first.spots) {
            const spots = Number(first.spots);
            if (Number.isInteger(spots) && spots >= 0) lesson.spots = spots;
            else errors.push("Row 1: spots must be a whole number.");
        }
    }

    let current: ParsedLesson["workoutBlocks"][number] | undefined;
    rows.forEach((row, index) => {
        const line = index + 1;

        if (row.block_name && row.block_name !== current?.name) {
            const duration = Number(row.block_duration);
            if (
                !row.block_duration ||
                !Number.isFinite(duration) ||
                duration < 0
            ) {
                errors.push(
                    `Row ${line}: block_duration (minutes) is required on the first row of block "${row.block_name}".`,
                );
            }
            current = {
                name: row.block_name,
                description: row.block_description,
                duration: Number.isFinite(duration) ? duration : 0,
                exercises: [],
            };
            lesson.workoutBlocks.push(current);
        }

        if (!current) {
            if (row.exercise_name || row.block_description) {
                errors.push(`Row ${line}: block_name is required.`);
            }
            return;
        }

        if (row.exercise_name) {
            current.exercises.push({
                name: row.exercise_name,
                description: row.exercise_description,
            });
        } else if (row.exercise_description) {
            errors.push(`Row ${line}: exercise_name is required.`);
        }
    });

    if (errors.length > 0) return { ok: false, errors };
    return { ok: true, lesson };
};
