"use client";

import { type ReactNode, useSyncExternalStore } from "react";

const subscribe = () => () => undefined;

/**
 * Pages are cached for up to a day, so an event can pass after the page was rendered.
 * Hides it in the browser; the server render always shows it, which keeps hydration stable.
 */
export const UpcomingOnly = ({
    until,
    children,
}: {
    until: string;
    children: ReactNode;
}) => {
    const hasPassed = useSyncExternalStore(
        subscribe,
        () => new Date(until).getTime() < Date.now(),
        () => false,
    );

    return hasPassed ? null : children;
};
