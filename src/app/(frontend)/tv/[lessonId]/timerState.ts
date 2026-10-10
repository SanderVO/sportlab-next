export type TimerMode = "countdown" | "emom" | "amrap" | "rounds" | "intervals";

export type TimerExercise = { rotating?: boolean | null };

export type TimerBlock = {
    timerMode?: TimerMode | null;
    duration?: number | null;
    intervalSeconds?: number | null;
    rounds?: number | null;
    workSeconds?: number | null;
    restSeconds?: number | null;
    exercises?: TimerExercise[] | null;
};

export type TimerState = {
    /** Mode actually used: falls back to a plain countdown when the block lacks what the mode needs. */
    mode: TimerMode;
    hasTimer: boolean;
    totalSeconds: number;
    /** The big number on screen, in seconds. */
    displaySeconds: number;
    /** 0-100 */
    progress: number;
    finished: boolean;
    /** EMOM */
    intervalIndex: number;
    intervalCount: number;
    /** Exercise currently being done / coming next, or -1. */
    activeIndex: number;
    nextIndex: number;
    /** Changes whenever EMOM starts a new interval or Intervals switches work/rest (0 otherwise). */
    stepKey: number;
    /** Intervals: which phase of the current exercise's slot we're in. */
    phase: "work" | "rest" | null;
    /** Intervals: current / total repeat of the whole exercise list (0-based index). */
    cycleIndex: number;
    cycleCount: number;
    /** AMRAP / rounds */
    roundsDone: number;
    roundTarget: number | null;
};

const DEFAULT_INTERVAL_SECONDS = 60;

/**
 * Everything the TV shows is derived from the elapsed time (and the manual round
 * counter), so pausing, restarting and switching blocks always stay consistent.
 */
export function getTimerState(
    block: TimerBlock,
    elapsedSeconds: number,
    roundsDone: number,
): TimerState {
    const exercises = block.exercises ?? [];
    const work = Math.max(block.workSeconds ?? 0, 0);
    const rest = Math.max(block.restSeconds ?? 0, 0);
    const slot = work + rest;
    const cycleSeconds = slot * exercises.length;
    // Intervals: every exercise gets its own work + rest slot, then the next one starts.
    // The total comes from the number of repeats, or else from the block duration.
    const intervalsTotal =
        work > 0 && exercises.length > 0
            ? (block.rounds ?? 0) > 0
                ? cycleSeconds * (block.rounds ?? 0)
                : Math.round((block.duration ?? 0) * 60)
            : 0;
    const requested = block.timerMode ?? "countdown";
    const totalSeconds =
        requested === "intervals" && intervalsTotal > 0
            ? intervalsTotal
            : Math.max(Math.round((block.duration ?? 0) * 60), 0);
    const hasTimer = totalSeconds > 0;
    const elapsed = Math.min(Math.max(elapsedSeconds, 0), totalSeconds);
    const remaining = totalSeconds - elapsed;

    // Fall back to the regular timer when the block can't support the chosen mode.
    let mode: TimerMode = "countdown";
    if (requested === "intervals" && intervalsTotal > 0) mode = "intervals";
    else if (requested === "emom" && hasTimer && exercises.length > 0)
        mode = "emom";
    else if (requested === "amrap" && hasTimer) mode = "amrap";
    else if (requested === "rounds" && (block.rounds ?? 0) > 0) mode = "rounds";

    const state: TimerState = {
        mode,
        hasTimer,
        totalSeconds,
        displaySeconds: remaining,
        progress: hasTimer ? (elapsed / totalSeconds) * 100 : 0,
        finished: hasTimer && remaining === 0,
        intervalIndex: 0,
        intervalCount: 0,
        activeIndex: -1,
        nextIndex: -1,
        stepKey: 0,
        phase: null,
        cycleIndex: 0,
        cycleCount: 0,
        roundsDone,
        roundTarget: mode === "rounds" ? (block.rounds ?? null) : null,
    };

    if (mode === "emom") {
        const interval = Math.max(
            block.intervalSeconds ?? DEFAULT_INTERVAL_SECONDS,
            1,
        );
        const count = Math.max(Math.ceil(totalSeconds / interval), 1);
        const index = Math.min(Math.floor(elapsed / interval), count - 1);

        state.intervalCount = count;
        state.intervalIndex = index;
        state.stepKey = index;
        // The list repeats when there are fewer exercises than intervals.
        state.activeIndex = index % exercises.length;
        state.nextIndex =
            index + 1 < count ? (index + 1) % exercises.length : -1;
        state.displaySeconds = Math.min(
            interval - (elapsed % interval),
            remaining,
        );
        state.progress = ((elapsed % interval) / interval) * 100;
    }

    if (mode === "intervals") {
        const slotCount = Math.max(Math.ceil(totalSeconds / slot), 1);
        const slotIndex = Math.min(Math.floor(elapsed / slot), slotCount - 1);
        const within = elapsed - slotIndex * slot;
        const phase = within < work ? "work" : "rest";
        const phaseLength = phase === "work" ? work : rest;
        const phaseElapsed = phase === "work" ? within : within - work;

        state.phase = phase;
        state.stepKey = slotIndex * 2 + (phase === "rest" ? 1 : 0);
        state.cycleCount = Math.max(Math.ceil(slotCount / exercises.length), 1);
        state.cycleIndex = Math.floor(slotIndex / exercises.length);
        // Only the exercise being worked is highlighted; during rest nothing is.
        state.activeIndex =
            phase === "work" ? slotIndex % exercises.length : -1;
        state.nextIndex =
            slotIndex + 1 < slotCount ? (slotIndex + 1) % exercises.length : -1;
        state.displaySeconds = Math.min(phaseLength - phaseElapsed, remaining);
        state.progress =
            phaseLength > 0 ? (phaseElapsed / phaseLength) * 100 : 100;
    }

    if (mode === "amrap" || mode === "rounds") {
        // Exercises marked "rotating" take turns, one per round; the rest happen every round.
        const rotating = exercises
            .map((exercise, i) => (exercise.rotating ? i : -1))
            .filter((i) => i >= 0);

        if (rotating.length > 0) {
            state.activeIndex = rotating[roundsDone % rotating.length]!;
        }
    }

    return state;
}
