"use client";

import type { Header } from "@/payload-types";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "../ui/Button";
import { CMSLink } from "../ui/Link";

type DropdownMenuProps = {
    hiddenItems: NonNullable<Header["navItems"]>;
};

export function DropdownMenu({ hiddenItems }: DropdownMenuProps) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [dropdownTop, setDropdownTop] = useState<number | null>(null);
    const triggerRef = useRef<HTMLDivElement>(null);
    const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const updateDropdownTop = useCallback(() => {
        if (!triggerRef.current) {
            return;
        }

        const headerEl = triggerRef.current.closest("header");

        if (headerEl) {
            const headerRect = headerEl.getBoundingClientRect();
            setDropdownTop(headerRect.bottom);
            return;
        }

        const triggerRect = triggerRef.current.getBoundingClientRect();
        setDropdownTop(triggerRect.bottom);
    }, []);

    const openDropdown = useCallback(() => {
        if (closeTimeoutRef.current) {
            clearTimeout(closeTimeoutRef.current);
            closeTimeoutRef.current = null;
        }

        updateDropdownTop();
        setIsDropdownOpen(true);
    }, [updateDropdownTop]);

    const closeDropdown = useCallback(() => {
        if (closeTimeoutRef.current) {
            clearTimeout(closeTimeoutRef.current);
            closeTimeoutRef.current = null;
        }

        setIsDropdownOpen(false);
    }, []);

    const scheduleCloseDropdown = useCallback(() => {
        if (closeTimeoutRef.current) {
            clearTimeout(closeTimeoutRef.current);
        }

        closeTimeoutRef.current = setTimeout(() => {
            setIsDropdownOpen(false);
            closeTimeoutRef.current = null;
        }, 180);
    }, []);

    useEffect(() => {
        if (!isDropdownOpen) {
            return;
        }

        updateDropdownTop();

        window.addEventListener("resize", updateDropdownTop);
        window.addEventListener("scroll", updateDropdownTop, {
            passive: true,
        });

        return () => {
            window.removeEventListener("resize", updateDropdownTop);
            window.removeEventListener("scroll", updateDropdownTop);
        };
    }, [isDropdownOpen, updateDropdownTop]);

    useEffect(() => {
        return () => {
            if (closeTimeoutRef.current) {
                clearTimeout(closeTimeoutRef.current);
            }
        };
    }, []);

    if (!hiddenItems || hiddenItems.length === 0) {
        return null;
    }

    return (
        <div
            ref={triggerRef}
            className="relative"
            onMouseEnter={openDropdown}
            onMouseLeave={scheduleCloseDropdown}
            onFocusCapture={openDropdown}
            onBlurCapture={(event) => {
                if (
                    !event.currentTarget.contains(
                        event.relatedTarget as Node | null,
                    )
                ) {
                    scheduleCloseDropdown();
                }
            }}
        >
            <Button
                variant="nav"
                size="md"
                onClick={() => {
                    if (isDropdownOpen) {
                        closeDropdown();
                        return;
                    }

                    openDropdown();
                }}
                type="button"
                aria-expanded={isDropdownOpen}
                aria-haspopup="true"
            >
                Meer
            </Button>

            {isDropdownOpen && dropdownTop !== null && (
                <div
                    className="fixed inset-x-0 z-50 bg-charcoal/95 py-4 backdrop-blur-sm"
                    style={{ top: dropdownTop }}
                    onMouseEnter={openDropdown}
                    onMouseLeave={scheduleCloseDropdown}
                >
                    <div className="container mx-auto flex flex-wrap items-center justify-center gap-x-10 gap-y-3">
                        {hiddenItems.map(({ link }, index: number) => (
                            <div key={index} onClick={closeDropdown}>
                                <CMSLink
                                    {...link}
                                    variant="nav"
                                    className="flex w-full shrink-0 items-center justify-center uppercase font-semibold"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
