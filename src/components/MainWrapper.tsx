"use client";

import { useHeaderState } from "@/components/Header/HeaderContext";
import { useEffect, useRef, useState } from "react";

export function MainWrapper({ children }: { children: React.ReactNode }) {
    const { hasHero } = useHeaderState();
    const [headerHeight, setHeaderHeight] = useState(0);
    const measured = useRef(false);

    useEffect(() => {
        if (measured.current) return;
        const header = document.querySelector<HTMLElement>("header");
        if (header) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setHeaderHeight(header.getBoundingClientRect().height);
            measured.current = true;
        }
    }, []);

    return (
        <main
            style={
                !hasHero && headerHeight
                    ? { paddingTop: headerHeight }
                    : undefined
            }
        >
            {children}
        </main>
    );
}
