import Image from "next/image";
import Link from "next/link";
import { getClient } from "../lib/ApolloClient";
import { getMenuItems, GetMenuItemsResponse, MenuItem } from "../lib/Query";

export default async function Header() {
    const { data } = await getClient().query<GetMenuItemsResponse>({
        query: getMenuItems,
        variables: {
            location: "PRIMARY",
        },
    });

    return (
        <nav className="container mx-auto flex flex-row justify-between items-center bg-background text-white py-4">
            <Image
                src="https://sportlabgroningen.nl/wp-content/uploads/2020/12/sportlab-png.png"
                alt="Sportlab Groningen"
                width={200}
                height={100}
            />

            <div className="flex flex-row justify-between items-center gap-6">
                {data.menuItems.nodes
                    .filter((item: MenuItem) => item.parentId === null)
                    .map((item: MenuItem) => (
                        <Link
                            key={item.id}
                            className="flex flex-col font-bold"
                            href={item.uri}
                        >
                            {item.label}
                        </Link>
                    ))}
            </div>
        </nav>
    );
}
