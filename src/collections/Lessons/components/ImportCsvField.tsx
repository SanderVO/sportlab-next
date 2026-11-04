"use client";

import { useAllFormFields, useForm, useTranslation } from "@payloadcms/ui";
import React, { useRef, useState } from "react";
import {
    CSV_EXAMPLE,
    LLM_INSTRUCTIONS,
    parseLessonCsv,
} from "./lessonCsv";

const messages = {
    en: {
        title: "Import from CSV",
        description:
            "Fill this lesson, including its workout blocks, from a CSV file. Existing workout blocks are replaced. Nothing is saved until you save the lesson.",
        withTemplate:
            "A template is selected: only the coaches and workout blocks are imported.",
        import: "Import CSV",
        downloadTemplate: "Download CSV template",
        copyInstructions: "Copy AI instructions",
        copied: "Copied!",
        imported: "Imported. Review the fields and save the lesson.",
        unknownCoaches: "Coaches not found (skipped):",
        readFailed: "Could not read the file.",
    },
    nl: {
        title: "Importeren uit CSV",
        description:
            "Vul deze les, inclusief workoutblokken, vanuit een CSV-bestand. Bestaande workoutblokken worden vervangen. Er wordt niets opgeslagen totdat je de les opslaat.",
        withTemplate:
            "Er is een sjabloon geselecteerd: alleen de coaches en workoutblokken worden geïmporteerd.",
        import: "CSV importeren",
        downloadTemplate: "Download CSV-sjabloon",
        copyInstructions: "Kopieer AI-instructies",
        copied: "Gekopieerd!",
        imported:
            "Geïmporteerd. Controleer de velden en sla de les op.",
        unknownCoaches: "Coaches niet gevonden (overgeslagen):",
        readFailed: "Het bestand kon niet worden gelezen.",
    },
};

type Notice =
    | { type: "success"; lines: string[] }
    | { type: "error"; lines: string[] };

const buttonStyle: React.CSSProperties = {
    padding: "0.5rem 1rem",
    cursor: "pointer",
};

const download = (filename: string, content: string) => {
    const url = URL.createObjectURL(
        new Blob([content], { type: "text/csv;charset=utf-8" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
};

/**
 * Lets coaches fill the lesson form from a CSV file (one lesson per file, one row
 * per exercise). Only fields that are visible in the form are filled: with a
 * template selected, title / type / dates / spots come from the template.
 */
export const ImportCsvField: React.FC = () => {
    const { i18n } = useTranslation();
    const m = i18n.language === "nl" ? messages.nl : messages.en;
    const { getData, reset, setModified } = useForm();
    const [fields] = useAllFormFields();
    const inputRef = useRef<HTMLInputElement>(null);
    const [notice, setNotice] = useState<Notice | null>(null);
    const [copied, setCopied] = useState(false);

    const hasTemplate = Boolean(fields?.template?.value);

    const findCoachIds = async (emails: string[]) => {
        if (emails.length === 0) return { ids: [] as Array<string | number>, unknown: [] };

        const params = new URLSearchParams({
            "where[isCoach][equals]": "true",
            limit: "100",
            depth: "0",
        });
        emails.forEach((email, i) =>
            params.set(`where[email][in][${i}]`, email),
        );
        const res = await fetch(`/api/users?${params.toString()}`, {
            credentials: "include",
        });
        const json = res.ok ? await res.json() : { docs: [] };
        const docs = (json.docs ?? []) as Array<{
            id: string | number;
            email: string;
        }>;
        const found = new Map(docs.map((d) => [d.email.toLowerCase(), d.id]));

        return {
            ids: emails.flatMap((email) =>
                found.has(email) ? [found.get(email)!] : [],
            ),
            unknown: emails.filter((email) => !found.has(email)),
        };
    };

    const handleFile = async (file: File) => {
        setNotice(null);

        let text: string;
        try {
            text = await file.text();
        } catch {
            setNotice({ type: "error", lines: [m.readFailed] });
            return;
        }

        const result = parseLessonCsv(text, { hasTemplate });
        if (!result.ok) {
            setNotice({ type: "error", lines: result.errors });
            return;
        }
        const { lesson } = result;
        const { ids: coachIds, unknown } = await findCoachIds(
            lesson.coachEmails,
        );

        const updates: Record<string, unknown> = {
            title: lesson.title,
            type: lesson.type,
            status: lesson.status,
            startDate: lesson.startDate,
            endDate: lesson.endDate,
            spots: lesson.spots,
        };
        if (lesson.coachEmails.length > 0) updates.coaches = coachIds;

        // Rebuild the form on the server (like Payload's own form reset) so the
        // array rows get their custom row labels, e.g. the workout name.
        const data: Record<string, unknown> = {
            ...getData(),
        };
        for (const [path, value] of Object.entries(updates)) {
            if (value !== undefined) data[path] = value;
        }
        data.workoutBlocks = lesson.workoutBlocks;

        await reset(data);
        setModified(true);

        setNotice({
            type: "success",
            lines: [
                m.imported,
                ...(unknown.length > 0
                    ? [`${m.unknownCoaches} ${unknown.join(", ")}`]
                    : []),
            ],
        });
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(LLM_INSTRUCTIONS);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 3000);
        } catch {
            // clipboard unavailable
        }
    };

    return (
        <div className="field-type" style={{ marginBottom: "1.5rem" }}>
            <label className="field-label">{m.title}</label>
            <p style={{ margin: "0 0 0.5rem", opacity: 0.7 }}>
                {m.description}
                {hasTemplate ? ` ${m.withTemplate}` : ""}
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                <button
                    type="button"
                    style={buttonStyle}
                    onClick={() => inputRef.current?.click()}
                >
                    {m.import}
                </button>
                <button
                    type="button"
                    style={buttonStyle}
                    onClick={() =>
                        download("lesson-import-template.csv", CSV_EXAMPLE)
                    }
                >
                    {m.downloadTemplate}
                </button>
                <button type="button" style={buttonStyle} onClick={handleCopy}>
                    {copied ? m.copied : m.copyInstructions}
                </button>
                <input
                    ref={inputRef}
                    type="file"
                    accept=".csv,text/csv"
                    hidden
                    onChange={(event) => {
                        const file = event.target.files?.[0];
                        event.target.value = "";
                        if (file) void handleFile(file);
                    }}
                />
            </div>
            {notice && (
                <ul
                    style={{
                        margin: "0.5rem 0 0",
                        paddingLeft: "1.25rem",
                        color:
                            notice.type === "error"
                                ? "var(--theme-error-500)"
                                : "var(--theme-success-500)",
                    }}
                >
                    {notice.lines.map((line) => (
                        <li key={line}>{line}</li>
                    ))}
                </ul>
            )}
        </div>
    );
};
