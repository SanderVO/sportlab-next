import { Media } from "@/components/Media";
import type { Header } from "@/payload-types";
import { getCachedGlobal } from "@/utilities/getGlobals";
import Link from "next/link";
import { WhatsappButton } from "../WhatsApp/WhatsappButton";
import HamburgerMenu from "./HamburgerMenu";
import { HeaderNav } from "./HeaderNav";

export async function Header() {
    const headerData: Header = (await getCachedGlobal("header", 1)()) as Header;

    const navItems = headerData?.navItems || [];

    return (
        <header className="sticky top-0 z-30 w-full bg-background text-white py-6 shadow-neutral-900 transition-colors">
            <div className="container mx-auto flex flex-row justify-between items-center relative">
                <Link href="/" className="flex items-center shrink-0">
                    <Media
                        resource={headerData?.headerLogo}
                        priority
                        htmlElement={null}
                        size="(max-width: 768px) 175px, 200px"
                        pictureClassName="h-8 w-[150px] sm:h-10 sm:w-[200px] relative"
                        imgClassName="h-full"
                        imgWidth={200}
                        imgHeight={50}
                    />
                </Link>

                <HeaderNav navItems={navItems} />

                <div className="hidden md:block">
                    <WhatsappButton />
                </div>

                <div className="flex flex-row items-center gap-4 md:hidden">
                    <WhatsappButton />

                    <HamburgerMenu navItems={headerData.navItems} />
                </div>
            </div>
        </header>
    );
}
