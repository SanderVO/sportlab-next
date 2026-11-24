import { AdminBar } from "@/components/AdminBar";
import CookieBanner from "@/components/CookieBanner/CookieBanner";
import { Footer } from "@/components/Footer/Footer";
import { Header } from "@/components/Header/Header";
import { HeaderStateProvider } from "@/components/Header/HeaderContext";
import { MainWrapper } from "@/components/MainWrapper";
import { Organization } from "@/payload-types";
import { getCachedGlobal } from "@/utilities/getGlobals";
import { getServerSideURL, toAbsoluteUrl } from "@/utilities/getURL";
import { GoogleTagManager } from "@next/third-parties/google";
import { draftMode } from "next/headers";
import Script from "next/script";
import React from "react";

const SCHEMA_DAYS: Record<string, string> = {
    monday: "Monday",
    tuesday: "Tuesday",
    wednesday: "Wednesday",
    thursday: "Thursday",
    friday: "Friday",
    saturday: "Saturday",
    sunday: "Sunday",
};

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
    )) as Organization;

    const siteUrl = getServerSideURL();

    const organizationImages = (organization.images ?? [])
        .map((item) =>
            item.image && typeof item.image === "object"
                ? toAbsoluteUrl(item.image.url)
                : undefined,
        )
        .filter((url): url is string => Boolean(url));

    const sameAs = (organization.sameAs ?? [])
        .map((item) => toAbsoluteUrl(item.url))
        .filter((url): url is string => Boolean(url));

    const openingHours = organization.openingHours ?? [];

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

            <script
                id="organization-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": ["LocalBusiness", "ExerciseGym"],
                        "@id": `${siteUrl}/#organization`,
                        name: organization.name,
                        // The canonical origin, not the free-text CMS value:
                        // that one can be missing the scheme or use www.
                        url: siteUrl,
                        ...(organization.priceRange && {
                            priceRange: organization.priceRange,
                        }),
                        ...(organizationImages.length > 0 && {
                            image: organizationImages,
                        }),
                        ...(organization.logo &&
                            typeof organization.logo === "object" &&
                            organization.logo.url && {
                                logo: toAbsoluteUrl(organization.logo.url),
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
                                streetAddress:
                                    organization.address.streetAddress,
                                addressLocality:
                                    organization.address.addressLocality,
                                postalCode: organization.address.postalCode,
                                addressCountry:
                                    organization.address.addressCountry,
                            },
                        }),
                        ...(sameAs.length > 0 && { sameAs }),
                        ...(openingHours.length > 0 && {
                            openingHoursSpecification: openingHours.map(
                                ({ dayOfWeek, opens, closes }) => ({
                                    "@type": "OpeningHoursSpecification",
                                    dayOfWeek: `https://schema.org/${
                                        SCHEMA_DAYS[dayOfWeek] ?? dayOfWeek
                                    }`,
                                    opens,
                                    closes,
                                }),
                            ),
                        }),
                    }).replace(/</g, "\\u003c"),
                }}
            />
        </>
    );
}
