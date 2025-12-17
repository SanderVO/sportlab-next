"use client";

import { CMSLink } from "@/components/Link";
import { Header } from "@/payload-types";
import clsx from "clsx";
import { MenuIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface Props {
    navItems: Header["navItems"];
}

export default function HamburgerMenu({ navItems }: Props) {
    const pathname = usePathname();

    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    return (
        <>
            <MenuIcon className="text-3xl" onClick={() => setIsOpen(!isOpen)} />

            <div
                className={clsx(
                    "absolute top-[95px] right-0 w-full h-screen bg-background z-50 p-4 transition-opacity",
                    isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
            >
                <nav className="flex flex-col items-center h-full gap-10">
                    {navItems?.map(({ link }, index: number) => (
                        <CMSLink key={index} {...link} />
                    ))}
                </nav>
            </div>
        </>
    );
}
