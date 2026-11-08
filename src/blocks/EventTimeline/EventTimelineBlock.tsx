import { Media } from "@/components/Media";
import type {
    Event,
    EventTimelineBlock as EventTimelineBlockProps,
} from "@/payload-types";
import { cn } from "@/utilities/ui";
import configPromise from "@payload-config";
import { getPayload } from "payload";
import React from "react";
import { UpcomingOnly } from "./UpcomingOnly";

const dateFormat = (options: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat("nl-NL", {
        timeZone: "Europe/Amsterdam",
        ...options,
    });

const dayFormat = dateFormat({ day: "2-digit" });
const monthFormat = dateFormat({ month: "long" });
const weekdayFormat = dateFormat({ weekday: "short" });
const timeFormat = dateFormat({
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
});

const eventTypeLabels: Record<Event["eventType"], string> = {
    running: "Hardlopen",
    hyrox: "Hyrox",
    special: "Special",
};

const darkGlow =
    "bg-ink bg-[radial-gradient(120%_120%_at_100%_0%,var(--panel-glow)_0%,var(--charcoal)_45%,var(--panel-deep)_100%)]";

export const EventTimelineBlock: React.FC<EventTimelineBlockProps> = async ({
    backgroundColor,
    title,
    subtitle,
}) => {
    const payload = await getPayload({ config: configPromise });
    const now = new Date().toISOString();

    const { docs: events } = await payload.find({
        collection: "events",
        depth: 1,
        pagination: false,
        sort: "startsAt",
        where: {
            or: [
                { startsAt: { greater_than_equal: now } },
                { endsAt: { greater_than_equal: now } },
            ],
        },
        select: {
            title: true,
            description: true,
            eventType: true,
            bannerImage: true,
            startsAt: true,
            endsAt: true,
        },
    });

    const isDark = backgroundColor === "backgroundDark";
    const strong = isDark ? "text-text-on-panel" : "text-text-strong";
    const body = isDark ? "text-text-on-panel-muted" : "text-text-body";
    const muted = isDark ? "text-text-on-panel-muted" : "text-text-muted";
    const rule = isDark ? "bg-sand" : "bg-ink";

    return (
        <div className={cn("w-full lg:-my-12", isDark && darkGlow)}>
            <div className="container mx-auto py-space-60 lg:py-space-80">
                <div className="mx-auto">
                    <header className="mb-space-32 lg:mb-space-60">
                        <h2
                            className={cn(
                                "type-web-display max-lg:text-[56px]",
                                strong,
                            )}
                        >
                            {title}
                        </h2>
                        {subtitle && (
                            <p className={cn("type-web-lead mt-3", body)}>
                                {subtitle}
                            </p>
                        )}
                    </header>

                    <ol className="peer">
                        {events.map((event, index) => {
                            const start = new Date(event.startsAt);

                            return (
                                <UpcomingOnly
                                    key={event.id}
                                    until={event.endsAt ?? event.startsAt}
                                >
                                    <li className="relative pb-12 pl-5 lg:grid lg:min-h-[200px] lg:grid-cols-[133px_minmax(0,1fr)_200px_200px] lg:pb-0 lg:pl-0 xl:min-h-[256px] xl:grid-cols-[133px_minmax(0,1fr)_256px_256px]">
                                        <span
                                            aria-hidden="true"
                                            className={cn(
                                                "absolute inset-y-0 left-0 w-px lg:left-[132px]",
                                                rule,
                                            )}
                                        />
                                        <span
                                            aria-hidden="true"
                                            className={cn(
                                                "absolute top-3.5 -left-1 size-[9px] rounded-pill lg:top-9 lg:left-[128px]",
                                                rule,
                                            )}
                                        />

                                        <time
                                            dateTime={event.startsAt}
                                            className="flex items-center gap-3 lg:block lg:pt-space-24"
                                        >
                                            <span
                                                className={cn(
                                                    "type-app-number lg:type-display-l",
                                                    strong,
                                                )}
                                            >
                                                {dayFormat.format(start)}
                                            </span>
                                            <span className="block lg:mt-3">
                                                <span
                                                    className={cn(
                                                        "type-web-meta block uppercase",
                                                        strong,
                                                    )}
                                                >
                                                    {monthFormat.format(start)}
                                                </span>
                                                <span
                                                    className={cn(
                                                        "type-web-small block",
                                                        muted,
                                                    )}
                                                >
                                                    {weekdayFormat.format(
                                                        start,
                                                    )}{" "}
                                                    · {timeFormat.format(start)}
                                                </span>
                                            </span>
                                        </time>

                                        <div
                                            className={cn(
                                                "relative mt-4 aspect-[16/10] overflow-hidden rounded-card lg:row-start-1 lg:mt-0 lg:aspect-auto",
                                                index % 2 === 0
                                                    ? "lg:col-start-4"
                                                    : "lg:col-start-3",
                                                !event.bannerImage && darkGlow,
                                            )}
                                        >
                                            {event.bannerImage ? (
                                                <Media
                                                    fill
                                                    imgClassName="object-cover"
                                                    resource={event.bannerImage}
                                                    size="(min-width: 1366px) 256px, (min-width: 1024px) 200px, 100vw"
                                                />
                                            ) : (
                                                <span
                                                    aria-hidden="true"
                                                    className="type-wordmark absolute inset-0 flex items-center justify-center text-line-panel"
                                                >
                                                    SPORTLAB
                                                </span>
                                            )}
                                        </div>

                                        <div className="mt-4 lg:col-start-2 lg:row-start-1 lg:mt-0 lg:px-space-28 lg:py-space-24">
                                            <h3
                                                className={cn(
                                                    "type-web-h3 lg:type-web-h2",
                                                    strong,
                                                )}
                                            >
                                                {event.title}
                                            </h3>
                                            {event.description && (
                                                <p
                                                    className={cn(
                                                        "type-web-small mt-space-8 whitespace-pre-line",
                                                        body,
                                                    )}
                                                >
                                                    {event.description}
                                                </p>
                                            )}
                                            <span
                                                className={cn(
                                                    "type-eyebrow mt-3 inline-block rounded-pill border px-3 py-[5px] uppercase",
                                                    isDark
                                                        ? "border-line-panel text-text-on-panel"
                                                        : "border-line text-text-body",
                                                )}
                                            >
                                                {
                                                    eventTypeLabels[
                                                        event.eventType
                                                    ]
                                                }
                                            </span>
                                        </div>
                                    </li>
                                </UpcomingOnly>
                            );
                        })}
                    </ol>

                    <div
                        className={cn(
                            "hidden rounded-card p-space-32 peer-empty:block",
                            isDark && "bg-charcoal",
                            backgroundColor === "backgroundLight" &&
                                "bg-warm-white",
                            backgroundColor === "backgroundWhite" && "bg-sand",
                        )}
                    >
                        <p className={cn("type-web-h3", strong)}>
                            Er staan nog geen evenementen gepland.
                        </p>
                        <p className={cn("type-web-small mt-1", body)}>
                            Kijk binnenkort nog eens.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
