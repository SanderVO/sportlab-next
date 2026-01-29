import { Label } from "@/components/ui/Label";
import type { CheckboxField } from "@payloadcms/plugin-form-builder/types";
import React from "react";
import type {
    FieldErrorsImpl,
    FieldValues,
    UseFormRegister,
} from "react-hook-form";
import { Error } from "../Error";
import { Width } from "../Width";

export const Checkbox: React.FC<
    CheckboxField & {
        label: string;
        errors: Partial<FieldErrorsImpl>;
        register: UseFormRegister<FieldValues>;
    }
> = ({ name, defaultValue, errors, label, register, required, width }) => {
    return (
        <Width width={width}>
            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    id={name}
                    defaultChecked={!!defaultValue}
                    aria-invalid={!!errors[name]}
                    className="
                        h-4 w-4 rounded border-gray-300
                        text-blue-600 focus:ring-blue-500
                    "
                    {...register(name, { required })}
                />

                <Label htmlFor={name}>
                    {label}
                    {required && (
                        <span className="required">
                            * <span className="sr-only">(required)</span>
                        </span>
                    )}
                </Label>
            </div>

            {errors[name] && <Error name={name} />}
        </Width>
    );
};
