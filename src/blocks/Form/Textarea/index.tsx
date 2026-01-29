import { Label } from "@/components/ui/Label";
import type { TextField } from "@payloadcms/plugin-form-builder/types";
import React from "react";
import type {
    FieldErrorsImpl,
    FieldValues,
    UseFormRegister,
} from "react-hook-form";
import { Error } from "../Error";
import { Width } from "../Width";

export const Textarea: React.FC<
    TextField & {
        label: string;
        errors: Partial<FieldErrorsImpl>;
        register: UseFormRegister<FieldValues>;
        rows?: number;
    }
> = ({
    name,
    defaultValue,
    errors,
    label,
    register,
    required,
    rows = 3,
    width,
}) => {
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

            <textarea
                id={name}
                defaultValue={defaultValue ?? ""}
                rows={rows}
                aria-invalid={!!errors[name]}
                className="
                    w-full rounded-md border border-gray-300
                    bg-white px-3 py-2 text-sm
                    focus:outline-none focus:ring-2 focus:ring-blue-500
                    resize-y
                "
                {...register(name, { required })}
            />

            {errors[name] && <Error name={name} />}
        </Width>
    );
};
