"use client";

import { User } from "@/payload-types";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function SideNav({ user }: { user: User }) {
    const router = useRouter();

    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = async () => {
        await fetch("/api/users/logout", { method: "POST" });
        router.push("/login");
    };

    return (
        <>
            {/* Hamburger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex flex-col gap-1 p-1 hover:bg-white/10 rounded-md transition"
                aria-label="Toggle menu"
            >
                <span
                    className={`block w-4 h-0.5 bg-white transition-all duration-300 ${
                        isOpen ? "rotate-45 translate-y-1.5" : ""
                    }`}
                ></span>
                <span
                    className={`block w-4 h-0.5 bg-white transition-all duration-300 ${
                        isOpen ? "opacity-0" : ""
                    }`}
                ></span>
                <span
                    className={`block w-4 h-0.5 bg-white transition-all duration-300 ${
                        isOpen ? "-rotate-45 -translate-y-1.5" : ""
                    }`}
                ></span>
            </button>

            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Slide-in Menu */}
            <div
                className={`fixed left-0 top-0 h-screen w-64 bg-[#0a0a0a] border-r border-white/10 z-40 transform transition-transform duration-300 ${
                    isOpen ? "translate-x-0" : "-translate-x-full"
                } flex flex-col`}
            >
                {/* Close Button */}
                <div className="flex items-center justify-between border-b border-white/10 p-4">
                    <h2 className="text-lg font-semibold text-white">Menu</h2>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="text-white/60 hover:text-white"
                    >
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                {/* Menu Content */}
                <div className="flex-1 overflow-y-auto p-4">
                    {/* User Profile */}
                    <div className="mb-6">
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                            <div className="relative h-12 w-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center overflow-hidden flex-shrink-0">
                                {typeof user.avatar === "object" &&
                                user.avatar?.url ? (
                                    <img
                                        src={user.avatar.url}
                                        alt={user.name || "User"}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <span className="text-sm font-semibold text-white">
                                        {user.name?.charAt(0).toUpperCase() ||
                                            "U"}
                                    </span>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">
                                    {user.name || user.email}
                                </p>
                                <p className="text-xs text-white/50 truncate">
                                    {user.email}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Menu Items */}
                    <nav className="space-y-2">
                        <a
                            href="/dashboard"
                            className="block px-3 py-2 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition"
                            onClick={() => setIsOpen(false)}
                        >
                            Dashboard
                        </a>
                    </nav>
                </div>

                {/* Logout Button */}
                <div className="border-t border-white/10 p-4">
                    <button
                        onClick={handleLogout}
                        className="w-full px-3 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition text-sm font-medium"
                    >
                        Uitloggen
                    </button>
                </div>
            </div>
        </>
    );
}
