import { Label } from "@/components/ui/Label";
import type { EmailField } from "@payloadcms/plugin-form-builder/types";
import React from "react";
import type {
    FieldErrorsImpl,
    FieldValues,
    UseFormRegister,
} from "react-hook-form";
import { Error } from "../Error";
import { Width } from "../Width";

export const Email: React.FC<
    EmailField & {
        label: string;
        errors: Partial<FieldErrorsImpl>;
        register: UseFormRegister<FieldValues>;
    }
> = ({ name, defaultValue, errors, label, register, required, width }) => {
    return (
        <Width width={width}>
            <Label htmlFor={name}>
                {label}
                {required && (
                    <span className="required">
                        * <span className="sr-only">(required)</span>
                    </span>
                )}
            </Label>

            <input
                type="email"
                autoComplete="email"
                id={name}
                defaultValue={defaultValue ?? ""}
                aria-invalid={!!errors[name]}
                className="
                    w-full rounded-md border border-gray-300
                    bg-white px-3 py-2 text-sm
                    focus:outline-none focus:ring-2 focus:ring-blue-500
                "
                {...register(name, {
                    required,
                    setValueAs: (v) => v || undefined,
                    pattern: {
                        value: /^\S+@\S+\.\S+$/,
                        message: "Voer een geldig e-mailadres in",
                    },
                })}
            />

            {errors[name] && <Error name={name} />}
        </Width>
    );
};
