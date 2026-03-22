"use client";

import { useEffect, useRef, useState } from "react";
import { useHeaderState } from "./HeaderContext";

export function ScrollHeader({ children }: { children: React.ReactNode }) {
    const { hasHero, mobileMenuOpen } = useHeaderState();
    const [scrolled, setScrolled] = useState(false);
    const [top, setTop] = useState(0);
    const adminBarHeightRef = useRef(0);

    useEffect(() => {
        // Measure the actual rendered admin bar height dynamically
        // (doesn't rely on adminBar prop, which may not sync with actual visibility)
        const measureAdminBar = () => {
            const el = document.querySelector<HTMLElement>(".admin-bar");
            if (el && el.offsetHeight > 0) {
                const height = el.getBoundingClientRect().height;
                adminBarHeightRef.current = height;
                setTop(height);
            } else {
                adminBarHeightRef.current = 0;
                setTop(0);
            }
        };

        // Measure on mount and watch for changes
        measureAdminBar();

        const observer = new MutationObserver(measureAdminBar);
        observer.observe(document.body, {
            attributes: true,
            attributeFilter: ["class"],
            subtree: true,
        });

        const onScroll = () => {
            const y = window.scrollY;
            setScrolled(y > 10);
            if (adminBarHeightRef.current > 0) {
                setTop(Math.max(0, adminBarHeightRef.current - y));
            }
        };

        window.addEventListener("scroll", onScroll, { passive: true });

        return () => {
            observer.disconnect();
            window.removeEventListener("scroll", onScroll);
        };
    }, []);

    const transparent = hasHero && !scrolled && !mobileMenuOpen;

    return (
        <header
            style={{ top }}
            className={`fixed z-30 w-full text-white py-6 transition-colors duration-300 ${
                transparent ? "bg-transparent" : "bg-black shadow-md"
            }`}
        >
            {children}
        </header>
    );
}
