"use client";

import { useTranslation } from "@payloadcms/ui";
import React, { useCallback, useEffect, useState } from "react";

const messages = {
    en: {
        unknownError: "Unknown error",
        done: "Done.",
        failed: "Generation failed",
        generating: "Generating…",
        generate: "Generate lessons (next 31 days)",
    },
    nl: {
        unknownError: "Onbekende fout",
        done: "Klaar.",
        failed: "Genereren mislukt",
        generating: "Bezig met genereren…",
        generate: "Genereer lessen (komende 31 dagen)",
    },
};

type Status =
    | { type: "idle" }
    | { type: "loading" }
    | { type: "success"; message: string }
    | { type: "error"; message: string };

export const GenerateLessonsButton: React.FC = () => {
    const { i18n } = useTranslation();
    const m = i18n.language === "nl" ? messages.nl : messages.en;
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
            if (!res.ok) throw new Error(data.error ?? m.unknownError);
            setStatus({ type: "success", message: data.message ?? m.done });
        } catch (err) {
            setStatus({
                type: "error",
                message:
                    err instanceof Error ? err.message : m.failed,
            });
        }
    }, [m]);

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
                ? m.generating
                : status.type === "success" || status.type === "error"
                  ? status.message
                  : m.generate}
        </button>
    );
};
