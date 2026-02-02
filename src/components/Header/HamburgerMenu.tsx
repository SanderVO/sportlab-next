"use client";

import { Header } from "@/payload-types";
import clsx from "clsx";
import { MenuIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { CMSLink } from "../ui/Link";

interface Props {
    navItems: Header["navItems"];
}

const HamburgerMenuContent = ({ navItems }: Props) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <MenuIcon className="text-3xl" onClick={() => setIsOpen(!isOpen)} />
            <div
                className={clsx(
                    "absolute top-16 right-0 w-full h-screen bg-background z-50 p-4 transition-opacity",
                    isOpen ? "opacity-100" : "opacity-0 pointer-events-none",
                )}
            >
                <nav className="flex flex-col items-center h-full gap-8">
                    {navItems?.map(({ link }, index: number) => (
                        <CMSLink
                            {...link}
                            key={index}
                            size="md"
                            variant="nav"
                            className="self-center"
                        />
                    ))}
                </nav>
            </div>
        </>
    );
};

export default function HamburgerMenu({ navItems }: Props) {
    const pathname = usePathname();

    return (
        <HamburgerMenuContent
            key={"hamburger-" + pathname}
            navItems={navItems}
        />
    );
}
