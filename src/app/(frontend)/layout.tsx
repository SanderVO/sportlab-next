import { AdminBar } from "@/components/AdminBar";
import CookieBanner from "@/components/CookieBanner/CookieBanner";
import { Footer } from "@/components/Footer/Footer";
import { Header } from "@/components/Header/Header";
import { Organization } from "@/payload-types";
import { getCachedGlobal } from "@/utilities/getGlobals";
import { GoogleTagManager } from "@next/third-parties/google";
import { Bebas_Neue, Montserrat, Open_Sans } from "next/font/google";
import { draftMode } from "next/headers";
import Script from "next/script";
import React from "react";
import "./globals.css";

const montserrat = Montserrat({
    subsets: ["latin"],
    weight: ["400", "500", "700"],
    variable: "--font-montserrat",
    display: "swap",
});

const bebasNeue = Bebas_Neue({
    subsets: ["latin"],
    weight: "400",
    variable: "--font-bebas",
    display: "swap",
});

const openSans = Open_Sans({
    subsets: ["latin"],
    weight: ["400", "700"],
    variable: "--font-open-sans",
    display: "swap",
});

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { isEnabled } = await draftMode();

    const GTM_ID = process.env.GTM_ID;

    const organization = (await getCachedGlobal(
        "organization",
        1,
    )()) as Organization;

    return (
        <html
            lang="nl"
            className={`${montserrat.variable} ${bebasNeue.variable} ${openSans.variable}`}
            suppressHydrationWarning
        >
            <head>
                <link href="/favicon.ico" rel="icon" sizes="32x32" />
                <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
            </head>

            <body>
                <AdminBar
                    adminBarProps={{
                        preview: isEnabled,
                    }}
                />

                <Header />

                <main>{children}</main>

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

                {GTM_ID && <GoogleTagManager gtmId={GTM_ID} />}

                <Script
                    id="organization-schema"
                    type="application/ld+json"
                    strategy="afterInteractive"
                >
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Organization",
                        name: organization.name,
                        url: organization.url,
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
                            contactPoint: {
                                "@type": "ContactPoint",
                                telephone: organization.contactPoint.telephone,
                                ...(organization.contactPoint.contactType && {
                                    contactType:
                                        organization.contactPoint.contactType,
                                }),
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
                        ...(organization.sameAs?.length && {
                            sameAs: organization.sameAs.map((s) => s.url),
                        }),
                    })}
                </Script>
            </body>
        </html>
    );
}
