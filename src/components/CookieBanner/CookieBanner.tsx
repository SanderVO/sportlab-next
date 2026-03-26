"use client";

import { setCookie } from "@/actions/CookieActions";
import { useState } from "react";

export default function CookieBanner() {
    const [hasGivenConsent, setHasGivenConsent] = useState(() => {
        if (typeof document === "undefined") return false;

        return document.cookie.includes("ga_consent=granted");
    });

    const acceptAll = () => {
        if (!window.gtag) {
            console.warn(
                "Google Analytics is not loaded, cannot set consent preferences.",
            );

            setCookie("ga_consent", "denied");

            return;
        }

        window.gtag("consent", "update", {
            analytics_storage: "granted",
            ad_storage: "granted",
            ad_user_data: "granted",
            ad_personalization: "granted",
        });

        setCookie("ga_consent", "granted");

        setHasGivenConsent(true);
    };

    const rejectAll = () => {
        if (!window.gtag) {
            console.warn(
                "Google Analytics is not loaded, cannot set consent preferences.",
            );

            setCookie("ga_consent", "denied");

            return;
        }

        window.gtag("consent", "update", {
            ad_storage: "denied",
            analytics_storage: "denied",
            ad_user_data: "denied",
            ad_personalization: "denied",
        });

        setCookie("ga_consent", "denied");

        setHasGivenConsent(false);
    };

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
