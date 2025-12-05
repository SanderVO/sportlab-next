import { AdminBar } from "@/components/AdminBar";
import { Footer } from "@/Footer/Footer";
import { Header } from "@/Header/Header";
import { Providers } from "@/providers";
import { InitTheme } from "@/providers/Theme/InitTheme";
import { GoogleTagManager } from "@next/third-parties/google";
import { Bebas_Neue, Montserrat, Open_Sans } from "next/font/google";
import { draftMode } from "next/headers";
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

    return (
        <html
            lang="nl"
            className={`${montserrat.variable} ${bebasNeue.variable} ${openSans.variable}`}
            suppressHydrationWarning
        >
            <head>
                <InitTheme />
                <link href="/favicon.ico" rel="icon" sizes="32x32" />
                <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
            </head>
            <body>
                <Providers>
                    <AdminBar
                        adminBarProps={{
                            preview: isEnabled,
                        }}
                    />

                    <Header />

                    {children}

                    <Footer />
                </Providers>
            </body>

            {process.env.GTM_ID && (
                <GoogleTagManager gtmId={process.env.GTM_ID} />
            )}
        </html>
    );
}
