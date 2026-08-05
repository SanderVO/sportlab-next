"use client";

import React, { useCallback, useEffect, useState } from "react";

type Status =
    | { type: "idle" }
    | { type: "loading" }
    | { type: "success"; message: string }
    | { type: "error"; message: string };

export const GenerateLessonsButton: React.FC = () => {
    const [status, setStatus] = useState<Status>({ type: "idle" });

    useEffect(() => {
        if (status.type !== "success" && status.type !== "error") return;

        const timeoutId = window.setTimeout(() => {
            setStatus({ type: "idle" });
        }, 5000);

        return () => {
            window.clearTimeout(timeoutId);
        };
    }, [status]);

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
        <button
            type="button"
            onClick={handleGenerate}
            disabled={status.type === "loading"}
            style={{
                padding: "0.5rem 1rem",
                cursor: status.type === "loading" ? "not-allowed" : "pointer",
                opacity: status.type === "loading" ? 0.6 : 1,
                backgroundColor:
                    status.type === "success"
                        ? "var(--color-success-500, #27ae60)"
                        : status.type === "error"
                          ? "var(--color-error-500, #c0392b)"
                          : undefined,
                color:
                    status.type === "success" || status.type === "error"
                        ? "#ffffff"
                        : undefined,
                border:
                    status.type === "success" || status.type === "error"
                        ? "none"
                        : undefined,
            }}
        >
            {status.type === "loading"
                ? "Bezig met genereren…"
                : status.type === "success" || status.type === "error"
                  ? status.message
                  : "Genereer lessen (komende 31 dagen)"}
        </button>
    );
};
