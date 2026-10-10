import type { Metadata } from "next";
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
    return <TvStage>{children}</TvStage>;
}
