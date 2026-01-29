import { Media } from "@/components/Media";
import type { Header } from "@/payload-types";
import { getCachedGlobal } from "@/utilities/getGlobals";
import Link from "next/link";
import { CMSLink } from "../ui/Link";
import HamburgerMenu from "./HamburgerMenu";

export async function Header() {
    const headerData: Header = (await getCachedGlobal("header", 1)()) as Header;

    const navItems = headerData?.navItems || [];

    return (
        <header className="container mx-auto flex flex-row justify-between items-center bg-background text-white py-6 relative">
            <Link href="/" className="flex items-center shrink-0">
                <Media
                    resource={headerData?.headerLogo}
                    priority
                    htmlElement={null}
                    size="(max-width: 768px) 175px, 200px"
                    pictureClassName="h-10 w-[175px] sm:h-[50px] sm:w-[200px] relative"
                    imgClassName="h-full"
                    imgWidth={200}
                    imgHeight={50}
                />
            </Link>

            <nav className="flex-row justify-between items-center gap-4 hidden md:flex">
                {navItems.map(({ link }, index: number) => (
                    <CMSLink
                        key={index}
                        {...link}
                        variant="nav"
                        className="flex flex-col uppercase font-semibold"
                    />
                ))}
            </nav>

            <div className="flex md:hidden text-3xl">
                <HamburgerMenu navItems={headerData.navItems} />
            </div>
        </header>
    );
}
