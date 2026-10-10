"use client";

import { TvClock } from "@/components/TvClock/TvClock";
import { cn } from "@/utilities/ui";
import { useCallback, useEffect, useRef, useState } from "react";

export type WorkoutBlock = {
    id?: string | null;
    name: string;
    description?: string | null;
    duration?: number | null;
    poa?: string | null;
    exercises?: Array<{
        id?: string | null;
        name: string;
        quantity?: string | null;
        description?: string | null;
    }> | null;
};

// Back-button key codes sent by TV remotes (Tizen, webOS) besides Escape.
const BACK_KEY_CODES = new Set([10009, 461]);

// Block accents alternate ember / peach (see TvWorkout).
const accents = [
    {
        bar: "bg-orange-300",
        text: "text-orange-300",
        border: "border-orange-300",
        pill: "border-orange-700 bg-orange-700 text-white",
    },
    {
        bar: "bg-orange-200",
        text: "text-orange-200",
        border: "border-orange-200",
        pill: "border-orange-200 bg-orange-200 text-ink",
    },
];

const focusRing =
    "outline-none focus-visible:outline-[6px] focus-visible:outline-offset-[6px] focus-visible:outline-focus-ring";

function isBackKey(event: KeyboardEvent) {
    return (
        event.key === "Escape" ||
        event.key === "Backspace" ||
        event.key === "BrowserBack" ||
        event.key === "GoBack" ||
        BACK_KEY_CODES.has(event.keyCode)
    );
}

/** 6+ blocks are split over pages instead of shrinking the type. */
function getPageSize(count: number) {
    if (count <= 5) return Math.max(count, 1);
    if (count <= 10) return Math.ceil(count / 2);
    return 5;
}

export function WorkoutBlocks({
    blocks,
    lessonTitle,
}: {
    blocks: WorkoutBlock[];
    lessonTitle: string;
}) {
    const pageSize = getPageSize(blocks.length);
    const pageCount = Math.max(Math.ceil(blocks.length / pageSize), 1);
    const blockRefs = useRef<Array<HTMLButtonElement | null>>([]);
    const modalRef = useRef<HTMLDivElement | null>(null);
    const pendingFocus = useRef<number | null>(null);
    const lastIndexRef = useRef(0);
    const [page, setPage] = useState(0);
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const pageStart = page * pageSize;
    const visible = blocks.slice(pageStart, pageStart + pageSize);
    const compact = visible.length >= 4;

    const close = useCallback(() => {
        setOpenIndex(null);
        // Give focus back to the block that was opened so remote navigation continues from it
        requestAnimationFrame(() =>
            document
                .querySelector<HTMLElement>(
                    `[data-block-index="${lastIndexRef.current}"]`,
                )
                ?.focus(),
        );
    }, []);

    const open = (index: number) => {
        lastIndexRef.current = index;
        setOpenIndex(index);
    };

    // After a page change, focus the block that was requested.
    useEffect(() => {
        if (pendingFocus.current !== null) {
            document
                .querySelector<HTMLElement>(
                    `[data-block-index="${pendingFocus.current}"]`,
                )
                ?.focus();
            pendingFocus.current = null;
        }
    }, [page]);

    useEffect(() => {
        if (openIndex !== null) {
            modalRef.current
                ?.querySelector<HTMLElement>("button[data-tv-nav]")
                ?.focus();
        }
    }, [openIndex]);

    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            if (openIndex !== null) {
                if (isBackKey(event)) {
                    event.preventDefault();
                    close();
                } else if (
                    event.key === "ArrowLeft" ||
                    event.key === "ArrowRight"
                ) {
                    // Remote: left / right = previous / next block
                    event.preventDefault();
                    const next =
                        openIndex + (event.key === "ArrowLeft" ? -1 : 1);

                    if (next >= 0 && next < blocks.length) {
                        open(next);
                    }
                } else if (
                    event.key === "ArrowUp" ||
                    event.key === "ArrowDown"
                ) {
                    // Up / down moves between the buttons at the bottom
                    event.preventDefault();
                    const buttons = Array.from(
                        modalRef.current?.querySelectorAll<HTMLElement>(
                            "button[data-tv-nav]",
                        ) ?? [],
                    );
                    const current = buttons.indexOf(
                        document.activeElement as HTMLElement,
                    );
                    const next = current + (event.key === "ArrowUp" ? -1 : 1);
                    buttons[
                        Math.min(Math.max(next, 0), buttons.length - 1)
                    ]?.focus();
                }
                return;
            }

            const active = document.activeElement as HTMLElement | null;
            const currentAttr = active?.dataset.blockIndex;
            const onBack = active?.id === "tv-back";

            if (onBack && event.key === "ArrowDown") {
                event.preventDefault();
                document
                    .querySelector<HTMLElement>(
                        `[data-block-index="${lastIndexRef.current}"]`,
                    )
                    ?.focus();
                return;
            }

            if (event.key === "ArrowUp" && currentAttr !== undefined) {
                event.preventDefault();
                document.getElementById("tv-back")?.focus();
                return;
            }

            if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") {
                return;
            }

            event.preventDefault();

            const current =
                currentAttr !== undefined ? Number(currentAttr) : pageStart;
            const next = current + (event.key === "ArrowLeft" ? -1 : 1);

            if (next < 0 || next >= blocks.length) {
                return;
            }

            lastIndexRef.current = next;

            const nextPage = Math.floor(next / pageSize);

            if (nextPage !== page) {
                pendingFocus.current = next;
                setPage(nextPage);
            } else {
                document
                    .querySelector<HTMLElement>(`[data-block-index="${next}"]`)
                    ?.focus();
            }
        };

        window.addEventListener("keydown", onKeyDown);

        return () => window.removeEventListener("keydown", onKeyDown);
    }, [blocks.length, close, openIndex, page, pageSize, pageStart]);

    const openBlock = openIndex !== null ? blocks[openIndex] : null;

    if (blocks.length === 0) {
        return (
            <div className="relative z-10 mt-10 flex flex-1 items-center justify-center rounded-tv bg-charcoal">
                <p className="type-tv-heading text-text-on-panel-muted">
                    Nog geen workout gepland
                </p>
            </div>
        );
    }

    // 1-3 blocks: columns weighted by length; 4-5: equal columns.
    const columns = compact
        ? `repeat(${visible.length}, minmax(0, 1fr))`
        : visible
              .map(
                  (block) =>
                      `minmax(0, ${Math.max(block.exercises?.length ?? 0, 3)}fr)`,
              )
              .join(" ");

    return (
        <>
            <section
                className={cn(
                    "relative z-10 grid min-h-0 flex-1",
                    compact ? "mt-9 gap-6" : "mt-10 gap-tv-gap",
                )}
                style={{ gridTemplateColumns: columns }}
            >
                {visible.map((block, offset) => {
                    const index = pageStart + offset;
                    const accent = accents[index % accents.length];

                    return (
                        <button
                            key={block.id ?? index}
                            type="button"
                            data-block-index={index}
                            ref={(element) => {
                                blockRefs.current[index] = element;
                            }}
                            onClick={() => open(index)}
                            onFocus={() => {
                                lastIndexRef.current = index;
                            }}
                            className={cn(
                                "relative flex min-h-0 min-w-0 cursor-pointer flex-col overflow-hidden rounded-tv bg-charcoal text-left text-white",
                                compact
                                    ? "gap-[14px] p-7"
                                    : "gap-[22px] px-11 py-10",
                                focusRing,
                            )}
                        >
                            <span
                                className={cn(
                                    "absolute inset-x-0 top-0 h-[6px]",
                                    accent.bar,
                                )}
                            />

                            <div className="flex items-start justify-between gap-4">
                                <div className="min-w-0">
                                    <div
                                        className={cn(
                                            "font-display text-[40px] leading-none",
                                            accent.text,
                                        )}
                                    >
                                        {String(index + 1).padStart(2, "0")}
                                    </div>
                                    <h2
                                        className={cn(
                                            "mt-2 font-display leading-none uppercase",
                                            compact
                                                ? "text-[44px]"
                                                : "type-tv-block-title",
                                        )}
                                    >
                                        {block.name || "Workout"}
                                    </h2>
                                </div>
                                {block.duration ? (
                                    <DurationPill
                                        minutes={block.duration}
                                        className={accent.pill}
                                    />
                                ) : null}
                            </div>

                            {block.description ? (
                                <div
                                    className={cn(
                                        "font-semibold whitespace-pre-line",
                                        accent.text,
                                        compact
                                            ? "text-[28px] leading-9"
                                            : "text-[32px] leading-[42px]",
                                    )}
                                >
                                    {block.description}
                                </div>
                            ) : null}

                            <div
                                className={cn(
                                    "min-h-0 flex-1 overflow-hidden",
                                    !compact && block.poa
                                        ? "grid grid-cols-[1fr_380px] items-start gap-8"
                                        : "flex flex-col gap-5",
                                )}
                            >
                                <ExerciseList
                                    exercises={block.exercises}
                                    variant={compact ? "compact" : "card"}
                                />
                                {block.poa ? (
                                    <PoaBox poa={block.poa} compact={compact} />
                                ) : null}
                            </div>
                        </button>
                    );
                })}
            </section>

            {pageCount > 1 ? (
                <div className="relative z-10 mt-6 flex items-center justify-between">
                    <span className="type-tv-label text-sand uppercase">
                        Pagina {page + 1} / {pageCount}
                    </span>
                    <span className="type-tv-label text-text-on-panel-eyebrow uppercase">
                        ‹ › volgende blok · OK openen
                    </span>
                </div>
            ) : null}

            {openBlock && openIndex !== null ? (
                <BlockModal
                    key={openIndex}
                    containerRef={modalRef}
                    block={openBlock}
                    index={openIndex}
                    total={blocks.length}
                    lessonTitle={lessonTitle}
                    accent={accents[openIndex % accents.length]}
                    onClose={close}
                />
            ) : null}
        </>
    );
}

function DurationPill({
    minutes,
    className,
}: {
    minutes: number;
    className?: string;
}) {
    return (
        <span
            className={cn(
                "inline-flex h-[52px] flex-none items-center rounded-pill border-2 px-[22px] font-label text-2xl leading-none font-bold tracking-[0.14em] whitespace-nowrap uppercase",
                className,
            )}
        >
            {minutes} min
        </span>
    );
}

function formatTime(totalSeconds: number) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

type TimerMode = "emom" | "amrap" | "countdown";

/** The mode only lives in the free-text format line ("EMOM 10 minutes (RPE 7)", "AMRAP 24 min"). */
function getTimerMode(block: WorkoutBlock): TimerMode {
    const format = block.description ?? "";

    if (/\bemom\b/i.test(format) && (block.exercises?.length ?? 0) > 0) {
        return "emom";
    }

    if (/\bamrap\b/i.test(format)) {
        return "amrap";
    }

    return "countdown";
}

/** "Min 1. Bike" -> "Bike": the station label already says which minute it is. */
function stripMinutePrefix(name: string) {
    return name.replace(/^\s*min(?:uut)?\s*\d+\s*[.:)-]?\s*/i, "");
}

const buttonBase =
    "inline-flex h-24 items-center justify-center whitespace-nowrap rounded-pill border-[3px] px-12 font-sans text-[34px] leading-none font-semibold";
const ghostButton = "border-white bg-transparent text-white";
const stationBase =
    "flex items-center gap-7 rounded-card border-[3px] border-transparent px-[30px] py-[22px] text-[36px] leading-[44px] font-semibold text-text-on-panel-muted";

/** TvBlockTimer: one block full-screen with a big countdown, its exercises and the controls. */
function BlockModal({
    containerRef,
    block,
    index,
    total,
    lessonTitle,
    accent,
    onClose,
}: {
    containerRef: React.RefObject<HTMLDivElement | null>;
    block: WorkoutBlock;
    index: number;
    total: number;
    lessonTitle: string;
    accent: (typeof accents)[number];
    onClose: () => void;
}) {
    const mode = getTimerMode(block);
    const exercises = block.exercises ?? [];
    const totalSeconds = Math.round((block.duration ?? 0) * 60);
    const hasTimer = totalSeconds > 0;
    const [remaining, setRemaining] = useState(totalSeconds);
    const [running, setRunning] = useState(false);
    const [rounds, setRounds] = useState(0);
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

    const elapsed = totalSeconds - remaining;
    const finished = hasTimer && remaining === 0;
    const started = elapsed > 0;
    // Final 10 seconds: the bar goes fully sand. No flashing, no orange.
    const finalStretch = hasTimer && remaining <= 10;

    // EMOM: every minute is one station; the list repeats when there are fewer exercises than minutes.
    const minutes = Math.max(Math.ceil(totalSeconds / 60), 1);
    const currentMinute = Math.min(Math.floor(elapsed / 60), minutes - 1);
    const nowStation = exercises.length ? currentMinute % exercises.length : -1;
    const nextStation =
        exercises.length && currentMinute + 1 < minutes
            ? (currentMinute + 1) % exercises.length
            : -1;
    const leftInMinute = Math.min(60 - (elapsed % 60), remaining);

    const bigTime = mode === "emom" ? leftInMinute : remaining;
    const progress =
        mode === "emom"
            ? ((elapsed % 60) / 60) * 100
            : totalSeconds > 0
              ? (elapsed / totalSeconds) * 100
              : 0;

    useEffect(() => {
        containerRef.current
            ?.querySelector("[data-now]")
            ?.scrollIntoView({ block: "nearest" });
    }, [containerRef, currentMinute]);

    const reset = () => {
        remainingRef.current = totalSeconds;
        setRemaining(totalSeconds);
        setRunning(false);
        setRounds(0);
    };

    const toggle = () => {
        if (finished) {
            reset();
            setRunning(true);
            return;
        }

        setRunning((current) => !current);
    };

    return (
        <div className="absolute inset-0 z-50">
            <div
                className="absolute inset-0 bg-panel-deep/90"
                onClick={onClose}
                aria-hidden="true"
            />

            <div
                ref={containerRef}
                role="dialog"
                aria-modal="true"
                aria-label={`Blok ${index + 1}, ${block.name || "Workout"}`}
                className="absolute inset-x-20 inset-y-12 box-border grid grid-cols-[1fr_700px] grid-rows-[auto_1fr_auto] gap-x-[72px] gap-y-8 rounded-tv border-[3px] border-line-tv bg-ink bg-[radial-gradient(60%_70%_at_0%_0%,var(--tv-glow-ember)_0%,transparent_100%),radial-gradient(55%_65%_at_100%_100%,var(--tv-glow-ember-deep)_0%,transparent_100%),radial-gradient(50%_60%_at_100%_0%,var(--panel-glow)_0%,transparent_100%),linear-gradient(180deg,var(--charcoal),var(--ink))] px-16 py-12"
            >
                <div className="col-span-2 flex items-start justify-between gap-8">
                    <div className="min-w-0">
                        <div className="type-tv-label text-sand uppercase">
                            Blok {index + 1} / {total} · {lessonTitle}
                        </div>
                        <h2 className="type-tv-title mt-[14px] truncate">
                            {block.name || "Workout"}
                        </h2>
                        {block.description ? (
                            <div
                                className={cn(
                                    "mt-2 text-[30px] leading-10 font-semibold whitespace-pre-line",
                                    accent.text,
                                )}
                            >
                                {block.description}
                            </div>
                        ) : null}
                    </div>
                    <TvClock />
                </div>

                <div className="flex min-w-0 flex-col justify-center gap-9">
                    {hasTimer ? (
                        <>
                            <div
                                className={cn(
                                    "type-tv-label uppercase",
                                    accent.text,
                                )}
                            >
                                {finished
                                    ? "Klaar"
                                    : mode === "emom"
                                      ? "Deze minuut · nog"
                                      : "Resterend"}
                            </div>
                            <div className="type-tv-timer tabular-nums">
                                {formatTime(bigTime)}
                            </div>
                            <div
                                className="h-5 overflow-hidden rounded-pill bg-line-tv"
                                aria-hidden="true"
                            >
                                <div
                                    className={cn(
                                        "h-full rounded-pill",
                                        finalStretch
                                            ? "bg-sand"
                                            : "bg-linear-to-r from-orange-700 to-orange-300",
                                    )}
                                    style={{
                                        width: `${finalStretch ? 100 : progress}%`,
                                    }}
                                />
                            </div>
                            {mode === "emom" ? (
                                <div className="flex items-baseline justify-between">
                                    <span className="type-tv-heading">
                                        Minuut {currentMinute + 1} / {minutes}
                                    </span>
                                    <span className="type-tv-body text-text-on-panel-muted">
                                        Totaal {formatTime(elapsed)} /{" "}
                                        {formatTime(totalSeconds)}
                                    </span>
                                </div>
                            ) : null}
                            {mode === "amrap" ? (
                                <div className="flex items-center gap-7">
                                    <div
                                        className={cn(
                                            "flex size-36 flex-col items-center justify-center rounded-[36px] bg-orange-300 font-display text-[84px] leading-[0.9] text-ink",
                                            accent.border ===
                                                "border-orange-200" &&
                                                "bg-orange-200",
                                        )}
                                    >
                                        {rounds}
                                        <span className="mt-[6px] font-label text-2xl leading-none font-extrabold tracking-[0.2em]">
                                            RONDE
                                        </span>
                                    </div>
                                </div>
                            ) : null}
                        </>
                    ) : (
                        <div className="type-tv-heading text-text-on-panel-muted">
                            Geen tijd ingesteld
                        </div>
                    )}
                </div>

                <ol className="m-0 flex min-h-0 list-none flex-col gap-[14px] overflow-y-auto p-0 scrollbar-none">
                    {exercises.map((exercise, i) => {
                        const isNow = mode === "emom" && i === nowStation;
                        const isNext = mode === "emom" && i === nextStation;
                        const name =
                            mode === "emom"
                                ? stripMinutePrefix(exercise.name)
                                : exercise.name;

                        return (
                            <li
                                key={exercise.id ?? i}
                                data-now={isNow ? "" : undefined}
                                aria-current={isNow ? "step" : undefined}
                                className={cn(
                                    stationBase,
                                    mode !== "emom" && "text-white",
                                    isNow && "bg-sand text-ink",
                                    isNext && cn("text-white", accent.border),
                                )}
                            >
                                {mode === "emom" ? (
                                    <b
                                        className={cn(
                                            "w-[120px] flex-none font-display text-4xl leading-none font-normal uppercase",
                                            isNow ? "text-ink" : accent.text,
                                        )}
                                    >
                                        Min {i + 1}
                                    </b>
                                ) : exercise.quantity ? (
                                    <b
                                        className={cn(
                                            "min-w-[120px] flex-none font-display text-4xl leading-none font-normal uppercase",
                                            accent.text,
                                        )}
                                    >
                                        {formatQuantity(exercise.quantity)}
                                    </b>
                                ) : null}
                                <span className="min-w-0">
                                    {name || "Oefening"}
                                    {exercise.description ? (
                                        <span
                                            className={cn(
                                                "type-tv-cue block font-normal whitespace-pre-line",
                                                isNow
                                                    ? "text-ink"
                                                    : "text-text-on-panel-eyebrow",
                                            )}
                                        >
                                            {exercise.description}
                                        </span>
                                    ) : null}
                                </span>
                                {isNext ? (
                                    <span className="type-tv-label ml-auto text-text-on-panel-eyebrow uppercase">
                                        Hierna
                                    </span>
                                ) : null}
                            </li>
                        );
                    })}
                    {block.poa ? (
                        <PoaBox poa={block.poa} className="mt-3" />
                    ) : null}
                </ol>

                <div className="col-span-2 flex items-center gap-7">
                    {hasTimer ? (
                        <>
                            <button
                                type="button"
                                data-tv-nav
                                onClick={toggle}
                                className={cn(
                                    buttonBase,
                                    "border-transparent bg-cta text-on-cta",
                                    focusRing,
                                )}
                            >
                                {finished
                                    ? "Opnieuw"
                                    : running
                                      ? "Pauze"
                                      : started
                                        ? "Hervat"
                                        : "Start"}
                            </button>
                            <button
                                type="button"
                                data-tv-nav
                                onClick={reset}
                                className={cn(
                                    buttonBase,
                                    ghostButton,
                                    focusRing,
                                )}
                            >
                                Opnieuw
                            </button>
                        </>
                    ) : null}
                    {mode === "amrap" && hasTimer ? (
                        <button
                            type="button"
                            data-tv-nav
                            onClick={() => setRounds((current) => current + 1)}
                            className={cn(buttonBase, ghostButton, focusRing)}
                        >
                            +1 Ronde
                        </button>
                    ) : null}
                    <button
                        type="button"
                        data-tv-nav
                        onClick={onClose}
                        className={cn(buttonBase, ghostButton, focusRing)}
                    >
                        Sluiten
                    </button>
                    <span className="type-tv-label ml-auto text-text-on-panel-eyebrow uppercase">
                        ‹ › vorig / volgend blok
                    </span>
                </div>
            </div>
        </div>
    );
}

/** Trainers type a plain "x"; the TV sets it as "×" ("3x15" -> "3×15"). */
function formatQuantity(quantity: string) {
    return quantity.replace(/(\d)(\s*)x(?=\s|\d|$)/gi, "$1$2×");
}

function ExerciseList({
    exercises,
    variant,
}: {
    exercises: WorkoutBlock["exercises"];
    variant: "card" | "compact" | "modal";
}) {
    const compact = variant === "compact";

    return (
        <ul className="m-0 list-none p-0">
            {exercises?.map((exercise, i) => (
                <li
                    key={exercise.id ?? i}
                    className={cn(
                        "border-t-2 border-line-tv py-3 font-semibold text-white",
                        compact
                            ? "block text-[28px] leading-9"
                            : "type-tv-exercise flex justify-between gap-6",
                    )}
                >
                    <span className="min-w-0">
                        {exercise.name || "Oefening"}
                        {compact && exercise.quantity ? (
                            <span className="ml-[10px] font-normal text-text-on-panel-muted">
                                {formatQuantity(exercise.quantity)}
                            </span>
                        ) : null}
                        {exercise.description ? (
                            <span
                                className={cn(
                                    "mt-1 block font-normal whitespace-pre-line text-text-on-panel-eyebrow",
                                    compact
                                        ? "text-2xl leading-[30px]"
                                        : "type-tv-cue",
                                )}
                            >
                                {exercise.description}
                            </span>
                        ) : null}
                    </span>
                    {!compact && exercise.quantity ? (
                        <span className="flex-none font-normal whitespace-nowrap text-text-on-panel-muted">
                            {formatQuantity(exercise.quantity)}
                        </span>
                    ) : null}
                </li>
            ))}
        </ul>
    );
}

/** Points of attention: one per line, in a faintly orange-tinted box. */
function PoaBox({
    poa,
    compact,
    className,
}: {
    poa: string;
    compact?: boolean;
    className?: string;
}) {
    const lines = poa
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);

    if (lines.length === 0) {
        return null;
    }

    return (
        <div
            className={cn(
                "rounded-card border-2 border-orange-300/35 bg-orange-700/20 text-text-on-panel-muted",
                compact
                    ? "px-5 py-4 text-[26px] leading-9"
                    : "px-7 py-[22px] text-[28px] leading-10",
                className,
            )}
        >
            <div className="type-tv-label mb-[10px] text-orange-300 uppercase">
                POA&apos;s
            </div>
            {lines.map((line, i) => (
                <div key={i}>{line}</div>
            ))}
        </div>
    );
}
