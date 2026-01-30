import { RolesEnum } from "@/collections/Users";
import { CMSLink } from "@/components/ui/Link";
import type { TeamBlock as TeamBlockProps } from "@/payload-types";
import { cn } from "@/utilities/ui";
import configPromise from "@payload-config";
import { getPayload } from "payload";
import React from "react";
import { TeamBlockCarousel } from "./TeamBlockCarousel";

export const TeamBlock: React.FC<TeamBlockProps> = async (props) => {
    const { title, link, type, limit, backgroundColor } = props;

    const payload = await getPayload({ config: configPromise });

    const { docs: users } = await payload.find({
        collection: "users",
        page: 0,
        limit: type === "carousel" ? (limit ?? 0) : 0,
        sort: "name",
        where: {
            status: {
                equals: "active",
            },
            roles: {
                contains: RolesEnum.COACH,
            },
        },
    });

    return (
        <div className="container mx-auto">
            <div
                className={cn(
                    "flex flex-col h-full justify-center py-15 md:py-0",
                    backgroundColor === "backgroundDark" &&
                        "bg-background text-white",
                    backgroundColor === "backgroundLight" &&
                        "bg-sl-beige text-background",
                    backgroundColor === "backgroundWhite" &&
                        "bg-white text-white",
                )}
            >
                <h2 className="font-sl-bebas text-5xl md:text-7xl">{title}</h2>

                <div
                    className={cn(
                        "flex flex-row justify-between mt-4",
                        type === "grid" && "h-full gap-0",
                        type === "carousel" && "h-auto gap-20 items-center",
                    )}
                >
                    <TeamBlockCarousel
                        backgroundColor={props.backgroundColor}
                        type={props.type}
                        users={users}
                    />
                </div>

                {link && (
                    <div className="block">
                        <CMSLink {...link} />
                    </div>
                )}
            </div>
        </div>
    );
};
