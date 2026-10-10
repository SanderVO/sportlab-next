"use client";

import type { Lesson, Program, User } from "@/payload-types";
import { TvClock } from "@/components/TvClock/TvClock";
import { getTvDateRange, type TvDaySummary } from "@/utilities/getTvLessons";
import { cn } from "@/utilities/ui";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

type TvLessonDashboardProps = {
    lessons: Lesson[];
    initialHasNextPage: boolean;
    initialNextPage: number | null;
    selectedDate: string;
};

// The design caps a day at 6 classes (2x3 dense grid).
const MAX_LESSONS = 6;
const DENSE_FROM = 4;
const TV_TIME_ZONE = "Europe/Amsterdam";

const lessonTypeLabels: Record<NonNullable<Lesson["type"]>, string> = {
    pt: "PT",
    semi_pt: "Semi PT",
    group: "Groepslessen",
    open_gym: "Open Gym",
};

const lessonStatusLabels: Record<NonNullable<Lesson["status"]>, string> = {
    open: "Open",
    closed: "Gesloten",
};

const focusRing =
    "outline-none focus-visible:outline-[6px] focus-visible:outline-offset-[6px] focus-visible:outline-focus-ring";

const accents = [
    {
        bar: "bg-orange-300",
        fill: "border-orange-700 bg-orange-700 text-white",
    },
    {
        bar: "bg-orange-200",
        fill: "border-orange-200 bg-orange-200 text-ink",
    },
];

function isUser(value: unknown): value is User {
    return typeof value === "object" && value !== null;
}

function isProgram(value: unknown): value is Program {
    return typeof value === "object" && value !== null && "title" in value;
}

function getLessonCoachLabel(coach: number | User) {
    if (isUser(coach)) {
        return coach.name || coach.email || `Coach ${coach.id}`;
    }

    return `Coach ${coach}`;
}

function toDateParam(date: Date) {
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function parseDateParam(dateParam: string) {
    return new Date(`${dateParam}T00:00:00.000Z`);
}

function addDays(dateParam: string, days: number) {
    const date = parseDateParam(dateParam);
    date.setUTCDate(date.getUTCDate() + days);
    return toDateParam(date);
}

function addMonths(dateParam: string, months: number) {
    const date = parseDateParam(dateParam);
    const day = date.getUTCDate();
    date.setUTCDate(1);
    date.setUTCMonth(date.getUTCMonth() + months);
    const lastDay = new Date(
        Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0),
    ).getUTCDate();
    date.setUTCDate(Math.min(day, lastDay));
    return toDateParam(date);
}

function formatTime(value?: string | null) {
    if (!value) return "--:--";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "--:--";

    return new Intl.DateTimeFormat("nl-NL", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: TV_TIME_ZONE,
    }).format(date);
}

function formatShortDate(value?: string | null) {
    if (!value) return "";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "";

    return new Intl.DateTimeFormat("nl-NL", {
        weekday: "short",
        day: "numeric",
        month: "short",
        timeZone: TV_TIME_ZONE,
    })
        .format(date)
        .replace(/\./g, "");
}

function formatLongDate(dateParam: string) {
    const date = parseDateParam(dateParam);

    return {
        weekdayDate: new Intl.DateTimeFormat("nl-NL", {
            weekday: "long",
            day: "numeric",
            month: "long",
            timeZone: "UTC",
        }).format(date),
        weekday: new Intl.DateTimeFormat("nl-NL", {
            weekday: "long",
            timeZone: "UTC",
        }).format(date),
        dayMonth: new Intl.DateTimeFormat("nl-NL", {
            day: "numeric",
            month: "long",
            timeZone: "UTC",
        }).format(date),
        year: String(date.getUTCFullYear()),
        month: new Intl.DateTimeFormat("nl-NL", {
            month: "long",
            year: "numeric",
            timeZone: "UTC",
        }).format(date),
    };
}

function CalendarIcon() {
    return (
        <svg
            className="size-10 flex-none"
            viewBox="0 0 40 40"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            aria-hidden="true"
        >
            <rect x="5" y="8" width="30" height="27" rx="4" />
            <path d="M5 16h30M13 4v8M27 4v8" />
            <rect
                x="11"
                y="21"
                width="6"
                height="6"
                fill="currentColor"
                stroke="none"
            />
        </svg>
    );
}

export function TVLessonDashboard({
    lessons,
    selectedDate,
}: TvLessonDashboardProps) {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    const cardRefs = useRef<Array<HTMLAnchorElement | null>>([]);
    const [requestedIndex, setActiveIndex] = useState(0);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [calendarFocusDate, setCalendarFocusDate] = useState(selectedDate);
    const [monthSummaries, setMonthSummaries] = useState<
        Record<string, TvDaySummary>
    >({});
    const calendarMonthKey = calendarFocusDate.slice(0, 7);
    const monthSummary = monthSummaries[calendarMonthKey];

    const todayDate = useMemo(() => getTvDateRange().today, []);
    const labels = useMemo(() => formatLongDate(selectedDate), [selectedDate]);
    const calendarLabels = useMemo(
        () => formatLongDate(calendarFocusDate),
        [calendarFocusDate],
    );

    const visibleLessons = lessons.slice(0, MAX_LESSONS);
    const isDense = visibleLessons.length >= DENSE_FROM;
    const isToday = selectedDate === todayDate;
    const activeIndex = Math.min(
        requestedIndex,
        Math.max(visibleLessons.length - 1, 0),
    );

    const focusedDayLessons = monthSummary?.[calendarFocusDate] ?? [];

    const calendarCells = useMemo(() => {
        const focus = parseDateParam(calendarFocusDate);
        const year = focus.getUTCFullYear();
        const month = focus.getUTCMonth();
        const first = new Date(Date.UTC(year, month, 1));
        const startOffset = (first.getUTCDay() + 6) % 7;
        const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
        const total = Math.ceil((startOffset + daysInMonth) / 7) * 7;

        return Array.from({ length: total }, (_, index) => {
            const date = new Date(
                Date.UTC(year, month, index - startOffset + 1),
            );
            const dateParam = toDateParam(date);

            return {
                dateParam,
                day: date.getUTCDate(),
                outside: date.getUTCMonth() !== month,
            };
        });
    }, [calendarFocusDate]);

    useEffect(() => {
        if (!isCalendarOpen || monthSummaries[calendarMonthKey]) {
            return;
        }

        const controller = new AbortController();

        fetch(`/api/tv-lesson-summary?month=${calendarMonthKey}`, {
            signal: controller.signal,
        })
            .then((response) => {
                if (!response.ok) throw new Error("Failed to load summary");
                return response.json() as Promise<{ days: TvDaySummary }>;
            })
            .then((data) =>
                setMonthSummaries((current) => ({
                    ...current,
                    [calendarMonthKey]: data.days,
                })),
            )
            .catch((error) => {
                if (error.name !== "AbortError") {
                    console.error("[tv-lesson-summary]", error);
                }
            });

        return () => controller.abort();
    }, [calendarMonthKey, isCalendarOpen, monthSummaries]);

    const navigateToDate = (date: string) => {
        if (date === selectedDate) {
            return;
        }

        const params = new URLSearchParams(searchParams.toString());
        params.set("date", date);
        params.delete("page");

        router.push(`${pathname}?${params.toString()}`);
    };

    const openCalendar = () => {
        setCalendarFocusDate(selectedDate);
        setIsCalendarOpen(true);
    };

    const pickDate = (date: string) => {
        setIsCalendarOpen(false);
        navigateToDate(date);
    };

    const focusCard = (index: number) => {
        if (index < 0 || index >= visibleLessons.length) {
            return;
        }

        setActiveIndex(index);
        cardRefs.current[index]?.focus();
    };

    const moveVerticalCard = (direction: -1 | 1) => {
        const currentCard = cardRefs.current[activeIndex];

        if (!currentCard) {
            focusCard(activeIndex + direction);
            return;
        }

        const currentRect = currentCard.getBoundingClientRect();
        const currentX = currentRect.left + currentRect.width / 2;
        const currentY = currentRect.top + currentRect.height / 2;

        let bestIndex: number | null = null;
        let bestScore = Number.POSITIVE_INFINITY;

        cardRefs.current.forEach((card, index) => {
            if (!card || index === activeIndex) {
                return;
            }

            const rect = card.getBoundingClientRect();
            const x = rect.left + rect.width / 2;
            const y = rect.top + rect.height / 2;

            if (direction < 0 ? y >= currentY - 1 : y <= currentY + 1) {
                return;
            }

            const score = Math.abs(y - currentY) * 2 + Math.abs(x - currentX);

            if (score < bestScore) {
                bestScore = score;
                bestIndex = index;
            }
        });

        if (bestIndex != null) {
            focusCard(bestIndex);
        }
    };

    // Remote: left/right changes the day, up/down moves between rows.
    useEffect(() => {
        if (isCalendarOpen) {
            return;
        }

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "ArrowLeft") {
                event.preventDefault();
                navigateToDate(addDays(selectedDate, -1));
            } else if (event.key === "ArrowRight") {
                event.preventDefault();
                navigateToDate(addDays(selectedDate, 1));
            } else if (event.key === "ArrowUp") {
                event.preventDefault();
                moveVerticalCard(-1);
            } else if (event.key === "ArrowDown") {
                event.preventDefault();
                moveVerticalCard(1);
            }
        };

        window.addEventListener("keydown", onKeyDown);

        return () => window.removeEventListener("keydown", onKeyDown);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeIndex, isCalendarOpen, selectedDate, visibleLessons.length]);

    // Calendar: arrows move day by day (up/down by week), OK selects, Back closes.
    useEffect(() => {
        if (!isCalendarOpen) {
            return;
        }

        const move = (days: number) =>
            setCalendarFocusDate((current) => addDays(current, days));

        const onKeyDown = (event: KeyboardEvent) => {
            const onButton =
                event.target instanceof HTMLElement &&
                event.target.tagName === "BUTTON";

            if (event.key === "Escape" || event.key === "Backspace") {
                event.preventDefault();
                setIsCalendarOpen(false);
            } else if (event.key === "ArrowLeft") {
                event.preventDefault();
                move(-1);
            } else if (event.key === "ArrowRight") {
                event.preventDefault();
                move(1);
            } else if (event.key === "ArrowUp") {
                event.preventDefault();
                move(-7);
            } else if (event.key === "ArrowDown") {
                event.preventDefault();
                move(7);
            } else if (event.key === "Enter" && !onButton) {
                event.preventDefault();
                pickDate(calendarFocusDate);
            }
        };

        window.addEventListener("keydown", onKeyDown);

        return () => window.removeEventListener("keydown", onKeyDown);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [calendarFocusDate, isCalendarOpen, selectedDate]);

    const circleButton = cn(
        "inline-flex size-24 items-center justify-center rounded-pill border-[3px] border-white bg-transparent font-display text-5xl leading-none text-white disabled:opacity-35",
        focusRing,
    );
    const ghostButton = cn(
        "inline-flex h-24 items-center justify-center gap-[14px] whitespace-nowrap rounded-pill border-[3px] border-white bg-transparent px-12 font-sans text-[34px] leading-none font-semibold text-white disabled:opacity-35",
        focusRing,
    );

    return (
        <main className="relative box-border flex h-[1080px] flex-col px-tv-safe-x py-tv-safe-y text-white">
            <header className="flex h-[72px] flex-none items-center justify-between">
                <span className="font-label text-[32px] leading-none font-extrabold tracking-[0.25em] uppercase">
                    Sportlab
                </span>
                <TvClock />
            </header>

            <section
                className={cn(
                    "flex items-end justify-between",
                    isDense ? "mt-8" : "mt-14",
                )}
            >
                <div className="min-w-0">
                    <div className="type-tv-label text-sand uppercase">
                        {isToday ? "Vandaag · " : ""}Groepslessen
                        {isDense ? ` · ${visibleLessons.length} lessen` : ""}
                    </div>
                    <h1
                        className={cn(
                            "type-tv-title mt-3",
                            isDense && "text-[96px]",
                        )}
                    >
                        {labels.weekdayDate}
                    </h1>
                    {!isDense ? (
                        <div className="type-tv-body mt-3 text-text-on-panel-muted">
                            {labels.year} · {visibleLessons.length}{" "}
                            {visibleLessons.length === 1 ? "les" : "lessen"}
                        </div>
                    ) : null}
                </div>

                <nav
                    className="flex items-center gap-6"
                    aria-label="Dag kiezen"
                >
                    <button
                        type="button"
                        className={circleButton}
                        onClick={() =>
                            navigateToDate(addDays(selectedDate, -1))
                        }
                        aria-label="Vorige dag"
                    >
                        ‹
                    </button>
                    <button
                        type="button"
                        className={circleButton}
                        onClick={() => navigateToDate(addDays(selectedDate, 1))}
                        aria-label="Volgende dag"
                    >
                        ›
                    </button>
                    <button
                        type="button"
                        className={ghostButton}
                        onClick={openCalendar}
                        aria-haspopup="dialog"
                    >
                        <CalendarIcon />
                        Kalender
                    </button>
                </nav>
            </section>

            {visibleLessons.length === 0 ? (
                <div className="mt-16 flex flex-1 items-center justify-center rounded-tv bg-charcoal">
                    <p className="type-tv-heading text-text-on-panel-muted">
                        Geen lessen op deze dag
                    </p>
                </div>
            ) : (
                <section
                    className={cn(
                        isDense
                            ? "mt-10 grid min-h-0 flex-1 grid-flow-col grid-cols-2 grid-rows-3 gap-x-tv-gap gap-y-7"
                            : "mt-16 flex flex-col gap-tv-gap",
                    )}
                >
                    {visibleLessons.map((lesson, index) => {
                        const accent = accents[index % accents.length];
                        const program = isProgram(lesson.program)
                            ? lesson.program
                            : null;
                        const coaches = (lesson.coaches ?? [])
                            .map((coach) =>
                                getLessonCoachLabel(coach as number | User),
                            )
                            .join(", ");
                        const category = lesson.type
                            ? lessonTypeLabels[lesson.type]
                            : null;
                        const meta = [program?.title ?? category, coaches]
                            .filter(Boolean)
                            .join(" · ");
                        const status = lesson.status
                            ? lessonStatusLabels[lesson.status]
                            : null;
                        const statusClass =
                            lesson.status === "closed"
                                ? "border-text-on-panel-eyebrow bg-transparent text-white"
                                : accent.fill;

                        return (
                            <Link
                                key={lesson.id}
                                href={`${pathname}/${lesson.id}`}
                                ref={(element) => {
                                    cardRefs.current[index] = element;
                                }}
                                onMouseEnter={() => setActiveIndex(index)}
                                onFocus={() => setActiveIndex(index)}
                                className={cn(
                                    "relative grid items-center overflow-hidden rounded-tv bg-charcoal text-white no-underline",
                                    isDense
                                        ? "grid-cols-[200px_1fr] gap-7 px-9 py-[26px]"
                                        : "grid-cols-[260px_1fr_auto_96px] gap-tv-gap px-12 py-10",
                                    focusRing,
                                )}
                            >
                                <span
                                    className={cn(
                                        "absolute inset-x-0 top-0 h-[6px]",
                                        accent.bar,
                                    )}
                                />

                                <div
                                    className={cn(
                                        "font-display leading-[0.9]",
                                        isDense
                                            ? "text-[76px]"
                                            : "type-tv-time",
                                    )}
                                >
                                    {formatTime(lesson.startDate)}
                                    <small className="type-tv-label mt-[6px] block text-orange-300 uppercase">
                                        {formatShortDate(lesson.startDate)}
                                    </small>
                                </div>

                                <div className="min-w-0">
                                    <h2
                                        className={cn(
                                            "type-tv-heading",
                                            isDense &&
                                                "truncate text-[44px] leading-[1.05]",
                                        )}
                                    >
                                        {lesson.title || `Les ${lesson.id}`}
                                    </h2>
                                    {isDense ? (
                                        <div className="mt-[14px] flex min-w-0 items-center gap-5">
                                            {status ? (
                                                <span
                                                    className={cn(
                                                        "inline-flex h-12 flex-none items-center gap-[14px] rounded-pill border-[3px] px-5 font-label text-2xl leading-none font-extrabold tracking-[0.2em] uppercase",
                                                        statusClass,
                                                    )}
                                                >
                                                    {status}
                                                </span>
                                            ) : null}
                                            <span className="min-w-0 truncate text-[28px] leading-[38px] text-text-on-panel-muted">
                                                {meta}
                                            </span>
                                        </div>
                                    ) : (
                                        <div className="type-tv-body mt-[10px] text-text-on-panel-muted">
                                            {meta}
                                        </div>
                                    )}
                                </div>

                                {!isDense ? (
                                    <>
                                        {status ? (
                                            <span
                                                className={cn(
                                                    "inline-flex h-[60px] items-center gap-[14px] rounded-pill border-[3px] px-7 font-label text-[26px] leading-none font-extrabold tracking-[0.2em] uppercase",
                                                    statusClass,
                                                )}
                                            >
                                                {lesson.status === "open" ? (
                                                    <span className="size-[14px] rounded-pill bg-orange-300" />
                                                ) : null}
                                                {status}
                                            </span>
                                        ) : (
                                            <span />
                                        )}
                                        <span
                                            className="type-tv-heading text-right text-sand"
                                            aria-hidden="true"
                                        >
                                            →
                                        </span>
                                    </>
                                ) : null}
                            </Link>
                        );
                    })}
                </section>
            )}

            <footer
                className={cn(
                    "flex items-center justify-between",
                    isDense || visibleLessons.length === 0 ? "mt-8" : "mt-auto",
                )}
            >
                <span className="type-tv-label text-orange-200 uppercase">
                    One more reason · to keep going
                </span>
                <span className="type-tv-label text-text-on-panel-eyebrow uppercase">
                    ‹ › dag wisselen · OK openen
                </span>
            </footer>

            {isCalendarOpen ? (
                <div className="absolute inset-0 z-40">
                    <div className="absolute inset-0 bg-panel-deep/90" />

                    <section
                        role="dialog"
                        aria-modal="true"
                        aria-label="Kies een datum"
                        className="absolute inset-x-24 inset-y-14 box-border grid grid-cols-[1fr_520px] grid-rows-[auto_1fr] gap-x-[72px] gap-y-8 rounded-tv border-[3px] border-line-tv bg-ink bg-[radial-gradient(60%_70%_at_0%_0%,var(--tv-glow-ember)_0%,transparent_100%),radial-gradient(55%_65%_at_100%_100%,var(--tv-glow-ember-deep)_0%,transparent_100%),radial-gradient(50%_60%_at_100%_0%,var(--panel-glow)_0%,transparent_100%),linear-gradient(180deg,var(--charcoal),var(--ink))] px-16 py-12"
                    >
                        <div className="col-span-2 flex items-end justify-between">
                            <div>
                                <div className="type-tv-label text-orange-300 uppercase">
                                    Kies een dag
                                </div>
                                <h2 className="type-tv-title mt-3 text-[96px]">
                                    {calendarLabels.month}
                                </h2>
                            </div>
                            <div className="flex gap-6">
                                <button
                                    type="button"
                                    className={circleButton}
                                    onClick={() =>
                                        setCalendarFocusDate((current) =>
                                            addMonths(current, -1),
                                        )
                                    }
                                    aria-label="Vorige maand"
                                >
                                    ‹
                                </button>
                                <button
                                    type="button"
                                    className={circleButton}
                                    onClick={() =>
                                        setCalendarFocusDate((current) =>
                                            addMonths(current, 1),
                                        )
                                    }
                                    aria-label="Volgende maand"
                                >
                                    ›
                                </button>
                            </div>
                        </div>

                        <div
                            className="grid grid-cols-7 content-start gap-3"
                            role="grid"
                            aria-label={calendarLabels.month}
                        >
                            {["MA", "DI", "WO", "DO", "VR", "ZA", "ZO"].map(
                                (day) => (
                                    <div
                                        key={day}
                                        className="type-tv-label pb-2 text-center text-text-on-panel-eyebrow"
                                    >
                                        {day}
                                    </div>
                                ),
                            )}
                            {calendarCells.map((cell) => {
                                const isFocused =
                                    cell.dateParam === calendarFocusDate;
                                const isCellToday =
                                    cell.dateParam === todayDate;
                                const hasLessons =
                                    (monthSummary?.[cell.dateParam]?.length ??
                                        0) > 0;

                                return (
                                    <button
                                        key={cell.dateParam}
                                        type="button"
                                        tabIndex={-1}
                                        onClick={() => pickDate(cell.dateParam)}
                                        aria-selected={isFocused}
                                        aria-current={
                                            isCellToday ? "date" : undefined
                                        }
                                        className={cn(
                                            "relative flex h-[104px] items-center justify-center rounded-card border-[3px] border-transparent bg-charcoal font-display text-5xl leading-none text-white",
                                            cell.outside &&
                                                "bg-transparent text-text-on-panel-eyebrow",
                                            isCellToday && "border-orange-300",
                                            hasLessons &&
                                                "after:absolute after:bottom-[14px] after:left-1/2 after:-ml-1.5 after:size-3 after:rounded-pill after:bg-orange-300",
                                            isFocused &&
                                                "bg-cta text-on-cta outline-[6px] outline-offset-[6px] outline-focus-ring after:bg-ink",
                                        )}
                                    >
                                        {cell.day}
                                    </button>
                                );
                            })}
                        </div>

                        <aside className="flex flex-col gap-[18px] border-l-[3px] border-line-tv pl-14">
                            <div className="type-tv-label text-text-on-panel-eyebrow uppercase">
                                Geselecteerd
                            </div>
                            <div className="font-display text-[64px] leading-[0.95] uppercase">
                                {calendarLabels.weekday}
                                <br />
                                {calendarLabels.dayMonth}
                            </div>
                            <div className="type-tv-body text-text-on-panel-muted">
                                {!monthSummary
                                    ? "Laden…"
                                    : `${focusedDayLessons.length} ${focusedDayLessons.length === 1 ? "les" : "lessen"}`}
                            </div>
                            <ul className="m-0 flex list-none flex-col gap-3 p-0">
                                {focusedDayLessons
                                    .slice(0, 4)
                                    .map((item, i) => (
                                        <li
                                            key={`${item.time}-${i}`}
                                            className="truncate text-[30px] leading-10 font-semibold text-white"
                                        >
                                            <span className="mr-4 text-orange-300">
                                                {item.time}
                                            </span>
                                            {item.title}
                                        </li>
                                    ))}
                            </ul>

                            <div className="mt-auto flex flex-col items-stretch gap-5">
                                <button
                                    type="button"
                                    onClick={() => pickDate(calendarFocusDate)}
                                    className={cn(
                                        "inline-flex h-24 items-center justify-center whitespace-nowrap rounded-pill border-[3px] border-transparent bg-cta px-12 font-sans text-[34px] leading-none font-semibold text-on-cta",
                                        focusRing,
                                    )}
                                >
                                    Toon dag →
                                </button>
                                <div className="flex gap-5">
                                    <button
                                        type="button"
                                        onClick={() => pickDate(todayDate)}
                                        className={cn(
                                            ghostButton,
                                            "flex-1 px-6",
                                        )}
                                    >
                                        Vandaag
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setIsCalendarOpen(false)}
                                        className={cn(
                                            ghostButton,
                                            "flex-1 px-6",
                                        )}
                                    >
                                        Sluiten
                                    </button>
                                </div>
                            </div>
                        </aside>
                    </section>
                </div>
            ) : null}
        </main>
    );
}
