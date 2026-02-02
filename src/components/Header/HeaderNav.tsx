import type { Header } from "@/payload-types";
import { CMSLink } from "../ui/Link";
import { DropdownMenu } from "./DropdownMenu";

export function HeaderNav({ navItems }: { navItems: Header["navItems"] }) {
    const visibleItems = navItems?.filter(
        ({ initiallyVisible }) => initiallyVisible !== false,
    );
    const hiddenItems = navItems?.filter(
        ({ initiallyVisible }) => initiallyVisible === false,
    );

    return (
        <nav className="flex-row justify-between items-center gap-8 hidden md:flex">
            {visibleItems?.map(({ link }, index: number) => (
                <CMSLink
                    key={index}
                    {...link}
                    variant="nav"
                    className="flex flex-col uppercase font-semibold shrink-0"
                />
            ))}

            <DropdownMenu hiddenItems={hiddenItems || []} />
        </nav>
    );
}
