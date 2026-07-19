"use client";

import React, { useCallback, useState } from "react";

type Status =
    | { type: "idle" }
    | { type: "loading" }
    | { type: "success"; message: string }
    | { type: "error"; message: string };

export const GenerateLessonsButton: React.FC = () => {
    const [status, setStatus] = useState<Status>({ type: "idle" });

    const handleGenerate = useCallback(async () => {
        setStatus({ type: "loading" });
        try {
            const res = await fetch("/api/generate-lessons", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ daysAhead: 31 }),
                credentials: "include",
            });
            const data = (await res.json()) as {
                message?: string;
                error?: string;
            };
            if (!res.ok) throw new Error(data.error ?? "Onbekende fout");
            setStatus({ type: "success", message: data.message ?? "Klaar." });
        } catch (err) {
            setStatus({
                type: "error",
                message:
                    err instanceof Error ? err.message : "Genereren mislukt",
            });
        }
    }, []);

    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                padding: "0.75rem 0",
            }}
        >
            <button
                type="button"
                onClick={handleGenerate}
                disabled={status.type === "loading"}
                style={{
                    padding: "0.5rem 1rem",
                    cursor:
                        status.type === "loading" ? "not-allowed" : "pointer",
                    opacity: status.type === "loading" ? 0.6 : 1,
                }}
            >
                {status.type === "loading"
                    ? "Bezig met genereren…"
                    : "Genereer lessen (komende 31 dagen)"}
            </button>
            {status.type === "success" && (
                <span
                    style={{
                        color: "var(--color-success-500, #27ae60)",
                        fontSize: "0.875rem",
                    }}
                >
                    {status.message}
                </span>
            )}
            {status.type === "error" && (
                <span
                    style={{
                        color: "var(--color-error-500, #c0392b)",
                        fontSize: "0.875rem",
                    }}
                >
                    {status.message}
                </span>
            )}
        </div>
    );
};
