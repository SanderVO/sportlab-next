"use client";

import type { Lesson, Media, User } from "@/payload-types";
import { cn } from "@/utilities/ui";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

type TvLessonDashboardProps = {
    lessons: Lesson[];
    initialHasNextPage: boolean;
    initialNextPage: number | null;
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

export function TVLessonDashboard({
    lessons,
    initialHasNextPage,
    initialNextPage,
}: TvLessonDashboardProps) {
    const pathname = usePathname();
    const loadMoreRef = useRef<HTMLDivElement | null>(null);
    const cardRefs = useRef<Array<HTMLAnchorElement | null>>([]);
    const [loadedLessons, setLoadedLessons] = useState<Lesson[]>(lessons);
    const [hasNextPage, setHasNextPage] = useState(initialHasNextPage);
    const [nextPage, setNextPage] = useState<number | null>(initialNextPage);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        setLoadedLessons(lessons);
        setHasNextPage(initialHasNextPage);
        setNextPage(initialNextPage);
        setIsLoadingMore(false);
        setActiveIndex(0);
    }, [lessons, initialHasNextPage, initialNextPage]);

    const visibleLessons = useMemo(() => loadedLessons, [loadedLessons]);

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
    }, [hasNextPage, isLoadingMore, nextPage]);

    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
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
    }, [activeIndex, visibleLessons.length]);

    return (
        <div className="relative min-h-screen overflow-hidden px-4 py-4 text-white sm:px-6 sm:py-6 lg:px-8 lg:py-8">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute left-1/2 top-0 h-64 w-2xl -translate-x-1/2 rounded-full bg-[#e8842b]/10 blur-3xl" />
                <div className="absolute right-0 top-1/4 h-80 w-80 rounded-full bg-white/5 blur-3xl" />
                <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-[#46555f]/10 blur-3xl" />
            </div>

            <main className="relative z-10">
                {visibleLessons.length === 0 ? (
                    <div className="flex min-h-[75vh] items-center justify-center rounded-4xl border border-dashed border-white/15 bg-[#f6f2ea]/4 p-8 text-center text-white/60">
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
                                            "group overflow-hidden rounded-4xl border border-white/10 bg-[#14110d] shadow-[0_18px_50px_rgba(0,0,0,0.35)] transition duration-200 hover:-translate-y-1 hover:border-[#e8842b]/40 hover:shadow-[0_24px_70px_rgba(0,0,0,0.45)]",
                                            activeIndex === index &&
                                                "border-[#e8842b]/60 shadow-[0_0_0_1px_rgba(232,132,43,0.35),0_24px_70px_rgba(0,0,0,0.55)]",
                                        )}
                                    >
                                        <div
                                            className="relative overflow-hidden bg-[#241e17]"
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
                                                <span>
                                                    {formatLessonType(
                                                        lesson.type,
                                                    )}
                                                </span>
                                                <span className="rounded-full border border-white/10 bg-black/70 px-3 py-1 text-[0.65rem] uppercase tracking-[0.25em] text-white/90">
                                                    {coachLabels[0] ??
                                                        "Geen coach gekoppeld"}
                                                </span>
                                            </div>

                                            <div className="absolute inset-x-0 bottom-0 p-4">
                                                <p className="text-[0.7rem] uppercase tracking-[0.28em] text-white/55">
                                                    Leskaart
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

                                                    <span className="rounded-full border border-[#e8842b]/35 bg-[#e8842b]/15 px-3 py-1 text-[0.65rem] uppercase tracking-[0.25em] text-[#f7d7b8]">
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
        </div>
    );
}
