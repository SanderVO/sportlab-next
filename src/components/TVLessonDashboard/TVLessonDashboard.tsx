"use client";

import type { Lesson, Media, User } from "@/payload-types";
import { getTvDateRange } from "@/utilities/getTvLessons";
import { cn } from "@/utilities/ui";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

type TvLessonDashboardProps = {
    lessons: Lesson[];
    initialHasNextPage: boolean;
    initialNextPage: number | null;
    selectedDate: string;
    minDate: string;
    maxDate: string;
};

const lessonTypeLabels: Record<NonNullable<Lesson["type"]>, string> = {
    pt: "PT",
    semi_pt: "Semi PT",
    group: "Groepslessen",
    open_gym: "Open Gym",
};

function isUser(value: unknown): value is User {
    return typeof value === "object" && value !== null;
}

function isMedia(value: unknown): value is Media {
    return typeof value === "object" && value !== null && "url" in value;
}

function getLessonTitle(lesson: Lesson) {
    return lesson.title || `Les ${lesson.id}`;
}

function formatDate(value?: string | null) {
    if (!value) return "Nog niet gepland";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "Onbekende datum";

    return new Intl.DateTimeFormat("nl-NL", {
        weekday: "short",
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
    }).format(date);
}

function getLessonImage(lesson: Lesson) {
    return isMedia(lesson.image) ? lesson.image : null;
}

function getLessonCoachLabel(coach: number | User) {
    if (isUser(coach)) {
        return coach.name || coach.email || `Coach ${coach.id}`;
    }

    return `Coach ${coach}`;
}

function formatLessonType(type: Lesson["type"]) {
    if (!type) return "Onbekend";
    return lessonTypeLabels[type] ?? type;
}

function buildHref(pathname: string, lessonId: number) {
    return `${pathname}/${lessonId}`;
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

function toMonthKey(date: Date) {
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    return `${year}-${month}`;
}

function parseMonthKey(monthKey: string) {
    return new Date(`${monthKey}-01T00:00:00.000Z`);
}

function addDays(dateParam: string, days: number) {
    const date = parseDateParam(dateParam);
    date.setUTCDate(date.getUTCDate() + days);
    return toDateParam(date);
}

function formatDateBarLabel(dateParam: string) {
    const date = parseDateParam(dateParam);

    if (Number.isNaN(date.getTime())) {
        return {
            day: "Onbekende dag",
            date: "Onbekende datum",
        };
    }

    return {
        day: new Intl.DateTimeFormat("nl-NL", {
            weekday: "long",
        }).format(date),
        date: new Intl.DateTimeFormat("nl-NL", {
            day: "numeric",
            month: "long",
            year: "numeric",
        }).format(date),
    };
}

export function TVLessonDashboard({
    lessons,
    initialHasNextPage,
    initialNextPage,
    selectedDate,
    minDate,
    maxDate,
}: TvLessonDashboardProps) {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    const loadMoreRef = useRef<HTMLDivElement | null>(null);
    const cardRefs = useRef<Array<HTMLAnchorElement | null>>([]);
    const [loadedLessons, setLoadedLessons] = useState<Lesson[]>(lessons);
    const [hasNextPage, setHasNextPage] = useState(initialHasNextPage);
    const [nextPage, setNextPage] = useState<number | null>(initialNextPage);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [calendarMonthKey, setCalendarMonthKey] = useState(
        selectedDate.slice(0, 7),
    );
    const formattedDateBar = useMemo(
        () => formatDateBarLabel(selectedDate),
        [selectedDate],
    );
    const todayDate = useMemo(() => getTvDateRange().today, []);

    const canGoPreviousDay = selectedDate > minDate;
    const canGoNextDay = selectedDate < maxDate;
    const isTodaySelected = selectedDate === todayDate;
    const calendarMonthDate = useMemo(
        () => parseMonthKey(calendarMonthKey),
        [calendarMonthKey],
    );
    const calendarMonthLabel = useMemo(
        () =>
            new Intl.DateTimeFormat("nl-NL", {
                month: "long",
                year: "numeric",
            }).format(calendarMonthDate),
        [calendarMonthDate],
    );

    const calendarDays = useMemo(() => {
        const year = calendarMonthDate.getUTCFullYear();
        const month = calendarMonthDate.getUTCMonth();
        const monthStart = new Date(Date.UTC(year, month, 1));
        const monthEnd = new Date(Date.UTC(year, month + 1, 0));
        const daysInMonth = monthEnd.getUTCDate();
        const startWeekday = (monthStart.getUTCDay() + 6) % 7;

        const cells: Array<{
            dateParam: string;
            day: number;
            disabled: boolean;
            isSelected: boolean;
            isToday: boolean;
        } | null> = [];

        for (let index = 0; index < startWeekday; index++) {
            cells.push(null);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(Date.UTC(year, month, day));
            const dateParam = toDateParam(date);

            cells.push({
                dateParam,
                day,
                disabled: dateParam < minDate || dateParam > maxDate,
                isSelected: dateParam === selectedDate,
                isToday: dateParam === todayDate,
            });
        }

        return cells;
    }, [calendarMonthDate, maxDate, minDate, selectedDate, todayDate]);

    const canGoPreviousMonth = useMemo(() => {
        const previousMonthStart = new Date(calendarMonthDate);
        previousMonthStart.setUTCMonth(previousMonthStart.getUTCMonth() - 1);
        const previousMonthEnd = new Date(
            Date.UTC(
                previousMonthStart.getUTCFullYear(),
                previousMonthStart.getUTCMonth() + 1,
                0,
            ),
        );

        return toDateParam(previousMonthEnd) >= minDate;
    }, [calendarMonthDate, minDate]);

    const canGoNextMonth = useMemo(() => {
        const nextMonthStart = new Date(calendarMonthDate);
        nextMonthStart.setUTCMonth(nextMonthStart.getUTCMonth() + 1);

        return toDateParam(nextMonthStart) <= maxDate;
    }, [calendarMonthDate, maxDate]);

    const navigateToDate = (date: string) => {
        if (date < minDate || date > maxDate || date === selectedDate) {
            return;
        }

        const params = new URLSearchParams(searchParams.toString());
        params.set("date", date);
        params.delete("page");

        router.push(`${pathname}?${params.toString()}`);
    };

    const onDateInputChange = (nextDate: string) => {
        if (!nextDate) {
            return;
        }

        setIsCalendarOpen(false);
        navigateToDate(nextDate);
    };

    const openCalendar = () => {
        setCalendarMonthKey(selectedDate.slice(0, 7));
        setIsCalendarOpen(true);
    };

    useEffect(() => {
        setLoadedLessons(lessons);
        setHasNextPage(initialHasNextPage);
        setNextPage(initialNextPage);
        setIsLoadingMore(false);
        setActiveIndex(0);
    }, [lessons, initialHasNextPage, initialNextPage]);

    const visibleLessons = useMemo(() => loadedLessons, [loadedLessons]);

    useEffect(() => {
        setCalendarMonthKey(selectedDate.slice(0, 7));
    }, [selectedDate]);

    useEffect(() => {
        if (visibleLessons.length === 0) {
            setActiveIndex(0);
            return;
        }

        setActiveIndex((current) =>
            Math.min(current, visibleLessons.length - 1),
        );
    }, [visibleLessons.length]);

    const focusCard = (index: number) => {
        if (index < 0 || index >= visibleLessons.length) {
            return;
        }

        setActiveIndex(index);
        cardRefs.current[index]?.scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "center",
        });
        cardRefs.current[index]?.focus();
    };

    const moveCard = (direction: -1 | 1) => {
        focusCard(activeIndex + direction);
    };

    const moveVerticalCard = (direction: -1 | 1) => {
        const currentCard = cardRefs.current[activeIndex];

        if (!currentCard) {
            moveCard(direction);
            return;
        }

        const currentRect = currentCard.getBoundingClientRect();
        const currentCenterX = currentRect.left + currentRect.width / 2;
        const currentCenterY = currentRect.top + currentRect.height / 2;

        let bestIndex: number | null = null;
        let bestDistance = Number.POSITIVE_INFINITY;

        cardRefs.current.forEach((card, index) => {
            if (!card || index === activeIndex) {
                return;
            }

            const rect = card.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const isInDirection =
                direction < 0
                    ? centerY < currentCenterY
                    : centerY > currentCenterY;

            if (!isInDirection) {
                return;
            }

            const verticalDistance = Math.abs(centerY - currentCenterY);
            const horizontalDistance = Math.abs(centerX - currentCenterX);
            const score = verticalDistance * 2 + horizontalDistance;

            if (score < bestDistance) {
                bestDistance = score;
                bestIndex = index;
            }
        });

        if (bestIndex != null) {
            focusCard(bestIndex);
        }
    };

    useEffect(() => {
        if (!loadMoreRef.current || !hasNextPage || nextPage == null) {
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                if (!entries[0]?.isIntersecting || isLoadingMore) {
                    return;
                }

                setIsLoadingMore(true);

                const params = new URLSearchParams();
                params.set("page", String(nextPage));
                params.set("date", selectedDate);

                fetch(`/api/tv-lessons?${params.toString()}`)
                    .then((response) => {
                        if (!response.ok) {
                            throw new Error("Failed to load lessons");
                        }

                        return response.json() as Promise<{
                            docs: Lesson[];
                            hasNextPage: boolean;
                            nextPage: number | null;
                        }>;
                    })
                    .then((data) => {
                        setLoadedLessons((current) => {
                            const existingIds = new Set(
                                current.map((item) => item.id),
                            );
                            const uniqueLessons = data.docs.filter(
                                (lesson) => !existingIds.has(lesson.id),
                            );

                            return [...current, ...uniqueLessons];
                        });
                        setHasNextPage(data.hasNextPage);
                        setNextPage(data.nextPage);
                    })
                    .catch((error) => {
                        console.error("[tv-lessons]", error);
                        setHasNextPage(false);
                    })
                    .finally(() => {
                        setIsLoadingMore(false);
                    });
            },
            {
                rootMargin: "400px",
            },
        );

        observer.observe(loadMoreRef.current);

        return () => observer.disconnect();
    }, [hasNextPage, isLoadingMore, nextPage, selectedDate]);

    useEffect(() => {
        if (isCalendarOpen) {
            return;
        }

        const onKeyDown = (event: KeyboardEvent) => {
            const target = event.target;

            if (
                target instanceof HTMLElement &&
                (target.tagName === "INPUT" ||
                    target.tagName === "TEXTAREA" ||
                    target.tagName === "SELECT" ||
                    target.isContentEditable)
            ) {
                return;
            }

            if (event.key === "ArrowLeft") {
                event.preventDefault();
                moveCard(-1);
            }

            if (event.key === "ArrowRight") {
                event.preventDefault();
                moveCard(1);
            }

            if (event.key === "ArrowUp") {
                event.preventDefault();
                moveVerticalCard(-1);
            }

            if (event.key === "ArrowDown") {
                event.preventDefault();
                moveVerticalCard(1);
            }
        };

        window.addEventListener("keydown", onKeyDown);

        return () => window.removeEventListener("keydown", onKeyDown);
    }, [activeIndex, isCalendarOpen, visibleLessons.length]);

    useEffect(() => {
        if (!isCalendarOpen) {
            return;
        }

        const onEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setIsCalendarOpen(false);
            }
        };

        window.addEventListener("keydown", onEscape);

        return () => window.removeEventListener("keydown", onEscape);
    }, [isCalendarOpen]);

    return (
        <div className="relative min-h-screen overflow-hidden px-4 py-4 text-white sm:px-6 sm:py-6 lg:px-8 lg:py-8">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute left-1/2 top-0 h-64 w-2xl -translate-x-1/2 rounded-full bg-cta/10 blur-3xl" />
                <div className="absolute right-0 top-1/4 h-80 w-80 rounded-full bg-white/5 blur-3xl" />
                <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-steel/10 blur-3xl" />
            </div>

            <main className="relative z-10">
                <div className="mb-4 flex items-center justify-between gap-3 rounded-3xl border border-white/15 bg-[#120f0c]/80 px-3 py-3 backdrop-blur sm:mb-6 sm:px-4">
                    <button
                        type="button"
                        onClick={() =>
                            navigateToDate(addDays(selectedDate, -1))
                        }
                        disabled={!canGoPreviousDay}
                        className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/15 bg-white/5 text-2xl leading-none text-white transition hover:border-cta/50 hover:text-[#f7d7b8] disabled:cursor-not-allowed disabled:opacity-35"
                        aria-label="Vorige dag"
                    >
                        {"<"}
                    </button>

                    <div className="flex min-w-0 flex-1 justify-center">
                        <button
                            type="button"
                            onClick={openCalendar}
                            className="group rounded-2xl px-4 py-1 text-center transition hover:bg-white/5"
                            aria-label="Open kalender"
                        >
                            <p className="text-xs uppercase tracking-[0.3em] text-white/60">
                                {formattedDateBar.day}
                            </p>
                            <p className="mt-1 text-xl uppercase tracking-[0.08em] text-white font-(--font-archivo)">
                                {formattedDateBar.date}
                            </p>
                        </button>
                    </div>

                    <button
                        type="button"
                        onClick={() => navigateToDate(todayDate)}
                        disabled={isTodaySelected}
                        className="rounded-2xl border border-white/15 bg-white/5 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:border-cta/50 hover:text-[#f7d7b8] disabled:cursor-not-allowed disabled:opacity-35"
                        aria-label="Ga naar vandaag"
                    >
                        Vandaag
                    </button>

                    <button
                        type="button"
                        onClick={() => navigateToDate(addDays(selectedDate, 1))}
                        disabled={!canGoNextDay}
                        className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/15 bg-white/5 text-2xl leading-none text-white transition hover:border-cta/50 hover:text-[#f7d7b8] disabled:cursor-not-allowed disabled:opacity-35"
                        aria-label="Volgende dag"
                    >
                        {">"}
                    </button>
                </div>

                {visibleLessons.length === 0 ? (
                    <div className="flex min-h-[75vh] items-center justify-center rounded-4xl border border-dashed border-white/15 bg-warm-white/4 p-8 text-center text-white/60">
                        Geen lessen gevonden voor deze filter.
                    </div>
                ) : (
                    <>
                        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                            {visibleLessons.map((lesson, index) => {
                                const href = buildHref(pathname, lesson.id);

                                const lessonImage = getLessonImage(lesson);

                                const coachLabels = (lesson.coaches ?? []).map(
                                    (coach) =>
                                        getLessonCoachLabel(
                                            coach as number | User,
                                        ),
                                );

                                return (
                                    <Link
                                        key={lesson.id}
                                        href={href}
                                        ref={(element) => {
                                            cardRefs.current[index] = element;
                                        }}
                                        onMouseEnter={() =>
                                            setActiveIndex(index)
                                        }
                                        onFocus={() => setActiveIndex(index)}
                                        className={cn(
                                            "group overflow-hidden rounded-4xl border border-white/10 bg-ink shadow-[0_18px_50px_rgba(0,0,0,0.35)] transition duration-200 hover:-translate-y-1 hover:border-cta/40 hover:shadow-[0_24px_70px_rgba(0,0,0,0.45)]",
                                            activeIndex === index &&
                                                "border-cta/60 shadow-[0_0_0_1px_rgba(232,132,43,0.35),0_24px_70px_rgba(0,0,0,0.55)]",
                                        )}
                                    >
                                        <div
                                            className="relative overflow-hidden bg-charcoal"
                                            style={{ aspectRatio: "4 / 5" }}
                                        >
                                            {lessonImage?.url ? (
                                                <Image
                                                    src={lessonImage.url}
                                                    alt={
                                                        lessonImage.alt ||
                                                        getLessonTitle(lesson)
                                                    }
                                                    fill
                                                    className="object-cover transition duration-500 group-hover:scale-105"
                                                />
                                            ) : (
                                                <div
                                                    className="absolute inset-0"
                                                    style={{
                                                        backgroundImage:
                                                            "radial-gradient(circle at top, rgba(255,255,255,0.12), transparent 36%), linear-gradient(180deg, rgba(20,17,13,0.2), rgba(20,17,13,0.9))",
                                                    }}
                                                />
                                            )}

                                            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,17,13,0.08)_0%,rgba(20,17,13,0.18)_38%,rgba(20,17,13,0.88)_100%)]" />

                                            <div className="absolute inset-x-0 top-0 flex items-center justify-between px-4 py-4 text-[0.7rem] uppercase tracking-[0.28em] text-white/80">
                                                {coachLabels[0] && (
                                                    <span className="rounded-full border border-white/10 bg-black/70 px-3 py-1 text-[0.65rem] uppercase tracking-[0.25em] text-white/90">
                                                        {coachLabels[0]}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="absolute inset-x-0 bottom-0 p-4">
                                                <p className="text-[0.7rem] uppercase tracking-[0.28em] text-white/55">
                                                    {formatLessonType(
                                                        lesson.type,
                                                    )}
                                                </p>

                                                <h2 className="mt-2 text-3xl uppercase tracking-[0.08em] text-white font-(--font-archivo)">
                                                    {getLessonTitle(lesson)}
                                                </h2>

                                                <div className="mt-4 flex items-center justify-between gap-3 text-sm text-white/70">
                                                    <p className="truncate">
                                                        {formatDate(
                                                            lesson.startDate,
                                                        )}
                                                    </p>

                                                    <span className="rounded-full border border-cta/35 bg-cta/15 px-3 py-1 text-[0.65rem] uppercase tracking-[0.25em] text-[#f7d7b8]">
                                                        Open
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                        <div ref={loadMoreRef} className="h-10" />
                        {isLoadingMore ? (
                            <div className="py-6 text-center text-sm uppercase tracking-[0.25em] text-white/50">
                                Meer lessen laden...
                            </div>
                        ) : null}
                    </>
                )}
            </main>

            {isCalendarOpen ? (
                <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/65 px-4">
                    <button
                        type="button"
                        className="absolute inset-0"
                        onClick={() => setIsCalendarOpen(false)}
                        aria-label="Sluit kalender"
                    />

                    <div className="relative z-10 w-full max-w-md rounded-3xl border border-white/20 bg-[#120f0c] p-5 text-white shadow-[0_35px_80px_rgba(0,0,0,0.55)]">
                        <div className="mb-4 flex items-center justify-between gap-3">
                            <button
                                type="button"
                                onClick={() => {
                                    if (!canGoPreviousMonth) {
                                        return;
                                    }

                                    const previousMonth = new Date(
                                        calendarMonthDate,
                                    );
                                    previousMonth.setUTCMonth(
                                        previousMonth.getUTCMonth() - 1,
                                    );
                                    setCalendarMonthKey(
                                        toMonthKey(previousMonth),
                                    );
                                }}
                                disabled={!canGoPreviousMonth}
                                className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/15 bg-white/5 text-xl leading-none transition hover:border-cta/50 disabled:cursor-not-allowed disabled:opacity-35"
                                aria-label="Vorige maand"
                            >
                                {"<"}
                            </button>

                            <p className="text-sm uppercase tracking-[0.2em] text-white/80">
                                {calendarMonthLabel}
                            </p>

                            <button
                                type="button"
                                onClick={() => {
                                    if (!canGoNextMonth) {
                                        return;
                                    }

                                    const nextMonth = new Date(
                                        calendarMonthDate,
                                    );
                                    nextMonth.setUTCMonth(
                                        nextMonth.getUTCMonth() + 1,
                                    );
                                    setCalendarMonthKey(toMonthKey(nextMonth));
                                }}
                                disabled={!canGoNextMonth}
                                className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/15 bg-white/5 text-xl leading-none transition hover:border-cta/50 disabled:cursor-not-allowed disabled:opacity-35"
                                aria-label="Volgende maand"
                            >
                                {">"}
                            </button>
                        </div>

                        <div className="mb-2 grid grid-cols-7 gap-1 text-center text-xs uppercase tracking-[0.12em] text-white/45">
                            {["ma", "di", "wo", "do", "vr", "za", "zo"].map(
                                (day) => (
                                    <span key={day}>{day}</span>
                                ),
                            )}
                        </div>

                        <div className="grid grid-cols-7 gap-1">
                            {calendarDays.map((cell, index) => {
                                if (!cell) {
                                    return (
                                        <span
                                            key={`empty-${index}`}
                                            className="h-10"
                                        />
                                    );
                                }

                                return (
                                    <button
                                        key={cell.dateParam}
                                        type="button"
                                        onClick={() =>
                                            onDateInputChange(cell.dateParam)
                                        }
                                        disabled={cell.disabled}
                                        className={cn(
                                            "h-10 rounded-xl text-sm transition",
                                            cell.disabled
                                                ? "cursor-not-allowed text-white/20"
                                                : "bg-white/5 text-white hover:bg-white/12",
                                            cell.isSelected &&
                                                "border border-cta/50 bg-cta/20 text-[#f7d7b8]",
                                            cell.isToday &&
                                                !cell.isSelected &&
                                                "border border-white/35",
                                        )}
                                        aria-label={`Selecteer ${cell.dateParam}`}
                                    >
                                        {cell.day}
                                    </button>
                                );
                            })}
                        </div>

                        <div className="mt-4 flex items-center justify-between gap-2">
                            <button
                                type="button"
                                onClick={() => onDateInputChange(todayDate)}
                                disabled={isTodaySelected}
                                className="rounded-2xl border border-white/15 bg-white/5 px-3 py-2 text-xs uppercase tracking-[0.14em] text-white transition hover:border-cta/50 disabled:cursor-not-allowed disabled:opacity-35"
                            >
                                Vandaag
                            </button>

                            <button
                                type="button"
                                onClick={() => setIsCalendarOpen(false)}
                                className="rounded-2xl border border-white/15 px-3 py-2 text-xs uppercase tracking-[0.14em] text-white/80 transition hover:border-white/35 hover:text-white"
                            >
                                Sluiten
                            </button>
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    );
}
