import configPromise from "@payload-config";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getPayload } from "payload";
import { WorkoutBlocks } from "./WorkoutBlocks";

type PageProps = {
    params: Promise<{
        lessonId: string;
    }>;
    searchParams?: Promise<{
        category?: string;
    }>;
};

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

function isProgram(
    value: unknown,
): value is { id: number; title?: string | null } {
    return typeof value === "object" && value !== null && "id" in value;
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
        disableErrors: true,
    });

    if (!lesson) {
        notFound();
    }

    const program = isProgram(lesson.program) ? lesson.program : null;
    const lessonImage = isMedia(lesson.image) ? lesson.image : null;
    const lessonStartDate = formatDate(lesson.startDate);
    const lessonDateParam = toDateParam(lesson.startDate);
    const backHref = lessonDateParam
        ? `/tv?date=${lessonDateParam}${resolvedSearchParams.category ? `&category=${resolvedSearchParams.category}` : ""}`
        : `/tv${resolvedSearchParams.category ? `?category=${resolvedSearchParams.category}` : ""}`;

    return (
        <div className="relative box-border flex h-full flex-col overflow-hidden px-8 py-8 text-warm-white">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute left-1/2 top-0 h-64 w-2xl -translate-x-1/2 rounded-full bg-cta/10 blur-3xl" />
                <div className="absolute right-0 top-1/4 h-80 w-80 rounded-full bg-white/5 blur-3xl" />
                <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-steel/10 blur-3xl" />
            </div>

            <div className="relative z-10 min-h-0 flex-1 overflow-hidden rounded-4xl border border-white/10 bg-ink/80 shadow-2xl shadow-black/25 backdrop-blur">
                <div className="grid h-full min-h-0 grid-cols-[380px_1fr]">
                    <aside className="relative min-h-0 overflow-hidden border-r border-white/10 bg-black">
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

                        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.65)_0%,rgba(0,0,0,0.25)_25%,rgba(0,0,0,0.3)_50%,rgba(0,0,0,0.9)_100%)]" />

                        <div className="absolute left-8 top-7 z-20 font-sl-archivo text-[2.5rem] uppercase tracking-[0.16em] text-warm-white">
                            Sportlab
                        </div>

                        {program?.title ? (
                            <div className="absolute left-8 top-24 z-20 max-w-[calc(100%-4rem)] rounded-full border border-cta/35 bg-cta/15 px-3 py-1 text-[0.8rem] uppercase tracking-[0.16em] text-[#f7d7b8] shadow-lg shadow-black/20 backdrop-blur">
                                {program.title}
                            </div>
                        ) : null}

                        <div className="absolute inset-0 flex items-end p-10">
                            <div className="max-w-xl">
                                <p className="mt-3 text-sm uppercase tracking-[0.25em] text-warm-white/80">
                                    {lesson.coaches
                                        ?.map((coach) =>
                                            isUser(coach) && coach.name
                                                ? coach.name
                                                : "Coach",
                                        )
                                        .join(" · ") || "Geen coach gekoppeld"}
                                </p>

                                <h1 className="mt-3 text-4xl uppercase tracking-widest text-warm-white font-sl-archivo">
                                    {lesson.title || `Les ${lesson.id}`}
                                </h1>
                            </div>
                        </div>
                    </aside>

                    <div className="min-h-0 overflow-y-auto p-6">
                        <WorkoutBlocks blocks={lesson.workoutBlocks ?? []} />
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
