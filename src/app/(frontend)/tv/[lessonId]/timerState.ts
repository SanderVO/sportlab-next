export type TimerMode = "countdown" | "emom" | "amrap" | "rounds" | "intervals";

export type TimerExercise = { rotating?: boolean | null };

export type IntervalPhase = "work" | "rest" | "active_rest";

export type TimerRoundType = {
    type?: IntervalPhase | null;
    seconds?: number | null;
};

type IntervalStep = { phase: IntervalPhase; seconds: number };

export type TimerBlock = {
    timerMode?: TimerMode | null;
    /** Only mark an active / next exercise when the CMS option is on. */
    highlightExercises?: boolean | null;
    duration?: number | null;
    intervalSeconds?: number | null;
    rounds?: number | null;
    roundTypes?: TimerRoundType[] | null;
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
    phase: IntervalPhase | null;
    /** Intervals: position in the round sequence (0-based) and its length. */
    stepIndex: number;
    stepCount: number;
    /** Intervals: current / total repeat of the whole exercise list (0-based index). */
    cycleIndex: number;
    cycleCount: number;
    /** AMRAP / rounds */
    roundsDone: number;
    roundTarget: number | null;
};

const DEFAULT_INTERVAL_SECONDS = 60;

/** One pass of an Intervals block: every round type runs for its own time. */
function getIntervalSteps(block: TimerBlock): IntervalStep[] {
    return (block.roundTypes ?? []).flatMap((round) =>
        round.type && (round.seconds ?? 0) > 0
            ? [{ phase: round.type, seconds: round.seconds ?? 0 }]
            : [],
    );
}

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
    const steps = getIntervalSteps(block);
    const cycleSeconds = steps.reduce((sum, step) => sum + step.seconds, 0);
    // Work and active rest both go with an exercise from the list; plain rest does not.
    const exerciseSteps = steps.filter((step) => step.phase !== "rest").length;
    // Intervals: the steps run in order, then the whole pass repeats.
    // The total comes from the number of repeats, or else from the block duration.
    const intervalsTotal =
        cycleSeconds > 0
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
        stepIndex: 0,
        stepCount: 0,
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
        const cycleCount = Math.max(Math.ceil(totalSeconds / cycleSeconds), 1);
        const cycleIndex = Math.min(
            Math.floor(elapsed / cycleSeconds),
            cycleCount - 1,
        );
        const withinCycle = elapsed - cycleIndex * cycleSeconds;

        let stepIndex = 0;
        let stepStart = 0;
        while (
            stepIndex < steps.length - 1 &&
            withinCycle >= stepStart + steps[stepIndex]!.seconds
        ) {
            stepStart += steps[stepIndex]!.seconds;
            stepIndex++;
        }
        const step = steps[stepIndex]!;
        const stepElapsed = Math.min(withinCycle - stepStart, step.seconds);

        // How many exercise steps came before step `index` of cycle `cycle`.
        const workBefore = (cycle: number, index: number) =>
            cycle * exerciseSteps +
            steps.slice(0, index).filter((s) => s.phase !== "rest").length;
        const exerciseFor = (ordinal: number) =>
            exercises.length > 0 ? ordinal % exercises.length : -1;

        // The next exercise step that still starts before the block ends.
        let next = -1;
        let nextStart = cycleIndex * cycleSeconds + stepStart + step.seconds;
        for (let g = 1; g <= steps.length && nextStart < totalSeconds; g++) {
            const flat = cycleIndex * steps.length + stepIndex + g;
            const cycle = Math.floor(flat / steps.length);
            const index = flat % steps.length;
            if (steps[index]!.phase !== "rest") {
                next = exerciseFor(workBefore(cycle, index));
                break;
            }
            nextStart += steps[index]!.seconds;
        }

        state.phase = step.phase;
        state.stepKey = cycleIndex * steps.length + stepIndex;
        state.cycleCount = cycleCount;
        state.cycleIndex = cycleIndex;
        state.stepIndex = stepIndex;
        state.stepCount = steps.length;
        // Work and active rest highlight their exercise; plain rest highlights nothing.
        state.activeIndex =
            step.phase !== "rest"
                ? exerciseFor(workBefore(cycleIndex, stepIndex))
                : -1;
        state.nextIndex = next;
        state.displaySeconds = Math.min(step.seconds - stepElapsed, remaining);
        state.progress = (stepElapsed / step.seconds) * 100;
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

    // Exercises only become active when the block opts in via the CMS.
    if (!block.highlightExercises) {
        state.activeIndex = -1;
        state.nextIndex = -1;
    }

    return state;
}
