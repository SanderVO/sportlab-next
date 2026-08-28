import { AdminBar } from "@/components/AdminBar";
import CookieBanner from "@/components/CookieBanner/CookieBanner";
import { Footer } from "@/components/Footer/Footer";
import { Header } from "@/components/Header/Header";
import { HeaderStateProvider } from "@/components/Header/HeaderContext";
import { MainWrapper } from "@/components/MainWrapper";
import { Organization } from "@/payload-types";
import { getCachedGlobal } from "@/utilities/getGlobals";
import { GoogleTagManager } from "@next/third-parties/google";
import { draftMode } from "next/headers";
import Script from "next/script";
import React from "react";

import { Media } from "@/components/Media";

export default async function SiteLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { isEnabled } = await draftMode();

    const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

    const organization = (await getCachedGlobal(
        "organization",
        1,
    )()) as Organization;

    return (
        <>
            <HeaderStateProvider>
                {isEnabled && (
                    <AdminBar
                        adminBarProps={{
                            preview: isEnabled,
                        }}
                    />
                )}

                <Header />

                <MainWrapper>{children}</MainWrapper>

                <Footer />

                <CookieBanner />

                <Script id="google-consent" strategy="beforeInteractive">
                    {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}

                gtag('consent', 'default', {
                ad_storage: 'denied',
                analytics_storage: 'denied',
                ad_user_data: 'denied',
                ad_personalization: 'denied',
                wait_for_update: 500
                });
            `}
                </Script>
            </HeaderStateProvider>

            {GTM_ID && <GoogleTagManager gtmId={GTM_ID} />}

            <Script
                id="organization-schema"
                type="application/ld+json"
                strategy="afterInteractive"
            >
                {JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": ["LocalBusiness", "ExerciseGym"],
                    name: organization.name,
                    url: organization.url,
                    ...(organization.priceRange && {
                        priceRange: organization.priceRange,
                    }),
                    ...(organization.images &&
                        typeof organization.images === "object" && {
                            image: organization.images
                                .filter(
                                    (img) =>
                                        img.image &&
                                        typeof img.image === "object" &&
                                        "url" in img.image,
                                )
                                .map((img) =>
                                    img.image instanceof Media
                                        ? img.image.url
                                        : img.image,
                                ),
                        }),
                    ...(organization.logo &&
                        typeof organization.logo === "object" && {
                            logo: organization.logo.url,
                        }),
                    ...(organization.email && {
                        email: organization.email,
                    }),
                    ...(organization.description && {
                        description: organization.description,
                    }),
                    ...(organization.contactPoint?.telephone && {
                        telephone: organization.contactPoint.telephone,
                    }),
                    ...(organization.geo?.latitude != null &&
                        organization.geo?.longitude != null && {
                            geo: {
                                "@type": "GeoCoordinates",
                                latitude: organization.geo.latitude,
                                longitude: organization.geo.longitude,
                            },
                        }),
                    ...(organization.address?.streetAddress && {
                        address: {
                            "@type": "PostalAddress",
                            streetAddress: organization.address.streetAddress,
                            addressLocality:
                                organization.address.addressLocality,
                            postalCode: organization.address.postalCode,
                            addressCountry: organization.address.addressCountry,
                        },
                    }),
                    ...(organization.sameAs?.length && {
                        sameAs: organization.sameAs.map((s) => s.url),
                    }),
                    ...(organization.openingHours && {
                        openingHoursSpecification: organization.openingHours,
                    }),
                })}
            </Script>
        </>
    );
}
