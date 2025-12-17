"use client";

import { Header } from "@/payload-types";
import { RowLabelProps, useRowLabel } from "@payloadcms/ui";

export const RowLabel: React.FC<RowLabelProps> = () => {
    const data = useRowLabel<NonNullable<Header["navItems"]>[number]>();

    const label = data?.data?.link?.label
        ? `Navigatie item ${
              data.rowNumber !== undefined ? data.rowNumber + 1 : ""
          }: ${data?.data?.link?.label}`
        : "Rij";

    return <div>{label}</div>;
};
