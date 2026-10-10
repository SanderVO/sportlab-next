"use client";

import { useEffect, useState } from "react";

const STAGE_WIDTH = 1920;
const STAGE_HEIGHT = 1080;

/**
 * Renders children on a fixed 1920x1080 canvas and scales it to fit the
 * window. The layout never changes with viewport size, so a laptop shows the
 * same thing as a TV (a 4K TV simply scales the canvas 2x and stays sharp).
 */
export function TvStage({ children }: { children: React.ReactNode }) {
    const [scale, setScale] = useState(1);

    useEffect(() => {
        const update = () => {
            setScale(
                Math.min(
                    window.innerWidth / STAGE_WIDTH,
                    window.innerHeight / STAGE_HEIGHT,
                ),
            );
        };

        update();
        window.addEventListener("resize", update);

        return () => window.removeEventListener("resize", update);
    }, []);

    return (
        <div className="fixed inset-0 overflow-hidden bg-black">
            <div
                className="absolute left-1/2 top-1/2 overflow-hidden bg-ink bg-[radial-gradient(55%_65%_at_0%_0%,var(--tv-glow-ember)_0%,transparent_100%),radial-gradient(50%_60%_at_100%_0%,var(--panel-glow)_0%,transparent_100%),radial-gradient(60%_70%_at_100%_100%,var(--tv-glow-ember-deep)_0%,transparent_100%),linear-gradient(180deg,var(--charcoal)_0%,var(--ink)_55%,var(--panel-deep)_100%)] font-sans text-white"
                style={{
                    width: STAGE_WIDTH,
                    height: STAGE_HEIGHT,
                    transform: `translate(-50%, -50%) scale(${scale})`,
                }}
            >
                {/* Inner scroller keeps `fixed` overlays pinned to the stage */}
                <div className="h-full overflow-y-auto overflow-x-hidden scrollbar-none [&::-webkit-scrollbar]:hidden">
                    {children}
                </div>
            </div>
        </div>
    );
}
