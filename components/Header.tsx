import Image from "next/image";
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
        <nav>
            <div className="w-full h-[200px] text-center">
                <Image
                    src="https://sportlabgroningen.nl/wp-content/uploads/2020/12/sportlab-png.png"
                    alt="Sportlab Groningen"
                    width={100}
                    height={100}
                    objectFit="fill"
                />
            </div>

            <div className="flex flex-row justify-between items-center bg-slate-300 text-black p-4 rounded-2xl">
                {data.menuItems.nodes
                    .filter((item: MenuItem) => item.parentId === null)
                    .map((item: MenuItem) => (
                        <div key={item.id} className="flex flex-col">
                            {item.label}
                        </div>
                    ))}
            </div>
        </nav>
    );
}
