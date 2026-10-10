import configPromise from "@payload-config";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getPayload } from "payload";
import { TvClock } from "@/components/TvClock/TvClock";
import { WorkoutBlocks } from "./WorkoutBlocks";

type PageProps = {
    params: Promise<{
        lessonId: string;
    }>;
    searchParams?: Promise<{
        category?: string;
    }>;
};

const TV_TIME_ZONE = "Europe/Amsterdam";

function formatShortDate(value?: string | null) {
    if (!value) return null;

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return null;

    return new Intl.DateTimeFormat("nl-NL", {
        weekday: "short",
        day: "numeric",
        month: "short",
        timeZone: TV_TIME_ZONE,
    })
        .format(date)
        .replace(/\./g, "");
}

function formatTime(value?: string | null) {
    if (!value) return null;

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return null;

    return new Intl.DateTimeFormat("nl-NL", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: TV_TIME_ZONE,
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
    const blocks = lesson.workoutBlocks ?? [];
    const totalMinutes = blocks.reduce(
        (sum, block) => sum + (block.duration ?? 0),
        0,
    );
    const coaches = (lesson.coaches ?? [])
        .map((coach) =>
            isUser(coach) ? coach.name || coach.email || null : null,
        )
        .filter(Boolean)
        .join(", ");
    const eyebrow = [
        program?.title,
        formatShortDate(lesson.startDate),
        formatTime(lesson.startDate),
    ]
        .filter(Boolean)
        .join(" · ");
    const summary = [
        coaches || null,
        `${blocks.length} ${blocks.length === 1 ? "blok" : "blokken"}`,
        totalMinutes > 0 ? `${totalMinutes} min` : null,
    ]
        .filter(Boolean)
        .join(" · ");
    const lessonDateParam = toDateParam(lesson.startDate);
    const backHref = lessonDateParam
        ? `/tv?date=${lessonDateParam}${resolvedSearchParams.category ? `&category=${resolvedSearchParams.category}` : ""}`
        : `/tv${resolvedSearchParams.category ? `?category=${resolvedSearchParams.category}` : ""}`;

    return (
        <main className="relative box-border flex h-[1080px] flex-col overflow-hidden px-tv-safe-x py-tv-safe-y text-white">
            <div
                className="pointer-events-none absolute top-0 right-0 h-[460px] w-[1000px] opacity-80 [mask-image:radial-gradient(85%_95%_at_100%_0%,black_25%,transparent_75%)]"
                aria-hidden="true"
            >
                {lessonImage?.url ? (
                    <Image
                        src={lessonImage.url}
                        alt=""
                        fill
                        sizes="1000px"
                        className="object-cover"
                        priority
                    />
                ) : (
                    <div className="absolute inset-0 bg-[radial-gradient(70%_90%_at_70%_30%,var(--steel),var(--steel-glow)_70%)]" />
                )}
            </div>

            <header className="relative z-10 flex h-[72px] flex-none items-center justify-between">
                <span className="font-label text-[32px] leading-none font-extrabold tracking-[0.25em] uppercase">
                    Sportlab
                </span>
                <span className="flex items-center gap-10">
                    <a
                        id="tv-back"
                        href={backHref}
                        className="inline-flex h-[72px] items-center rounded-pill border-[3px] border-white px-[34px] font-sans text-[28px] leading-none font-semibold text-white no-underline outline-none focus-visible:outline-[6px] focus-visible:outline-offset-[6px] focus-visible:outline-focus-ring"
                    >
                        ← Terug naar overzicht
                    </a>
                    <TvClock />
                </span>
            </header>

            <section className="relative z-10 mt-8">
                {eyebrow ? (
                    <div className="type-tv-label text-sand uppercase">
                        {eyebrow}
                    </div>
                ) : null}
                <h1 className="type-tv-title mt-4 text-[96px]">
                    {lesson.title || `Les ${lesson.id}`}
                </h1>
                <div className="type-tv-body mt-3 text-text-on-panel-muted">
                    {summary}
                </div>
            </section>

            <WorkoutBlocks
                blocks={blocks}
                lessonTitle={lesson.title || `Les ${lesson.id}`}
            />
        </main>
    );
}
