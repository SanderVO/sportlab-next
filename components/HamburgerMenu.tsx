"use client";

import clsx from "clsx";
import Link from "next/link";
import { useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { MenuItem } from "../lib/Query";

interface Props {
    menuItems: MenuItem[];
}

export default function HamburgerMenu({ menuItems }: Props) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <GiHamburgerMenu
                className="text-3xl"
                onClick={() => setIsOpen(!isOpen)}
            />

            <div
                className={clsx(
                    "absolute top-[75px] right-0 w-full h-screen bg-background z-50 p-4 transition-[opacity]",
                    isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
            >
                <div className="flex flex-col items-center h-full gap-10">
                    {menuItems
                        .filter((item: MenuItem) => item.parentId === null)
                        .map((item: MenuItem) => (
                            <Link
                                key={item.id}
                                className="flex flex-col font-bold text-lg"
                                href={item.uri}
                            >
                                {item.label}
                            </Link>
                        ))}
                </div>
            </div>
        </>
    );
}
