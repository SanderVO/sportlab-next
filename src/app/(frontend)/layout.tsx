import { AdminBar } from "@/components/AdminBar";
import CookieBanner from "@/components/CookieBanner/CookieBanner";
import { Footer } from "@/components/Footer/Footer";
import { Header } from "@/components/Header/Header";
import { WhatsappButton } from "@/components/WhatsApp/WhatsappButton";
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

                <WhatsappButton />

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
            </body>
        </html>
    );
}
