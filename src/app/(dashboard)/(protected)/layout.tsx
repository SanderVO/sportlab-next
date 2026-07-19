import { SideNav } from "@/components/Dashboard/SideNav";
import Logo from "@/components/Logo/Logo";
import { getMeUser } from "@/utilities/getMeUser";
import React from "react";

export default async function ProtectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user } = await getMeUser({
        nullUserRedirect: "/login",
    });

    return (
        <div className="min-h-screen">
            <header className="border-b border-white/10 bg-[#111111]">
                <div className="relative w-full px-4 py-3 sm:px-6 lg:px-8 flex items-center justify-center min-h-16">
                    <div className="absolute left-4 sm:left-6 lg:left-8">
                        <SideNav user={user} />
                    </div>

                    <div className="flex items-center justify-center -translaet-y-1">
                        <div className="max-h-8 w-auto scale-50 origin-center">
                            <Logo />
                        </div>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {children}
            </main>
        </div>
    );
}
