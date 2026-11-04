"use client";

import { TvClock } from "@/components/TvClock/TvClock";
import { getTvKey, isTvBackKey } from "@/utilities/tvKeys";
import { cn } from "@/utilities/ui";
import { useCallback, useEffect, useRef, useState } from "react";

const PIN_LENGTH = 4;
const OK_DELAY_MS = 700;

const DELETE = "←";
const CLEAR = "Wis";
const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", DELETE, "0", CLEAR];

const focusRing =
    "outline-none focus-visible:outline-[6px] focus-visible:outline-offset-[6px] focus-visible:outline-focus-ring";

type Status =
    | { kind: "typing" }
    | { kind: "checking" }
    | { kind: "wrong"; attemptsLeft: number | null }
    | { kind: "locked"; until: number }
    | { kind: "ok" };

type AuthResponse = { attemptsLeft?: number; retryAfter?: number };

function formatCountdown(ms: number) {
    const total = Math.max(0, Math.ceil(ms / 1000));
    const minutes = String(Math.floor(total / 60)).padStart(2, "0");
    const seconds = String(total % 60).padStart(2, "0");

    return `${minutes}:${seconds}`;
}

export function TvPin({ redirectTo = "/tv" }: { redirectTo?: string }) {
    const [pin, setPin] = useState("");
    const [status, setStatus] = useState<Status>({ kind: "typing" });
    const [now, setNow] = useState(() => Date.now());
    const keyRefs = useRef<(HTMLButtonElement | null)[]>([]);
    const pinRef = useRef("");
    const statusRef = useRef<Status>(status);

    const updatePin = (next: string) => {
        pinRef.current = next;
        setPin(next);
    };
    const updateStatus = (next: Status) => {
        statusRef.current = next;
        setStatus(next);
    };

    const lockedUntil = status.kind === "locked" ? status.until : null;
    const isLocked = lockedUntil !== null;
    const isInputBlocked =
        isLocked || status.kind === "checking" || status.kind === "ok";

    const submit = useCallback(
        async (value: string) => {
            updateStatus({ kind: "checking" });

            try {
                const response = await fetch("/api/tv-auth", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ pin: value }),
                });

                if (response.ok) {
                    updateStatus({ kind: "ok" });
                    window.setTimeout(
                        () => window.location.assign(redirectTo),
                        OK_DELAY_MS,
                    );

                    return;
                }

                const data = (await response
                    .json()
                    .catch(() => null)) as AuthResponse | null;

                if (response.status === 429) {
                    updateStatus({
                        kind: "locked",
                        until: Date.now() + (data?.retryAfter ?? 60) * 1000,
                    });
                    setNow(Date.now());
                } else {
                    updateStatus({
                        kind: "wrong",
                        attemptsLeft: data?.attemptsLeft ?? null,
                    });
                }
            } catch {
                updateStatus({ kind: "wrong", attemptsLeft: null });
            }
        },
        [redirectTo],
    );

    const press = useCallback(
        (key: string) => {
            const current = statusRef.current;

            if (
                current.kind === "locked" ||
                current.kind === "checking" ||
                current.kind === "ok"
            ) {
                return;
            }

            // After a wrong code the next key press starts over.
            const base = current.kind === "wrong" ? "" : pinRef.current;

            if (current.kind === "wrong") {
                updateStatus({ kind: "typing" });
            }

            if (key === CLEAR) {
                updatePin("");
            } else if (key === DELETE) {
                updatePin(base.slice(0, -1));
            } else if (base.length < PIN_LENGTH) {
                const next = base + key;

                updatePin(next);

                if (next.length === PIN_LENGTH) {
                    void submit(next);
                }
            }
        },
        [submit],
    );

    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            const key = getTvKey(event);

            if (/^\d$/.test(key)) {
                press(key);
            } else if (isTvBackKey(event)) {
                event.preventDefault();
                press(DELETE);
            }
        };

        window.addEventListener("keydown", onKeyDown);

        return () => window.removeEventListener("keydown", onKeyDown);
    }, [press]);

    // Count down the lockout, then give all attempts back.
    useEffect(() => {
        if (lockedUntil === null) {
            return;
        }

        const tick = () => {
            const current = Date.now();

            setNow(current);

            if (current >= lockedUntil) {
                window.clearInterval(interval);
                updatePin("");
                updateStatus({ kind: "typing" });
                keyRefs.current[0]?.focus();
            }
        };
        const interval = window.setInterval(tick, 250);

        return () => window.clearInterval(interval);
    }, [lockedUntil]);

    const onPadKeyDown = (event: React.KeyboardEvent, index: number) => {
        const moves: Record<string, number> = {
            ArrowLeft: index % 3 === 0 ? 0 : -1,
            ArrowRight: index % 3 === 2 ? 0 : 1,
            ArrowUp: index < 3 ? 0 : -3,
            ArrowDown: index >= KEYS.length - 3 ? 0 : 3,
        };
        const step = moves[getTvKey(event.nativeEvent)];

        if (step === undefined) {
            return;
        }

        event.preventDefault();
        keyRefs.current[index + step]?.focus();
    };

    const slotState = (index: number) => {
        if (status.kind === "locked") {
            return "locked";
        }

        if (status.kind === "wrong") {
            return "error";
        }

        if (status.kind === "ok") {
            return "ok";
        }

        return index === pin.length ? "active" : "idle";
    };

    return (
        <main className="relative box-border flex h-[1080px] flex-col px-tv-safe-x py-tv-safe-y text-white">
            <header className="flex h-[72px] flex-none items-center justify-between">
                <span className="font-label text-[32px] leading-none font-extrabold tracking-[0.25em] uppercase">
                    Sportlab
                </span>
                <TvClock />
            </header>

            <section className="grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)_576px] items-center gap-x-[120px]">
                <div className="min-w-0">
                    <div className="type-tv-label text-sand uppercase">
                        TV-dashboard · Alleen voor het team
                    </div>
                    <h1 className="type-tv-title mt-4">Voer de code in</h1>
                    <p className="type-tv-body mt-5 text-text-on-panel-muted">
                        Vier cijfers. Weet je de code niet? Vraag het een coach.
                    </p>

                    <div
                        className="mt-14 flex gap-7"
                        role="group"
                        aria-label={
                            isLocked
                                ? "Pincode, geblokkeerd"
                                : `Pincode, ${pin.length} van ${PIN_LENGTH} cijfers ingevuld`
                        }
                    >
                        {Array.from({ length: PIN_LENGTH }, (_, index) => {
                            const state = slotState(index);

                            return (
                                <div
                                    key={index}
                                    className={cn(
                                        "relative box-border flex h-[200px] w-[168px] items-center justify-center rounded-tv border-[3px] border-line-tv bg-charcoal/85",
                                        state === "active" &&
                                            "border-orange-300 after:absolute after:bottom-9 after:left-1/2 after:h-[6px] after:w-14 after:-translate-x-1/2 after:rounded-[3px] after:bg-orange-300",
                                        state === "error" &&
                                            "border-orange-300 bg-orange-700/35",
                                        state === "ok" && "border-sand",
                                        state === "locked" && "opacity-45",
                                    )}
                                >
                                    {index < pin.length && (
                                        <i
                                            className={cn(
                                                "block size-10 rounded-full bg-white",
                                                state === "error" &&
                                                    "bg-orange-200",
                                                state === "ok" && "bg-sand",
                                            )}
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    <div
                        className="mt-10 flex h-[144px] items-start"
                        role="status"
                        aria-live="polite"
                    >
                        {status.kind === "wrong" && (
                            <Alert
                                title={
                                    status.attemptsLeft === null
                                        ? "Er ging iets mis."
                                        : "Deze code klopt niet."
                                }
                            >
                                {status.attemptsLeft === null
                                    ? "Probeer het opnieuw."
                                    : `Probeer het opnieuw. Nog ${status.attemptsLeft} ${status.attemptsLeft === 1 ? "poging" : "pogingen"}.`}
                            </Alert>
                        )}
                        {status.kind === "locked" && (
                            <Alert title="Te veel pogingen.">
                                Probeer het over{" "}
                                <b className="font-display text-[40px] leading-none font-normal tracking-[0.02em] text-white">
                                    {formatCountdown(status.until - now)}
                                </b>{" "}
                                opnieuw.
                            </Alert>
                        )}
                        {status.kind === "ok" && (
                            <Alert title="Code klopt." mark="→" tone="ok">
                                Het dashboard wordt geopend.
                            </Alert>
                        )}
                        {(status.kind === "typing" ||
                            status.kind === "checking") && (
                            <span className="type-tv-label text-text-on-panel-eyebrow uppercase">
                                {pin.length} / {PIN_LENGTH} cijfers
                            </span>
                        )}
                    </div>
                </div>

                <div
                    className="grid grid-cols-3 gap-[18px] rounded-tv border-[3px] border-line-tv bg-ink/55 p-9"
                    role="group"
                    aria-label="Cijfers"
                >
                    {KEYS.map((key, index) => {
                        const isText = key === DELETE || key === CLEAR;

                        return (
                            <button
                                key={key}
                                ref={(element) => {
                                    keyRefs.current[index] = element;
                                }}
                                type="button"
                                disabled={isInputBlocked}
                                aria-label={
                                    key === DELETE
                                        ? "Wis laatste cijfer"
                                        : key === CLEAR
                                          ? "Wis alles"
                                          : undefined
                                }
                                autoFocus={index === 0}
                                onClick={() => press(key)}
                                onKeyDown={(event) =>
                                    onPadKeyDown(event, index)
                                }
                                className={cn(
                                    focusRing,
                                    "h-[120px] cursor-pointer rounded-tv border-[3px] p-0 leading-none text-white disabled:cursor-default disabled:opacity-35",
                                    isText
                                        ? "border-line-tv bg-transparent font-sans text-[34px] font-semibold text-text-on-panel-muted"
                                        : "border-transparent bg-charcoal font-display text-[64px] font-normal",
                                )}
                            >
                                {key}
                            </button>
                        );
                    })}
                </div>
            </section>

            <footer className="type-tv-label flex flex-none items-center justify-between text-text-on-panel-eyebrow uppercase">
                <span>
                    0–9 typen · pijltjes en OK kiezen · ← wist een cijfer
                </span>
                <span>Blijft ontgrendeld op deze tv</span>
            </footer>
        </main>
    );
}

function Alert({
    title,
    mark = "!",
    tone = "error",
    children,
}: {
    title: string;
    mark?: string;
    tone?: "error" | "ok";
    children: React.ReactNode;
}) {
    return (
        <div
            className={cn(
                "box-border flex max-w-[920px] items-center gap-7 rounded-tv border-[3px] py-6 pr-9 pl-7",
                tone === "ok"
                    ? "border-sand bg-sand/8"
                    : "border-orange-300 bg-cta/10",
            )}
        >
            <span
                aria-hidden="true"
                className={cn(
                    "size-[76px] flex-none rounded-full text-center font-display text-[52px] leading-[76px] text-ink",
                    tone === "ok" ? "bg-sand" : "bg-orange-200",
                )}
            >
                {mark}
            </span>
            <div>
                <p className="type-tv-block-title m-0 text-white">{title}</p>
                <p
                    className={cn(
                        "mt-2 font-sans text-[34px] leading-[44px]",
                        tone === "ok"
                            ? "text-text-on-panel-muted"
                            : "text-orange-200",
                    )}
                >
                    {children}
                </p>
            </div>
        </div>
    );
}
