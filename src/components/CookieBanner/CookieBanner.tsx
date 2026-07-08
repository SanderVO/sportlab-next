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
                <div className="fixed flex flex-col sm:flex-row bottom-4 left-4 right-4 bg-black text-white p-4 max-w-3xl mx-auto z-50 flex-wrap gap-4 border-2 border-gray-950 shadow-gray-950 shadow-lg justify-between items-center">
                    <p className="w-full text-center sm:text-left sm:max-w-1/2">
                        Sportlab gebruikt cookies voor analytische en marketing
                        doeleinden.
                    </p>

                    <div className="flex flex-row gap-4 items-center">
                        <button
                            className="block transition-colors rounded-3xl font-bold text-center py-3 px-10 text-xs self-baseline no-underline bg-sl-orange hover:bg-sl-orange-dark text-white w-full"
                            onClick={acceptAll}
                        >
                            Accepteren
                        </button>
                        <button
                            className="block transition-colors rounded-3xl font-bold text-center py-3 px-10 text-xs self-baseline no-underline bg-sl-orange hover:bg-sl-orange-dark text-white w-full"
                            onClick={rejectAll}
                        >
                            Weigeren
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
