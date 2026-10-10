"use client";

import { useEffect, useState } from "react";

const TV_TIME_ZONE = "Europe/Amsterdam";

/** Live HH:MM clock for the TV header (the website itself doesn't show one). */
export function TvClock() {
    const [now, setNow] = useState("");

    useEffect(() => {
        const update = () =>
            setNow(
                new Intl.DateTimeFormat("nl-NL", {
                    hour: "2-digit",
                    minute: "2-digit",
                    timeZone: TV_TIME_ZONE,
                }).format(new Date()),
            );

        update();
        const interval = window.setInterval(update, 10_000);

        return () => window.clearInterval(interval);
    }, []);

    return (
        <span
            className="font-display text-[64px] leading-none tracking-[0.02em] uppercase"
            suppressHydrationWarning
        >
            {now}
        </span>
    );
}
