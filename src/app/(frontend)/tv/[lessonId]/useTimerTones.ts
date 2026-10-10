import { useCallback, useEffect, useRef } from "react";

export type TimerTone = "go" | "rest" | "finish" | "countdown";

type Beep = { frequency: number; durationMs: number; delayMs?: number };

// Higher = go, lower = rest. Different rhythms so they can't be mixed up across the gym.
const TONES: Record<TimerTone, Beep[]> = {
    go: [{ frequency: 988, durationMs: 300 }],
    rest: [{ frequency: 440, durationMs: 250 }],
    countdown: [{ frequency: 660, durationMs: 100 }],
    finish: [
        { frequency: 520, durationMs: 400 },
        { frequency: 520, durationMs: 400, delayMs: 550 },
    ],
};

const VOLUME = 0.5;

/**
 * Short tones for the block timer, generated with the Web Audio API (no audio files).
 * Browsers only allow audio after a user gesture, so call `unlock()` from the
 * Start / OK handler. Until then `play()` is silent.
 */
export function useTimerTones() {
    const ctxRef = useRef<AudioContext | null>(null);

    const unlock = useCallback(() => {
        if (!ctxRef.current) {
            const Context =
                window.AudioContext ??
                (
                    window as unknown as {
                        webkitAudioContext?: typeof AudioContext;
                    }
                ).webkitAudioContext;

            if (!Context) {
                return;
            }

            ctxRef.current = new Context();
        }

        void ctxRef.current.resume();
    }, []);

    const play = useCallback((tone: TimerTone) => {
        const ctx = ctxRef.current;

        if (!ctx) {
            return;
        }

        const schedule = () => {
            for (const beep of TONES[tone]) {
                const start = ctx.currentTime + (beep.delayMs ?? 0) / 1000;
                const end = start + beep.durationMs / 1000;
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();

                // Triangle carries over music better than a sine and is softer than a square
                osc.type = "triangle";
                osc.frequency.value = beep.frequency;
                osc.connect(gain).connect(ctx.destination);

                // Quick fade in / out so it doesn't click
                gain.gain.setValueAtTime(0, start);
                gain.gain.linearRampToValueAtTime(VOLUME, start + 0.01);
                gain.gain.linearRampToValueAtTime(0, end);

                osc.start(start);
                osc.stop(end + 0.05);
            }
        };

        if (ctx.state === "running") {
            schedule();
        } else {
            void ctx.resume().then(schedule);
        }
    }, []);

    useEffect(() => {
        return () => {
            void ctxRef.current?.close();
            ctxRef.current = null;
        };
    }, []);

    return { unlock, play };
}
