"use client";

import { RelationshipField, useAllFormFields, useField } from "@payloadcms/ui";
import type { RelationshipFieldClientProps } from "payload";
import React, { useEffect, useRef } from "react";

/**
 * Relationship field for the lesson's program. When the start date changes
 * (not on initial load), auto-selects the program that is active on that date.
 */
export const ProgramField: React.FC<RelationshipFieldClientProps> = (
    props,
) => {
    const { path } = props;
    const { setValue } = useField<number | string | null>({ path });
    const [fields] = useAllFormFields();
    const startDate = fields?.startDate?.value as string | undefined;
    const previous = useRef<string | undefined>(startDate);

    useEffect(() => {
        if (!startDate || startDate === previous.current) return;
        previous.current = startDate;

        const controller = new AbortController();
        const iso = new Date(startDate).toISOString();
        const params = new URLSearchParams({
            "where[startDate][less_than_equal]": iso,
            "where[endDate][greater_than_equal]": iso,
            limit: "1",
            depth: "0",
            sort: "-startDate",
        });

        fetch(`/api/programs?${params.toString()}`, {
            credentials: "include",
            signal: controller.signal,
        })
            .then((res) => (res.ok ? res.json() : null))
            .then((json) => {
                const program = json?.docs?.[0];
                if (program?.id != null) setValue(program.id);
            })
            .catch(() => {});

        return () => controller.abort();
    }, [startDate, setValue]);

    return <RelationshipField {...props} />;
};
