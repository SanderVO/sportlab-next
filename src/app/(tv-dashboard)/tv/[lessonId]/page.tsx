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

    const lessonImage = isMedia(lesson.image) ? lesson.image : null;
    const backHref = `/tv${resolvedSearchParams.category ? `?category=${resolvedSearchParams.category}` : ""}`;

    return (
        <div className="relative min-h-screen overflow-hidden px-4 py-4 text-white sm:px-6 sm:py-6 lg:px-8 lg:py-8">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute left-1/2 top-0 h-64 w-2xl -translate-x-1/2 rounded-full bg-cta/10 blur-3xl" />
                <div className="absolute right-0 top-1/4 h-80 w-80 rounded-full bg-white/5 blur-3xl" />
                <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-steel/10 blur-3xl" />
            </div>

            <div className="relative z-10 mb-4 flex justify-start">
                <a
                    href={backHref}
                    className="inline-flex items-center rounded-full border border-white/10 bg-black/40 px-5 py-3 text-sm uppercase tracking-[0.22em] text-white transition hover:border-[#e8842b]/40 hover:bg-black/60"
                >
                    Terug naar overzicht
                </a>
            </div>

            <div className="relative z-10 min-h-[calc(100vh-7rem)] overflow-hidden rounded-4xl border border-white/10 bg-ink/80 shadow-2xl shadow-black/25 backdrop-blur">
                <div className="relative min-h-80 bg-black">
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

                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,17,13,0.06)_0%,rgba(20,17,13,0.18)_36%,rgba(20,17,13,0.88)_100%)]" />

                    <div className="absolute inset-0 flex items-end p-6 xl:p-10">
                        <div className="max-w-3xl">
                            <p className="text-xs uppercase tracking-[0.35em] text-white/70">
                                {lesson.coaches
                                    ?.map((coach) =>
                                        isUser(coach) && coach.name
                                            ? coach.name
                                            : "Coach",
                                    )
                                    .join(" · ") || "Geen coach gekoppeld"}
                            </p>

                            <h1 className="mt-4 text-5xl uppercase tracking-[0.12em] text-white sm:text-6xl xl:text-8xl font-(--font-archivo)">
                                {lesson.title || `Les ${lesson.id}`}
                            </h1>
                        </div>
                    </div>
                </div>

                <div className="p-6 xl:p-10">
                    <div className="grid gap-4 xl:grid-cols-2 2xl:grid-cols-3">
                        {(lesson.workoutBlocks ?? []).map((block, index) => {
                            const workout =
                                typeof block.workout === "object" &&
                                block.workout !== null
                                    ? block.workout
                                    : null;
                            const exercises = Array.isArray(block.exercises)
                                ? block.exercises
                                : [];

                            return (
                                <section
                                    key={block.id ?? `${lesson.id}-${index}`}
                                    className="rounded-3xl border border-white/10 bg-warm-white/6 p-5"
                                >
                                    <div className="flex items-center justify-between gap-4">
                                        <h2 className="text-3xl uppercase tracking-widest text-white font-(--font-archivo)">
                                            {workout && "name" in workout
                                                ? workout.name
                                                : "Workout"}
                                        </h2>

                                        <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-sm uppercase tracking-[0.25em] text-white/70">
                                            {block.duration} min
                                        </span>
                                    </div>

                                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                        {exercises.map((exercise) => (
                                            <div
                                                key={
                                                    exercise.id ?? exercise.name
                                                }
                                                className="rounded-2xl border border-white/10 bg-black/20 p-4"
                                            >
                                                <h3 className="text-xl uppercase tracking-[0.08em] text-white font-(--font-archivo)">
                                                    {exercise.name}
                                                </h3>
                                                <p className="mt-2 text-base leading-6 text-white/65">
                                                    {exercise.description}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
