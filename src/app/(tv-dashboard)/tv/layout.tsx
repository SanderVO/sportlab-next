import { getMeUser } from "@/utilities/getMeUser";
import React from "react";

export default async function TvDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    await getMeUser({
        nullUserRedirect: "/login",
    });

    return (
        <div className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(255,153,51,0.22),transparent_34%),radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_26%),linear-gradient(135deg,#06090f_0%,#0c121d_45%,#05070c_100%)] text-white">
            {children}
        </div>
    );
}
