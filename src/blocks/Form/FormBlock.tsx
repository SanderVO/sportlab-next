"use client";

import RichText from "@/components/RichText";
import { Button } from "@/components/ui/Button";
import { getClientSideURL } from "@/utilities/getURL";
import type { Form as FormType } from "@payloadcms/plugin-form-builder/types";
import type { DefaultTypedEditorState } from "@payloadcms/richtext-lexical";
import { Turnstile } from "next-turnstile";
import { useRouter } from "next/navigation";
import React, { useCallback, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { fields } from "./fields";

const toSubmissionValue = (value: unknown): string => {
    if (value === undefined || value === null) return "";

    if (typeof value === "string") return value;

    if (typeof value === "number") {
        if (Number.isNaN(value)) return "";
        return String(value);
    }

    if (typeof value === "boolean") {
        return String(value);
    }

    if (Array.isArray(value)) {
        return value.map((item) => String(item)).join(", ");
    }

    if (value instanceof Date) {
        return value.toISOString();
    }

    return JSON.stringify(value);
};

export type FormBlockType = {
    blockName?: string;
    blockType?: "formBlock";
    enableIntro: boolean;
    form: FormType;
    introContent?: DefaultTypedEditorState;
};

export const FormBlock: React.FC<
    {
        id?: string;
    } & FormBlockType
> = (props) => {
    const {
        enableIntro,
        form: formFromProps,
        form: {
            id: formID,
            confirmationMessage,
            confirmationType,
            redirect,
            submitButtonLabel,
        } = {},
        introContent,
    } = props;

    const formMethods = useForm<Record<string, unknown>>({
        defaultValues: {},
    });
    const {
        control,
        formState: { errors },
        handleSubmit,
        register,
    } = formMethods;

    const [token, setToken] = useState<string>();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [hasSubmitted, setHasSubmitted] = useState<boolean>();
    const [error, setError] = useState<
        { message: string; status?: string } | undefined
    >();

    const router = useRouter();

    const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

    const onSubmit = useCallback(
        (data: Record<string, unknown>) => {
            let loadingTimerID: ReturnType<typeof setTimeout>;

            const submitForm = async () => {
                if (!token) return;

                setError(undefined);
                setIsSubmitting(true);

                const dataToSend = Object.entries(data).map(
                    ([name, value]) => ({
                        field: name,
                        value: toSubmissionValue(value),
                    }),
                );

                loadingTimerID = setTimeout(() => {
                    setIsLoading(true);
                }, 1000);

                try {
                    const req = await fetch(
                        `${getClientSideURL()}/api/form-submissions`,
                        {
                            body: JSON.stringify({
                                form: formID,
                                submissionData: dataToSend,
                            }),
                            headers: {
                                "Content-Type": "application/json",
                            },
                            method: "POST",
                        },
                    );

                    const res: {
                        errors: { message: string }[];
                        status: string;
                    } = await req.json();

                    clearTimeout(loadingTimerID);

                    if (req.status >= 400) {
                        setIsLoading(false);
                        setIsSubmitting(false);

                        setError({
                            message:
                                res.errors?.[0]?.message ||
                                "Internal Server Error",
                            status: res.status,
                        });

                        return;
                    }

                    setIsLoading(false);
                    setIsSubmitting(false);
                    setHasSubmitted(true);

                    if (confirmationType === "redirect" && redirect) {
                        const { url } = redirect;

                        const redirectUrl = url;

                        if (redirectUrl) router.push(redirectUrl);
                    }
                } catch (err) {
                    console.warn(err);

                    setIsLoading(false);
                    setIsSubmitting(false);

                    setError({
                        message: "Er ging wat fout bij het verzenden.",
                    });
                }
            };

            void submitForm();
        },
        [router, formID, redirect, confirmationType, token],
    );

    return (
        <div className="w-full">
            {enableIntro && introContent && !hasSubmitted && (
                <RichText
                    className="mb-8 lg:mb-12"
                    data={introContent}
                    enableGutter={false}
                />
            )}

            <FormProvider {...formMethods}>
                {!isLoading &&
                    hasSubmitted &&
                    confirmationType === "message" && (
                        <RichText
                            data={confirmationMessage}
                            enableProse={false}
                        />
                    )}

                {error && (
                    <div
                        role="alert"
                        className="mb-6 rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800"
                    >
                        <strong className="font-semibold">Fout</strong>
                        <div className="mt-1">{`${error.status || "500"}: ${
                            error.message || ""
                        }`}</div>
                    </div>
                )}

                {!hasSubmitted && (
                    <form id={formID} onSubmit={handleSubmit(onSubmit)}>
                        <div className="mb-4 last:mb-0">
                            {formFromProps &&
                                formFromProps.fields &&
                                formFromProps.fields?.map((field, index) => {
                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                    const Field: React.FC<any> =
                                        fields?.[
                                            field.blockType as keyof typeof fields
                                        ];
                                    if (Field) {
                                        return (
                                            <div
                                                className="mb-6 last:mb-0"
                                                key={index}
                                            >
                                                <Field
                                                    form={formFromProps}
                                                    {...field}
                                                    required={
                                                        "required" in field &&
                                                        field.required === true
                                                    }
                                                    {...formMethods}
                                                    control={control}
                                                    errors={errors}
                                                    register={register}
                                                />
                                            </div>
                                        );
                                    }
                                    return null;
                                })}
                        </div>

                        <Turnstile
                            siteKey={turnstileSiteKey}
                            theme="light"
                            sandbox={process.env.NODE_ENV === "development"}
                            onVerify={setToken}
                        />

                        <Button
                            form={formID}
                            type="submit"
                            variant="black"
                            disabled={!token || isSubmitting}
                            aria-busy={isSubmitting}
                        >
                            {isSubmitting ? "Verzenden..." : submitButtonLabel}
                        </Button>
                    </form>
                )}
            </FormProvider>
        </div>
    );
};
