import type { TeamBlock as TeamBlockProps } from "@/payload-types";
import { cn } from "@/utilities/ui";
import configPromise from "@payload-config";
import { getPayload, type Where } from "payload";
import React from "react";
import { TeamBlockCarousel } from "./TeamBlockCarousel";

export const TeamBlock: React.FC<TeamBlockProps> = async (props) => {
    const { title, type, limit, backgroundColor, sortBy, selectedCoaches } =
        props;

    const selectedCoachIds =
        selectedCoaches
            ?.map((coach) => (typeof coach === "number" ? coach : coach?.id))
            .filter((id): id is number => typeof id === "number") ?? [];

    const hasSelectedCoaches = selectedCoachIds.length > 0;

    const payload = await getPayload({ config: configPromise });

    const where: Where = hasSelectedCoaches
        ? { id: { in: selectedCoachIds } }
        : {
              and: [
                  { status: { equals: "active" } },
                  { isCoach: { equals: true } },
              ],
          };

    const { docs: users } = await payload.find({
        collection: "users",
        page: 0,
        limit: hasSelectedCoaches ? 0 : type === "carousel" ? (limit ?? 0) : 0,
        sort: sortBy,
        where,
    });

    const orderedUsers = hasSelectedCoaches
        ? selectedCoachIds
              .map((id) => users.find((user) => user.id === id))
              .filter((user): user is (typeof users)[number] => Boolean(user))
        : users;

    return (
        <div className="container mx-auto">
            <div
                className={cn(
                    "flex flex-col h-full justify-center py-15 md:py-0",
                    backgroundColor === "backgroundDark" &&
                        "bg-charcoal text-warm-white",
                    backgroundColor === "backgroundLight" && "bg-sand text-ink",
                    backgroundColor === "backgroundWhite" &&
                        "bg-warm-white text-ink",
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
                        users={orderedUsers}
                    />
                </div>
            </div>
        </div>
    );
};
