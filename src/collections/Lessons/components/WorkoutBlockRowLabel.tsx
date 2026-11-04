"use client";

import { useRowLabel, useTranslation } from "@payloadcms/ui";
import React from "react";

export const WorkoutBlockRowLabel: React.FC = () => {
    const { i18n } = useTranslation();
    const { data, rowNumber } = useRowLabel<{ name?: string }>();
    const name = data?.name?.trim();
    const number = String((rowNumber ?? 0) + 1).padStart(2, "0");

    return <span>{name || `${i18n.language === "nl" ? "Workoutblok" : "Workout block"} ${number}`}</span>;
};
