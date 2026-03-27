"use client";

import { useEffect, useState } from "react";

export default function CookieBanner() {
    const [hasGivenConsent, setHasGivenConsent] = useState<boolean>(true);

    const setConsentCookie = (value: "granted" | "denied") => {
        document.cookie = `ga_consent=${value}; Path=/; Max-Age=31536000; SameSite=Lax`;
    };

    const acceptAll = () => {
        setConsentCookie("granted");

        setHasGivenConsent(true);

        if (!window.gtag) {
            console.warn(
                "Google Analytics is not loaded, cannot set consent preferences.",
            );

            return;
        }

        window.gtag("consent", "update", {
            analytics_storage: "granted",
            ad_storage: "granted",
            ad_user_data: "granted",
            ad_personalization: "granted",
        });
    };

    const rejectAll = () => {
        setConsentCookie("denied");

        setHasGivenConsent(true);

        if (!window.gtag) {
            console.warn(
                "Google Analytics is not loaded, cannot set consent preferences.",
            );

            return;
        }

        window.gtag("consent", "update", {
            ad_storage: "denied",
            analytics_storage: "denied",
            ad_user_data: "denied",
            ad_personalization: "denied",
        });
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setHasGivenConsent(
            typeof window !== "undefined" &&
                document.cookie.includes("ga_consent="),
        );
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
