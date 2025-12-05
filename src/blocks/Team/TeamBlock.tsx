import { RolesEnum } from "@/collections/Users";
import { CMSLink } from "@/components/Link";
import type { TeamBlock as TeamBlockProps } from "@/payload-types";
import { cn } from "@/utilities/ui";
import configPromise from "@payload-config";
import { ArrowRightIcon } from "lucide-react";
import { getPayload } from "payload";
import React from "react";
import { TeamBlockCarousel } from "./TeamBlockCarousel";

export const TeamBlock: React.FC<TeamBlockProps> = async (props) => {
    const { title, link, type, limit } = props;

    const payload = await getPayload({ config: configPromise });

    const { docs: users } = await payload.find({
        collection: "users",
        page: 0,
        limit: type === "carousel" ? limit ?? 0 : 0,
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
        <div className="container mx-auto flex flex-col h-full justify-center py-15 md:py-0">
            <h2 className="font-sl-bebas text-5xl md:text-7xl">{title}</h2>

            <div
                className={cn(
                    "flex flex-row justify-between my-10",
                    type === "grid" && "h-full gap-0",
                    type === "carousel" && "h-[400px] gap-20"
                )}
            >
                <TeamBlockCarousel
                    backgroundColor={props.backgroundColor}
                    type={props.type}
                    users={users}
                />

                <div className="items-center flex-0 hidden md:flex">
                    <CMSLink
                        {...link}
                        className="bg-sl-beige rounded-full p-4 w-20 h-20 text-background flex items-center justify-center text-4xl transition-transform hover:scale-110 shrink-0 cursor-pointer"
                    >
                        <ArrowRightIcon />
                    </CMSLink>
                </div>
            </div>

            <div className="block md:hidden">
                {link && <CMSLink {...link} />}
            </div>
        </div>
    );
};
