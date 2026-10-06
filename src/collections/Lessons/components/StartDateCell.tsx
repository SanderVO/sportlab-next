import type { DefaultCellComponentProps } from "payload";
import React from "react";

export const StartDateCell: React.FC<DefaultCellComponentProps> = ({
    cellData,
}) => {
    if (!cellData) return null;

    const date = new Date(cellData as string);
    if (Number.isNaN(date.getTime())) return null;

    return (
        <span>
            {date.toLocaleDateString("nl-NL", {
                weekday: "long",
                day: "2-digit",
                month: "long",
                year: "numeric",
                timeZone: "Europe/Amsterdam",
            })}
        </span>
    );
};
