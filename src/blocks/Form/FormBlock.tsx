"use client";

import RichText from "@/components/RichText";
import { Button } from "@/components/ui/Button";
import { getClientSideURL } from "@/utilities/getURL";
import type {
    FormFieldBlock,
    Form as FormType,
} from "@payloadcms/plugin-form-builder/types";
import type { DefaultTypedEditorState } from "@payloadcms/richtext-lexical";
import { Turnstile } from "next-turnstile";
import { useRouter } from "next/navigation";
import React, { useCallback, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { fields } from "./fields";

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

    const formMethods = useForm({
        defaultValues: formFromProps.fields,
    });
    const {
        control,
        formState: { errors },
        handleSubmit,
        register,
    } = formMethods;

    const [token, setToken] = useState<string>();
    const [isLoading, setIsLoading] = useState(false);
    const [hasSubmitted, setHasSubmitted] = useState<boolean>();
    const [error, setError] = useState<
        { message: string; status?: string } | undefined
    >();

    const router = useRouter();

    const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

    const onSubmit = useCallback(
        (data: FormFieldBlock[]) => {
            let loadingTimerID: ReturnType<typeof setTimeout>;

            const submitForm = async () => {
                if (!token) return;

                setError(undefined);

                const dataToSend = Object.entries(data).map(
                    ([name, value]) => ({
                        field: name,
                        value,
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

                        setError({
                            message:
                                res.errors?.[0]?.message ||
                                "Internal Server Error",
                            status: res.status,
                        });

                        return;
                    }

                    setIsLoading(false);
                    setHasSubmitted(true);

                    if (confirmationType === "redirect" && redirect) {
                        const { url } = redirect;

                        const redirectUrl = url;

                        if (redirectUrl) router.push(redirectUrl);
                    }
                } catch (err) {
                    console.warn(err);

                    setIsLoading(false);

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

                {isLoading && !hasSubmitted && <p>Verzenden...</p>}

                {error && (
                    <div>{`${error.status || "500"}: ${
                        error.message || ""
                    }`}</div>
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
                            disabled={!token}
                        >
                            {submitButtonLabel}
                        </Button>
                    </form>
                )}
            </FormProvider>
        </div>
    );
};
