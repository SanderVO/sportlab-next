import React from "react";
import { TvStage } from "./TvStage";

export default async function TvDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <TvStage>{children}</TvStage>;
}
