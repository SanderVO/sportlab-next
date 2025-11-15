"use client";

import { useMutation } from "@apollo/client/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Turnstile } from "next-turnstile";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import {
    GetContactFormField,
    GetContactFormResponse,
    submitContactForm,
    SubmitContactFormResponse,
} from "../../lib/Query";

export function ContactForm({ data }: { data: GetContactFormResponse }) {
    const [isVerified, setIsVerified] = useState(false);

    const [submitForm, { data: mutationData, loading, error: mutationError }] =
        useMutation<SubmitContactFormResponse>(submitContactForm);

    const contactFormSchema = z.object({
        lessonType: z.string(),
        name: z.string().min(1, "Naam is verplicht"),
        email: z.string().email("Ongeldig e-mailadres"),
        phone: z.string().optional(),
        message: z.string().optional(),
    });

    type ContactFormData = z.infer<typeof contactFormSchema>;

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ContactFormData>({
        resolver: zodResolver(contactFormSchema),
    });

    const onSubmit = async (data: ContactFormData) => {
        submitForm({
            variables: {
                input: {
                    id: 10,
                    fieldValues: [
                        { id: "4", value: data.name },
                        { id: "6", value: data.email },
                        { id: "7", value: data.phone || "" },
                        { id: "8", value: data.message || "" },
                        { id: "5", value: data.lessonType },
                    ],
                },
            },
        });
    };

    const onTurnstileVerify = (token: string) => {
        if (token) {
            setIsVerified(true);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {data.gfForm.formFields.nodes.map(
                    (field: GetContactFormField) => {
                        const fieldName = (() => {
                            switch (field.type) {
                                case "NAME":
                                    return "name";
                                case "EMAIL":
                                    return "email";
                                case "PHONE":
                                    return "phone";
                                case "POST_CONTENT":
                                    return "message";
                                case "SELECT":
                                    return "lessonType";
                                default:
                                    return "name";
                            }
                        })() as keyof ContactFormData;

                        return (
                            <div
                                key={field.id}
                                className="mb-4 flex flex-col gap-2"
                            >
                                {field.type !== "CAPTCHA" && (
                                    <label htmlFor={field.label}>
                                        {field.label}
                                    </label>
                                )}

                                {field.type === "SELECT" && (
                                    <select
                                        id={field.label}
                                        {...register(fieldName)}
                                        className="w-full p-2 border border-gray-300 rounded"
                                    >
                                        {field.choices?.map((choice) => (
                                            <option
                                                key={choice.value}
                                                value={choice.value}
                                            >
                                                {choice.text}
                                            </option>
                                        ))}
                                    </select>
                                )}

                                {(field.type === "NAME" ||
                                    field.type === "EMAIL" ||
                                    field.type === "PHONE") && (
                                    <input
                                        {...register(fieldName)}
                                        id={field.label}
                                        type={field.inputType || "text"}
                                        className="w-full p-2 border border-gray-300 rounded"
                                    />
                                )}

                                {field.type === "POST_CONTENT" && (
                                    <textarea
                                        {...register(fieldName)}
                                        id={field.label}
                                        className="w-full p-2 border border-gray-300 rounded h-[100px]"
                                    />
                                )}

                                {field.type === "CAPTCHA" && (
                                    <Turnstile
                                        siteKey={
                                            process.env.NEXT_PUBLIC_TS_SITE_KEY!
                                        }
                                        onVerify={onTurnstileVerify}
                                        theme="light"
                                    />
                                )}

                                {errors[fieldName] && (
                                    <p className="bg-red-200 p-2 rounded text-white">
                                        {errors[fieldName]?.message}
                                    </p>
                                )}

                                {mutationError && (
                                    <p className="bg-red-200 p-2 rounded text-white">
                                        Er is een fout opgetreden bij het
                                        verzenden van het formulier.
                                    </p>
                                )}

                                {mutationData?.submitGfForm.confirmation && (
                                    <p className="bg-green-200 p-2 rounded text-white">
                                        {
                                            mutationData.submitGfForm
                                                .confirmation.message
                                        }
                                    </p>
                                )}

                                {mutationData?.submitGfForm.errors && (
                                    <p className="bg-red-200 p-2 rounded text-white">
                                        {
                                            mutationData.submitGfForm.errors
                                                .message
                                        }
                                    </p>
                                )}
                            </div>
                        );
                    }
                )}

                <button
                    type="submit"
                    disabled={isSubmitting || loading || !isVerified}
                    className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-5 w-full sm:w-auto"
                >
                    Versturen
                </button>
            </form>
        </>
    );
}
