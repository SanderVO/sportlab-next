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
                className="absolute left-1/2 top-1/2 overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(255,153,51,0.22),transparent_34%),radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_26%),linear-gradient(135deg,#06090f_0%,#0c121d_45%,#05070c_100%)] text-white"
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
