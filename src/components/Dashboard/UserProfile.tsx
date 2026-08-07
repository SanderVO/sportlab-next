"use client";

import { User } from "@/payload-types";
import Image from "next/image";

export function UserProfile({ user }: { user: User }) {
    const avatarUrl =
        typeof user.avatar === "object" && user.avatar?.url
            ? user.avatar.url
            : null;

    return (
        <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-sand/20 bg-sand/10">
                {avatarUrl ? (
                    <Image
                        src={avatarUrl}
                        alt={user.name || "User"}
                        fill
                        className="object-cover"
                    />
                ) : (
                    <span className="text-xs font-semibold text-warm-white">
                        {user.name?.charAt(0).toUpperCase() || "U"}
                    </span>
                )}
            </div>

            <span className="text-sm text-sand/70">
                {user.name || user.email}
            </span>
        </div>
    );
}
