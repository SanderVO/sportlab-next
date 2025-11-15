import Link from "next/link";
import { getClient } from "../lib/ApolloClient";
import { getMenuItems, GetMenuItemsResponse, MenuItem } from "../lib/Query";
import HamburgerMenu from "./HamburgerMenu";
import OptimizedImage from "./OptimizedImage";

export default async function Header() {
    const { data } = await getClient().query<GetMenuItemsResponse | undefined>({
        query: getMenuItems,
        variables: {
            location: "CUSTOM_1",
        },
    });

    return (
        <nav className="container mx-auto flex flex-row justify-between items-center bg-background text-white py-6 relative">
            <Link href="/" className="flex items-center shrink-0">
                <OptimizedImage
                    preload={true}
                    src="https://sportlabgroningen.nl/wp-content/uploads/2020/12/sportlab-png.png"
                    alt="Sportlab Groningen"
                    width={200}
                    height={50}
                />
            </Link>

            <div className="flex-row justify-between items-center gap-8 hidden md:flex">
                {data?.menuItems.nodes
                    .filter((item: MenuItem) => item.parentId === null)
                    .map((item: MenuItem) => (
                        <Link
                            key={item.id}
                            className="flex flex-col uppercase font-semibold"
                            href={item.uri}
                        >
                            {item.label}
                        </Link>
                    ))}
            </div>

            <div className="flex md:hidden text-3xl">
                <HamburgerMenu menuItems={data?.menuItems.nodes ?? []} />
            </div>
        </nav>
    );
}
