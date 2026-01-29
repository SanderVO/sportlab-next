import { Label } from "@/components/ui/Label";
import type { SelectField } from "@payloadcms/plugin-form-builder/types";
import React from "react";
import type { Control, FieldErrorsImpl } from "react-hook-form";
import { Controller } from "react-hook-form";
import { Error } from "../Error";
import { Width } from "../Width";

export const Select: React.FC<
    SelectField & {
        label: string;
        control: Control;
        errors: Partial<FieldErrorsImpl>;
    }
> = ({
    name,
    control,
    errors,
    label,
    options,
    required,
    width,
    defaultValue,
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

            <Controller
                name={name}
                control={control}
                defaultValue={defaultValue ?? ""}
                rules={{ required }}
                render={({ field }) => (
                    <select
                        id={name}
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(e.target.value)}
                        className="
                            w-full rounded-md border border-gray-300
                            bg-white px-3 py-2 text-sm
                            focus:outline-none focus:ring-2 focus:ring-blue-500
                        "
                    >
                        <option value="" disabled>
                            {label}
                        </option>

                        {options.map(({ label, value }) => (
                            <option key={value} value={value}>
                                {label}
                            </option>
                        ))}
                    </select>
                )}
            />

            {errors[name] && <Error name={name} />}
        </Width>
    );
};
