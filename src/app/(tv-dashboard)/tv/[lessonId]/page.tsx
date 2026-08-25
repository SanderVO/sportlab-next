import configPromise from "@payload-config";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getPayload } from "payload";

type PageProps = {
    params: Promise<{
        lessonId: string;
    }>;
    searchParams?: Promise<{
        category?: string;
    }>;
};

export const revalidate = 60;

function formatDate(value?: string | null) {
    if (!value) return null;

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return null;

    return new Intl.DateTimeFormat("nl-NL", {
        weekday: "short",
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
    }).format(date);
}

function isMedia(
    value: unknown,
): value is { url?: string | null; alt?: string | null } {
    return typeof value === "object" && value !== null && "url" in value;
}

function isUser(
    value: unknown,
): value is { id: number; name?: string | null; email?: string | null } {
    return typeof value === "object" && value !== null;
}

function toDateParam(value: string | Date | null | undefined) {
    if (!value) {
        return null;
    }

    const date = value instanceof Date ? value : new Date(value);

    if (Number.isNaN(date.getTime())) {
        return null;
    }

    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

export default async function TvLessonPage({
    params,
    searchParams,
}: PageProps) {
    const { lessonId } = await params;
    const resolvedSearchParams = (await searchParams) ?? {};
    const payload = await getPayload({ config: configPromise });

    const lesson = await payload.findByID({
        collection: "lessons",
        id: Number(lessonId),
        depth: 2,
        overrideAccess: true,
    });

    if (!lesson) {
        notFound();
    }

    const programResult = await payload.find({
        collection: "programs",
        where: {
            "schedule.lessons": {
                equals: lesson.id,
            },
        },
        limit: 1,
        depth: 0,
        overrideAccess: true,
    });
    const program = programResult.docs[0];
    const lessonImage = isMedia(lesson.image) ? lesson.image : null;
    const lessonStartDate = formatDate(lesson.startDate);
    const lessonDateParam = toDateParam(lesson.startDate);
    const backHref = lessonDateParam
        ? `/tv?date=${lessonDateParam}${resolvedSearchParams.category ? `&category=${resolvedSearchParams.category}` : ""}`
        : `/tv${resolvedSearchParams.category ? `?category=${resolvedSearchParams.category}` : ""}`;

    return (
        <div className="relative min-h-screen overflow-hidden px-4 py-4 text-warm-white sm:px-6 sm:py-6 lg:box-border lg:flex lg:h-dvh lg:min-h-0 lg:flex-col lg:px-8 lg:py-8">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute left-1/2 top-0 h-64 w-2xl -translate-x-1/2 rounded-full bg-cta/10 blur-3xl" />
                <div className="absolute right-0 top-1/4 h-80 w-80 rounded-full bg-white/5 blur-3xl" />
                <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-steel/10 blur-3xl" />
            </div>

            <div className="relative z-10 min-h-[calc(100vh-7rem)] overflow-hidden rounded-4xl border border-white/10 bg-ink/80 shadow-2xl shadow-black/25 backdrop-blur lg:min-h-0 lg:flex-1">
                <div className="grid min-h-[calc(100vh-7rem)] md:grid-cols-[minmax(16rem,26vw)_1fr] lg:min-h-0 lg:h-full">
                    <aside className="relative min-h-80 overflow-hidden border-b border-white/10 bg-black md:min-h-full md:border-b-0 md:border-r lg:min-h-0">
                        {lessonImage?.url ? (
                            <Image
                                src={lessonImage.url}
                                alt={lessonImage.alt || lesson.title || "Les"}
                                fill
                                className="object-cover"
                                priority
                            />
                        ) : (
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),transparent_36%),linear-gradient(180deg,rgba(20,17,13,0.2),rgba(20,17,13,0.9))]" />
                        )}

                        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,17,13,0.08)_0%,rgba(20,17,13,0.24)_36%,rgba(20,17,13,0.94)_100%)]" />

                        <div className="absolute left-5 top-5 z-20 font-sl-archivo text-[2.75rem] uppercase tracking-[0.16em] text-warm-white xl:left-8 xl:top-7 xl:text-[3.25rem]">
                            Sportlab
                        </div>

                        {program?.title ? (
                            <div className="absolute right-5 top-5 z-20 max-w-[45%] rounded-full border border-cta/35 bg-cta/15 px-3 py-1 text-right text-[0.6rem] uppercase tracking-[0.16em] text-[#f7d7b8] shadow-lg shadow-black/20 backdrop-blur xl:right-8 xl:top-7">
                                {program.title}
                            </div>
                        ) : null}

                        <div className="absolute inset-0 flex items-end p-6 xl:p-10">
                            <div className="max-w-xl">
                                <p className="mt-3 text-[0.65rem] uppercase tracking-[0.25em] text-warm-white/70">
                                    {lesson.coaches
                                        ?.map((coach) =>
                                            isUser(coach) && coach.name
                                                ? coach.name
                                                : "Coach",
                                        )
                                        .join(" · ") || "Geen coach gekoppeld"}
                                </p>

                                <h1 className="mt-3 text-3xl uppercase tracking-widest text-warm-white sm:text-4xl xl:text-5xl font-sl-archivo">
                                    {lesson.title || `Les ${lesson.id}`}
                                </h1>
                            </div>
                        </div>
                    </aside>

                    <div className="min-h-0 overflow-y-auto p-4 xl:p-6">
                        <div className="grid gap-4 md:grid-cols-2 xl:gap-5">
                            {(lesson.workoutBlocks ?? []).map(
                                (block, index) => {
                                    const exercises = Array.isArray(
                                        (block as { exercises?: unknown[] })
                                            .exercises,
                                    )
                                        ? ((block as { exercises?: unknown[] })
                                              .exercises as Array<{
                                              id?: string;
                                              name?: string;
                                              description?: string;
                                          }>)
                                        : [];
                                    const workoutDescription = (
                                        block as {
                                            description?: string;
                                        }
                                    ).description;

                                    return (
                                        <section
                                            key={
                                                block.id ??
                                                `${lesson.id}-${index}`
                                            }
                                            className="rounded-3xl border border-white/10 bg-warm-white/6 p-4"
                                        >
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="min-w-0">
                                                    <h2 className="text-3xl uppercase tracking-[0.12em] text-warm-white font-sl-archivo">
                                                        {(
                                                            block as {
                                                                name?: string;
                                                            }
                                                        ).name || "Workout"}
                                                    </h2>

                                                    {workoutDescription ? (
                                                        <p className="mt-1 text-lg leading-5 text-warm-white/65">
                                                            {workoutDescription}
                                                        </p>
                                                    ) : null}
                                                </div>

                                                <span className="shrink-0 rounded-full border border-cta/35 bg-cta/15 px-2.5 py-1 text-base uppercase tracking-[0.18em] text-[#f7d7b8]">
                                                    {block.duration} min
                                                </span>
                                            </div>

                                            <div className="mt-3 flex flex-col gap-2">
                                                {exercises.map((exercise) => (
                                                    <div
                                                        key={
                                                            exercise.id ??
                                                            exercise.name
                                                        }
                                                        className="rounded-2xl border border-white/10 bg-black/20 p-3"
                                                    >
                                                        <h3 className="text-xl uppercase tracking-[0.06em] text-warm-white font-sl-archivo">
                                                            {exercise.name ||
                                                                "Oefening"}
                                                        </h3>

                                                        <p className="mt-1 text-lg leading-5 text-warm-white/65">
                                                            {
                                                                exercise.description
                                                            }
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        </section>
                                    );
                                },
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="relative z-10 mt-4 flex shrink-0 justify-start">
                <a
                    href={backHref}
                    className="inline-flex items-center rounded-full border border-white/10 bg-black/40 px-5 py-3 text-base uppercase tracking-[0.22em] text-warm-white transition hover:border-cta/40 hover:bg-black/60"
                >
                    Terug naar overzicht
                </a>
            </div>
        </div>
    );
}
