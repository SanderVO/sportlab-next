import type { Metadata } from "next";
import { hasTvAccess } from "@/utilities/tvAccess";
import { redirect } from "next/navigation";
import React from "react";
import { TvStage } from "./TvStage";

export const metadata: Metadata = {
    robots: {
        index: false,
        follow: false,
    },
};

export default async function TvDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    if (!(await hasTvAccess())) {
        redirect("/tv-unlock");
    }

    return <TvStage>{children}</TvStage>;
}
