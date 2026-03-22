"use client";

import { useFormContext } from "react-hook-form";

export const Error = ({ name }: { name: string }) => {
    const {
        formState: { errors },
    } = useFormContext();
    return (
        <div
            role="alert"
            className="mt-2 rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-800"
        >
            {(errors[name]?.message as string) || "Dit veld is verplicht"}
        </div>
    );
};
