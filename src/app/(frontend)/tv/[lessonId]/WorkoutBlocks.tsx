"use client";

import { TvClock } from "@/components/TvClock/TvClock";
import { cn } from "@/utilities/ui";
import { getTimerState, type TimerMode } from "./timerState";
import { useTimerTones } from "./useTimerTones";
import { useCallback, useEffect, useRef, useState } from "react";

export type WorkoutBlock = {
    id?: string | null;
    name: string;
    description?: string | null;
    duration?: number | null;
    poa?: string | null;
    timerMode?: TimerMode | null;
    intervalSeconds?: number | null;
    rounds?: number | null;
    workSeconds?: number | null;
    restSeconds?: number | null;
    exercises?: Array<{
        id?: string | null;
        name: string;
        quantity?: string | null;
        rotating?: boolean | null;
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
        fill: "bg-orange-300",
        pill: "border-orange-700 bg-orange-700 text-white",
    },
    {
        bar: "bg-orange-200",
        text: "text-orange-200",
        border: "border-orange-200",
        fill: "bg-orange-200",
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

                            <div>
                                <div className="flex items-start justify-between gap-4">
                                    <div
                                        className={cn(
                                            "font-display text-[40px] leading-none",
                                            accent.text,
                                        )}
                                    >
                                        {String(index + 1).padStart(2, "0")}
                                    </div>
                                    {block.duration ? (
                                        <DurationPill
                                            minutes={block.duration}
                                            className={accent.pill}
                                        />
                                    ) : null}
                                </div>
                                <h2
                                    className={cn(
                                        "mt-2 truncate font-display leading-none uppercase",
                                        compact
                                            ? "text-[44px]"
                                            : "type-tv-block-title",
                                    )}
                                >
                                    {block.name || "Workout"}
                                </h2>
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

                            <div className="min-h-0 flex-1 overflow-hidden">
                                <ExerciseList
                                    exercises={block.exercises}
                                    variant={compact ? "compact" : "card"}
                                />
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
                "inline-flex h-11 flex-none items-center rounded-pill border-2 px-4 font-label text-2xl leading-none font-bold tracking-[0.1em] whitespace-nowrap uppercase",
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
    const exercises = block.exercises ?? [];
    const [elapsed, setElapsed] = useState(0);
    const [running, setRunning] = useState(false);
    const [roundsDone, setRoundsDone] = useState(0);
    // Elapsed time in ms, kept with its fraction so pausing never loses a partial second
    const elapsedMsRef = useRef(0);

    const timer = getTimerState(block, elapsed, roundsDone);
    const totalSeconds = timer.totalSeconds;
    const { mode, hasTimer } = timer;
    const isRoundMode = mode === "amrap" || mode === "rounds";
    const roundsComplete =
        timer.roundTarget !== null && roundsDone >= timer.roundTarget;
    const finished = hasTimer ? timer.finished : roundsComplete;
    const started = elapsed > 0;
    // Final 10 seconds: the bar goes fully sand. No flashing, no orange.
    const finalStretch =
        hasTimer &&
        mode !== "emom" &&
        mode !== "intervals" &&
        totalSeconds - elapsed <= 10;
    // While running the bar aims at where it will be one second from now, so a 1s linear
    // transition arrives exactly when the display ticks over. Across a phase/interval
    // boundary (progress would restart) it just fills up.
    const ahead = running
        ? getTimerState(block, elapsed + 1, roundsDone).progress
        : timer.progress;
    const target = ahead >= timer.progress ? ahead : 100;
    const barPercent = Math.min(Math.max(finalStretch ? 100 : target, 0), 100);
    const [bar, setBar] = useState({ percent: barPercent, jumps: false });
    if (bar.percent !== barPercent) {
        setBar({ percent: barPercent, jumps: barPercent < bar.percent });
    }
    const barJumps = bar.jumps;
    const { unlock, play } = useTimerTones();
    const prevStepKey = useRef(0);
    const prevFinished = useRef(false);
    const intervalSeconds = block.intervalSeconds ?? 60;
    const unit = intervalSeconds === 60 ? "Min" : "Stap";

    // "go" / "rest" when EMOM starts a new interval or Intervals switches phase
    useEffect(() => {
        const changed = timer.stepKey !== prevStepKey.current;
        prevStepKey.current = timer.stepKey;

        if (!running || !changed || timer.stepKey === 0) {
            return;
        }

        if (mode === "emom") {
            play("go");
        } else if (mode === "intervals") {
            play(timer.phase === "work" ? "go" : "rest");
        }
    }, [timer.stepKey]); // eslint-disable-line react-hooks/exhaustive-deps

    // "countdown": a tick for each of the last 3 seconds before an interval / phase changes
    useEffect(() => {
        if (
            running &&
            !finished &&
            (mode === "emom" || mode === "intervals") &&
            timer.displaySeconds >= 1 &&
            timer.displaySeconds <= 3
        ) {
            play("countdown");
        }
    }, [timer.displaySeconds]); // eslint-disable-line react-hooks/exhaustive-deps

    // "finish" once, when the block ends
    useEffect(() => {
        if (finished && !prevFinished.current) {
            play("finish");
        }

        prevFinished.current = finished;
    }, [finished]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (!running) {
            return;
        }

        // performance.now() is monotonic: unlike Date.now() it doesn't jump when the TV
        // syncs its clock. Based on a timestamp so throttled/background tabs don't drift.
        const startedAt = performance.now() - elapsedMsRef.current;
        const totalMs = totalSeconds * 1000;
        const currentMs = () =>
            Math.min(performance.now() - startedAt, totalMs);

        const interval = setInterval(() => {
            const ms = currentMs();

            elapsedMsRef.current = ms;
            setElapsed(Math.floor(ms / 1000));

            if (ms >= totalMs) {
                setRunning(false);
            }
        }, 250);

        return () => {
            clearInterval(interval);
            // Keep the exact position when pausing
            elapsedMsRef.current = currentMs();
        };
    }, [running, totalSeconds]);

    useEffect(() => {
        containerRef.current
            ?.querySelector("[data-now]")
            ?.scrollIntoView({ block: "nearest" });
    }, [containerRef, timer.activeIndex]);

    const reset = () => {
        elapsedMsRef.current = 0;
        setElapsed(0);
        setRunning(false);
        setRoundsDone(0);
    };

    const toggle = () => {
        // Starting the timer is the user gesture that allows sound
        unlock();

        const startingFresh = finished || (!running && elapsed === 0);

        if (startingFresh && (mode === "emom" || mode === "intervals")) {
            play("go");
        }

        if (finished) {
            reset();
            setRunning(true);
            return;
        }

        setRunning((current) => !current);
    };

    const nextRound = () => {
        unlock();
        setRoundsDone((current) =>
            timer.roundTarget !== null
                ? Math.min(current + 1, timer.roundTarget)
                : current + 1,
        );
    };

    const activeExercise =
        timer.activeIndex >= 0 ? exercises[timer.activeIndex] : null;

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
                                    mode === "intervals" &&
                                        timer.phase === "rest"
                                        ? "text-sand"
                                        : accent.text,
                                )}
                            >
                                {finished
                                    ? "Klaar"
                                    : mode === "intervals"
                                      ? timer.phase === "work"
                                          ? "Werk · nog"
                                          : "Rust · nog"
                                      : mode === "emom"
                                        ? `${unit === "Min" ? "Deze minuut" : "Dit interval"} · nog`
                                        : "Resterend"}
                            </div>
                            <div className="type-tv-timer tabular-nums">
                                {formatTime(timer.displaySeconds)}
                            </div>
                            <div
                                className="h-5 overflow-hidden rounded-pill bg-line-tv"
                                aria-hidden="true"
                            >
                                <div
                                    className={cn(
                                        "h-full rounded-pill",
                                        finalStretch ||
                                            (mode === "intervals" &&
                                                timer.phase === "rest")
                                            ? "bg-sand"
                                            : "bg-linear-to-r from-orange-700 to-orange-300",
                                    )}
                                    style={{
                                        // translate3d + will-change keep the bar on the GPU
                                        // compositor: no layout work per frame on TV hardware
                                        transform: `translate3d(${barPercent - 100}%, 0, 0)`,
                                        transition: barJumps
                                            ? "none"
                                            : "transform 1000ms linear",
                                        willChange: "transform",
                                    }}
                                />
                            </div>
                            {mode === "intervals" ? (
                                <div className="flex items-baseline justify-between">
                                    <span className="type-tv-heading">
                                        Ronde {timer.cycleIndex + 1} /{" "}
                                        {timer.cycleCount}
                                    </span>
                                    <span className="type-tv-body text-text-on-panel-muted">
                                        Totaal {formatTime(elapsed)} /{" "}
                                        {formatTime(totalSeconds)}
                                    </span>
                                </div>
                            ) : null}
                            {mode === "emom" ? (
                                <div className="flex items-baseline justify-between">
                                    <span className="type-tv-heading">
                                        {unit === "Min" ? "Minuut" : "Interval"}{" "}
                                        {timer.intervalIndex + 1} /{" "}
                                        {timer.intervalCount}
                                    </span>
                                    <span className="type-tv-body text-text-on-panel-muted">
                                        Totaal {formatTime(elapsed)} /{" "}
                                        {formatTime(totalSeconds)}
                                    </span>
                                </div>
                            ) : null}
                        </>
                    ) : null}

                    {isRoundMode ? (
                        <div className="flex items-center gap-7">
                            <div
                                className={cn(
                                    "flex size-36 flex-none flex-col items-center justify-center rounded-[36px] font-display text-[84px] leading-[0.9] text-ink",
                                    accent.fill,
                                )}
                            >
                                {mode === "rounds" && timer.roundTarget !== null
                                    ? Math.min(
                                          roundsDone + 1,
                                          timer.roundTarget,
                                      )
                                    : roundsDone}
                                <span className="mt-[6px] font-label text-2xl leading-none font-extrabold tracking-[0.2em]">
                                    RONDE
                                </span>
                            </div>
                            <div className="min-w-0">
                                {mode === "rounds" &&
                                timer.roundTarget !== null ? (
                                    <div className="type-tv-heading">
                                        {roundsComplete
                                            ? "Klaar"
                                            : `Ronde ${roundsDone + 1} / ${timer.roundTarget}`}
                                    </div>
                                ) : null}
                                {activeExercise && !roundsComplete ? (
                                    <>
                                        <div
                                            className={cn(
                                                "type-tv-label uppercase",
                                                accent.text,
                                            )}
                                        >
                                            Deze ronde wisselend
                                        </div>
                                        <div className="type-tv-heading mt-[6px] truncate">
                                            {activeExercise.quantity
                                                ? `${formatQuantity(activeExercise.quantity)} `
                                                : ""}
                                            {activeExercise.name}
                                        </div>
                                    </>
                                ) : null}
                            </div>
                        </div>
                    ) : null}

                    {!hasTimer && !isRoundMode ? (
                        <div className="type-tv-heading text-text-on-panel-muted">
                            Geen tijd ingesteld
                        </div>
                    ) : null}
                </div>

                <ol className="m-0 flex min-h-0 list-none flex-col gap-[14px] overflow-y-auto p-0 scrollbar-none">
                    {exercises.map((exercise, i) => {
                        const isNow = i === timer.activeIndex;
                        const isNext =
                            (mode === "emom" || mode === "intervals") &&
                            i === timer.nextIndex;
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
                                        {unit} {i + 1}
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
                    {isRoundMode ? (
                        <button
                            type="button"
                            data-tv-nav
                            onClick={nextRound}
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

/** Points of attention: plain text in a faintly orange-tinted box (block popup only). */
function PoaBox({ poa, className }: { poa: string; className?: string }) {
    const text = poa.trim();

    if (!text) {
        return null;
    }

    return (
        <div
            className={cn(
                "rounded-card border-2 border-orange-300/35 bg-orange-700/20 px-7 py-[22px] text-[28px] leading-10 text-text-on-panel-muted",
                className,
            )}
        >
            {text}
        </div>
    );
}
