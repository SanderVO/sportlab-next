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
            <div className="relative h-10 w-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center overflow-hidden">
                {avatarUrl ? (
                    <Image
                        src={avatarUrl}
                        alt={user.name || "User"}
                        fill
                        className="object-cover"
                    />
                ) : (
                    <span className="text-xs font-semibold text-white">
                        {user.name?.charAt(0).toUpperCase() || "U"}
                    </span>
                )}
            </div>

            <span className="text-sm text-white/70">
                {user.name || user.email}
            </span>
        </div>
    );
}
