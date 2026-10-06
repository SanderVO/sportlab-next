"use client";

import { cn } from "@/utilities/ui";
import { forwardRef, useCallback, useEffect, useRef, useState } from "react";

export type WorkoutBlock = {
    id?: string | null;
    name: string;
    description?: string | null;
    duration?: number | null;
    exercises?: Array<{
        id?: string | null;
        name: string;
        description?: string | null;
    }> | null;
};

const COLUMNS = 3;

// Back-button key codes sent by TV remotes (Tizen, webOS) besides Escape.
const BACK_KEY_CODES = new Set([10009, 461]);

function isBackKey(event: KeyboardEvent) {
    return (
        event.key === "Escape" ||
        event.key === "Backspace" ||
        event.key === "BrowserBack" ||
        event.key === "GoBack" ||
        BACK_KEY_CODES.has(event.keyCode)
    );
}

export function WorkoutBlocks({ blocks }: { blocks: WorkoutBlock[] }) {
    const blockRefs = useRef<Array<HTMLButtonElement | null>>([]);
    const closeRef = useRef<HTMLButtonElement | null>(null);
    const timerRef = useRef<HTMLButtonElement | null>(null);
    const scrollRef = useRef<HTMLDivElement | null>(null);
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const lastIndexRef = useRef(0);

    const close = useCallback(() => {
        setOpenIndex(null);
        // Give focus back to the block that was opened so remote navigation continues from it
        requestAnimationFrame(() =>
            blockRefs.current[lastIndexRef.current]?.focus(),
        );
    }, []);

    const open = (index: number) => {
        lastIndexRef.current = index;
        setOpenIndex(index);
    };

    useEffect(() => {
        if (openIndex !== null) {
            (timerRef.current ?? closeRef.current)?.focus();
        }
    }, [openIndex]);

    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            if (openIndex !== null) {
                if (isBackKey(event)) {
                    event.preventDefault();
                    close();
                } else if (event.key === "ArrowUp" || event.key === "ArrowDown") {
                    event.preventDefault();
                    scrollRef.current?.scrollBy({
                        top: event.key === "ArrowUp" ? -300 : 300,
                        behavior: "smooth",
                    });
                } else if (
                    (event.key === "ArrowLeft" || event.key === "ArrowRight") &&
                    timerRef.current
                ) {
                    // Switch between the close button and the timer
                    event.preventDefault();
                    (document.activeElement === timerRef.current
                        ? closeRef.current
                        : timerRef.current
                    )?.focus();
                }
                return;
            }

            const current = blockRefs.current.findIndex(
                (element) => element === document.activeElement,
            );
            const steps: Record<string, number> = {
                ArrowLeft: -1,
                ArrowRight: 1,
                ArrowUp: -COLUMNS,
                ArrowDown: COLUMNS,
            };
            const step = steps[event.key];

            if (step === undefined) {
                return;
            }

            event.preventDefault();

            const next = current === -1 ? 0 : current + step;

            if (next >= 0 && next < blocks.length) {
                blockRefs.current[next]?.focus();
                blockRefs.current[next]?.scrollIntoView({
                    behavior: "smooth",
                    block: "nearest",
                });
            }
        };

        window.addEventListener("keydown", onKeyDown);

        return () => window.removeEventListener("keydown", onKeyDown);
    }, [blocks.length, close, openIndex]);

    const openBlock = openIndex !== null ? blocks[openIndex] : null;
    const hasTimer = (openBlock?.duration ?? 0) > 0;

    return (
        <>
            <div className="grid grid-cols-3 gap-5">
                {blocks.map((block, index) => (
                    <button
                        key={block.id ?? index}
                        type="button"
                        ref={(element) => {
                            blockRefs.current[index] = element;
                        }}
                        onClick={() => open(index)}
                        className="flex min-w-0 cursor-pointer flex-col justify-start rounded-3xl border border-white/10 bg-warm-white/6 p-6 text-left transition focus:outline-none focus-visible:border-cta/60 focus-visible:shadow-[0_0_0_2px_rgba(232,132,43,0.6)] hover:border-cta/40"
                    >
                        <BlockHeader block={block} size="small" />

                        <div className="mt-3 flex flex-col gap-2">
                            {block.exercises?.map((exercise, exerciseIndex) => (
                                <div
                                    key={exercise.id ?? exerciseIndex}
                                    className="rounded-2xl border border-white/10 bg-black/20 p-3"
                                >
                                    <h3 className="text-2xl uppercase tracking-[0.06em] text-warm-white font-sl-archivo">
                                        {exercise.name || "Oefening"}
                                    </h3>

                                    <p className="mt-1 text-xl leading-6 text-warm-white/65">
                                        {exercise.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </button>
                ))}
            </div>

            {openBlock ? (
                <div
                    className="fixed inset-0 z-50 flex items-stretch bg-black/50 p-10 backdrop-blur-xl"
                    role="dialog"
                    aria-modal="true"
                    aria-label={openBlock.name || "Workout"}
                >
                    <div
                        className="absolute inset-0"
                        onClick={close}
                        aria-hidden="true"
                    />

                    <div className="relative z-10 flex min-h-0 w-full flex-col rounded-4xl border border-white/15 bg-ink/90 p-10 shadow-2xl shadow-black/50">
                        <div className="flex items-start justify-between gap-8">
                            <BlockHeader block={openBlock} size="large" />

                            <button
                                ref={closeRef}
                                type="button"
                                onClick={close}
                                className="shrink-0 rounded-full border border-white/20 bg-white/5 px-6 py-3 text-lg uppercase tracking-[0.22em] text-warm-white transition hover:border-cta/50 focus:outline-none focus-visible:border-cta focus-visible:shadow-[0_0_0_2px_rgba(232,132,43,0.7)]"
                            >
                                Sluiten
                            </button>
                        </div>

                        <div
                            ref={scrollRef}
                            className={cn(
                                "mt-8 min-h-0 flex-1 overflow-y-auto scrollbar-none focus:outline-none",
                                hasTimer && "pb-40",
                            )}
                        >
                            <div className="flex flex-col gap-5">
                                {openBlock.exercises?.map((exercise, index) => (
                                    <div
                                        key={exercise.id ?? index}
                                        className="rounded-3xl border border-white/10 bg-black/30 p-6"
                                    >
                                        <h3 className="text-4xl uppercase tracking-[0.06em] text-warm-white font-sl-archivo">
                                            {exercise.name || "Oefening"}
                                        </h3>

                                        <p className="mt-2 text-3xl leading-10 text-warm-white/75">
                                            {exercise.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {hasTimer ? (
                            <WorkoutTimer
                                key={openIndex}
                                ref={timerRef}
                                minutes={openBlock.duration as number}
                            />
                        ) : null}
                    </div>
                </div>
            ) : null}
        </>
    );
}

function BlockHeader({
    block,
    size,
}: {
    block: WorkoutBlock;
    size: "small" | "large";
}) {
    const large = size === "large";

    return (
        <div
            className={cn(
                "flex min-w-0 items-start justify-between gap-4",
                large && "justify-start gap-8",
            )}
        >
            <div className="min-w-0">
                <h2
                    className={cn(
                        "uppercase tracking-[0.12em] text-warm-white font-sl-archivo",
                        large ? "text-6xl" : "truncate text-4xl",
                    )}
                >
                    {block.name || "Workout"}
                </h2>

                {block.description ? (
                    <p
                        className={cn(
                            "mt-1 text-warm-white/65",
                            large
                                ? "mt-3 text-3xl leading-10"
                                : "text-xl leading-6",
                        )}
                    >
                        {block.description}
                    </p>
                ) : null}
            </div>

            <span
                className={cn(
                    "shrink-0 rounded-full border border-cta/35 bg-cta/15 uppercase tracking-[0.18em] text-[#f7d7b8]",
                    large ? "px-5 py-2 text-2xl" : "px-2.5 py-1 text-lg",
                )}
            >
                {block.duration} min
            </span>
        </div>
    );
}

function formatTime(totalSeconds: number) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

/** Countdown for a workout block: click/Enter starts, click/Enter again pauses. */
const WorkoutTimer = forwardRef<HTMLButtonElement, { minutes: number }>(
    function WorkoutTimer({ minutes }, ref) {
        const totalSeconds = Math.round(minutes * 60);
        const [remaining, setRemaining] = useState(totalSeconds);
        const [running, setRunning] = useState(false);
        const remainingRef = useRef(remaining);

        useEffect(() => {
            if (!running) {
                return;
            }

            // Based on a timestamp so throttled/background tabs don't drift
            const endAt = Date.now() + remainingRef.current * 1000;

            const interval = setInterval(() => {
                const left = Math.max(0, Math.ceil((endAt - Date.now()) / 1000));

                remainingRef.current = left;
                setRemaining(left);

                if (left === 0) {
                    setRunning(false);
                }
            }, 250);

            return () => clearInterval(interval);
        }, [running]);

        const finished = remaining === 0;
        const started = remaining < totalSeconds;

        const toggle = () => {
            if (finished) {
                remainingRef.current = totalSeconds;
                setRemaining(totalSeconds);
                setRunning(true);
                return;
            }

            setRunning((current) => !current);
        };

        return (
            <button
                ref={ref}
                type="button"
                onClick={toggle}
                aria-label={running ? "Pauzeer timer" : "Start timer"}
                className={cn(
                    "absolute bottom-10 right-10 z-20 flex flex-col items-center rounded-3xl border px-10 py-5 uppercase backdrop-blur transition focus:outline-none focus-visible:shadow-[0_0_0_3px_rgba(232,132,43,0.8)]",
                    running
                        ? "border-cta bg-cta/25 text-[#f7d7b8]"
                        : "border-white/20 bg-black/60 text-warm-white hover:border-cta/50",
                    finished && "animate-pulse border-cta bg-cta/30",
                )}
            >
                <span className="text-7xl tabular-nums tracking-[0.08em] font-sl-archivo">
                    {formatTime(remaining)}
                </span>
                <span className="mt-1 text-lg tracking-[0.25em] text-warm-white/70">
                    {finished
                        ? "Klaar"
                        : running
                          ? "Pauzeer"
                          : started
                            ? "Hervat"
                            : "Start"}
                </span>
            </button>
        );
    },
);
