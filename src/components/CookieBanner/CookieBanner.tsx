"use client";

import { useEffect, useState } from "react";

const parseConsentCookie = (cookie: string): "granted" | "denied" | null => {
    const consentCookie = cookie
        .split("; ")
        .find((row) => row.startsWith("ga_consent="));

    if (!consentCookie) {
        return null;
    }

    const value = consentCookie.split("=")[1];

    if (value === "granted" || value === "denied") {
        return value;
    }

    return null;
};

export default function CookieBanner() {
    const [hasGivenConsent, setHasGivenConsent] = useState(true);

    const getConsentCookie = (): "granted" | "denied" | null => {
        return parseConsentCookie(document.cookie);
    };

    const updateGoogleConsent = (value: "granted" | "denied") => {
        if (!window.gtag) {
            console.warn(
                "Google Analytics is not loaded, cannot set consent preferences.",
            );

            return;
        }

        const consentState = value === "granted" ? "granted" : "denied";

        window.gtag("consent", "update", {
            analytics_storage: consentState,
            ad_storage: consentState,
            ad_user_data: consentState,
            ad_personalization: consentState,
        });
    };

    const setConsentCookie = (value: "granted" | "denied") => {
        const secureAttribute =
            window.location.protocol === "https:" ? "; Secure" : "";

        document.cookie = `ga_consent=${value}; Path=/; Max-Age=31536000; SameSite=Lax${secureAttribute}`;
    };

    const acceptAll = () => {
        setConsentCookie("granted");

        setHasGivenConsent(true);
        updateGoogleConsent("granted");
    };

    const rejectAll = () => {
        setConsentCookie("denied");

        setHasGivenConsent(true);
        updateGoogleConsent("denied");
    };

    useEffect(() => {
        const storedConsent = getConsentCookie();

        if (storedConsent) {
            updateGoogleConsent(storedConsent);
            setHasGivenConsent(true);
            return;
        }

        setHasGivenConsent(false);
    }, []);

    return (
        <>
            {!hasGivenConsent && (
                <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-cta/30 bg-[#f6f2ea]/95 px-4 py-4 text-ink shadow-lg shadow-charcoal/10 sm:px-6 lg:px-8">
                    <div className="mx-auto flex max-w-none flex-col gap-4 sm:flex-row sm:items-center sm:justify-between lg:gap-6">
                        <p className="w-full text-center text-sm leading-relaxed sm:max-w-xl sm:text-left md:text-base">
                            Sportlab gebruikt cookies voor analytische en
                            marketing doeleinden.
                        </p>

                        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
                            <button
                                className="cursor-pointer w-full rounded-3xl bg-cta px-6 py-3 text-center text-xs font-bold text-warm-white transition-colors hover:bg-cta-dark sm:w-auto"
                                onClick={acceptAll}
                            >
                                Accepteren
                            </button>

                            <button
                                className="cursor-pointer w-full rounded-3xl border border-cta bg-transparent px-6 py-3 text-center text-xs font-bold text-cta transition-colors hover:bg-cta hover:text-warm-white sm:w-auto"
                                onClick={rejectAll}
                            >
                                Weigeren
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
