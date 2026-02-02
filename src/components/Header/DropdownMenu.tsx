"use client";

import type { Header } from "@/payload-types";
import { useState } from "react";
import { Button } from "../ui/Button";
import { CMSLink } from "../ui/Link";

type DropdownMenuProps = {
    hiddenItems: NonNullable<Header["navItems"]>;
};

export function DropdownMenu({ hiddenItems }: DropdownMenuProps) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    if (!hiddenItems || hiddenItems.length === 0) {
        return null;
    }

    return (
        <div className="relative">
            <Button
                variant="nav"
                size="md"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                type="button"
            >
                Meer
            </Button>

            {isDropdownOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsDropdownOpen(false)}
                    />
                    <div className="absolute top-full right-0 mt-8 bg-background border-2 border-neutral-800 rounded-md py-2 min-w-[200px] z-50 before:content-[''] before:absolute before:bottom-full before:right-6 before:border-8 before:border-transparent before:border-b-neutral-800 after:content-[''] after:absolute after:bottom-full after:right-6 after:border-[7px] after:border-transparent after:border-b-background after:translate-y-px">
                        {hiddenItems.map(({ link }, index: number) => (
                            <div
                                key={index}
                                onClick={() => setIsDropdownOpen(false)}
                            >
                                <CMSLink
                                    {...link}
                                    variant="nav"
                                    className="flex flex-col uppercase font-semibold shrink-0 items-center"
                                />
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
