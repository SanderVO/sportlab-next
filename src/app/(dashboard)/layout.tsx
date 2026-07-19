import { Bebas_Neue, Montserrat, Open_Sans } from "next/font/google";
import React from "react";

import "../(frontend)/globals.css";

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

export default function DashboardRootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html
            lang="nl"
            className={`${montserrat.variable} ${bebasNeue.variable} ${openSans.variable}`}
            suppressHydrationWarning
        >
            <head>
                <link
                    rel="icon"
                    href="https://cdn.sportlabgroningen.nl/images/favicon.ico"
                    sizes="any"
                />
            </head>

            <body>{children}</body>
        </html>
    );
}
