"use client";

import { useField } from "@payloadcms/ui";
import React, { useCallback, useRef, useState } from "react";

type ParsedRow = {
    exercise_name?: string;
    exercise_external_id?: string;
    sets?: string;
    reps?: string;
    notes?: string;
};

function parseCSVText(csvText: string): ParsedRow[] {
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

        return headers.reduce((obj, header, i) => {
            (obj as Record<string, string>)[header] = (values[i] ?? "").replace(
                /^"|"$/g,
                "",
            );
            return obj;
        }, {} as ParsedRow);
    });
}

export const ExerciseImportField: React.FC = () => {
    const [preview, setPreview] = useState<ParsedRow[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    // Stores the raw CSV text in the form; the server-side hook processes it on save.
    const { setValue } = useField<string>({ path: "exercisesCSVImport" });

    const handleFileChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (event) => {
                const text = (event.target?.result as string) ?? "";
                const rows = parseCSVText(text);
                setValue(text);
                setPreview(rows);
            };
            reader.readAsText(file);
        },
        [setValue],
    );

    const handleClear = useCallback(() => {
        setValue("");
        setPreview([]);
        if (fileInputRef.current) fileInputRef.current.value = "";
    }, [setValue]);

    return (
        <div
            style={{
                padding: "1rem",
                border: "1px solid var(--theme-elevation-150, #e0e0e0)",
                borderRadius: "4px",
                marginBottom: "1rem",
            }}
        >
            <p
                style={{
                    fontWeight: 600,
                    marginTop: 0,
                    marginBottom: "0.5rem",
                    fontSize: "0.875rem",
                }}
            >
                Oefeningen importeren via CSV
            </p>
            <p
                style={{
                    fontSize: "0.8rem",
                    color: "var(--theme-elevation-450, #666)",
                    marginTop: 0,
                    marginBottom: "0.75rem",
                }}
            >
                Kolommen: <code>exercise_name</code>,{" "}
                <code>exercise_external_id</code> (optioneel), <code>sets</code>{" "}
                (optioneel), <code>reps</code> (optioneel), <code>notes</code>{" "}
                (optioneel). Oefeningen worden aangemaakt bij opslaan.
            </p>
            <input
                ref={fileInputRef}
                type="file"
                accept=".csv,text/csv"
                onChange={handleFileChange}
                style={{ display: "block", marginBottom: "0.75rem" }}
            />
            {preview.length > 0 && (
                <div>
                    <p
                        style={{
                            fontSize: "0.875rem",
                            fontWeight: 500,
                            margin: "0 0 0.5rem 0",
                        }}
                    >
                        Te importeren bij opslaan ({preview.length} oefeningen):
                    </p>
                    <ul
                        style={{
                            margin: "0 0 0.75rem 0",
                            paddingLeft: "1.25rem",
                            fontSize: "0.875rem",
                        }}
                    >
                        {preview.map((row, i) => {
                            const label =
                                row.exercise_name ||
                                row.exercise_external_id ||
                                `Rij ${i + 1}`;
                            const meta = [
                                row.sets ? `${row.sets} sets` : null,
                                row.reps ? `${row.reps} reps` : null,
                            ]
                                .filter(Boolean)
                                .join(", ");
                            return (
                                <li key={i}>
                                    {label}
                                    {meta ? (
                                        <span
                                            style={{
                                                color: "var(--theme-elevation-450, #666)",
                                                marginLeft: "0.5rem",
                                            }}
                                        >
                                            ({meta})
                                        </span>
                                    ) : null}
                                </li>
                            );
                        })}
                    </ul>
                    <button
                        type="button"
                        onClick={handleClear}
                        style={{
                            fontSize: "0.8rem",
                            padding: "0.25rem 0.75rem",
                            cursor: "pointer",
                        }}
                    >
                        Wis import
                    </button>
                </div>
            )}
        </div>
    );
};
