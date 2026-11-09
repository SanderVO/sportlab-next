import { Anton, Archivo, Poppins } from "next/font/google";
import type { Metadata } from "next";
import React from "react";

import "../(frontend)/globals.css";

const anton = Anton({
    subsets: ["latin"],
    weight: ["400"],
    variable: "--font-anton",
    display: "swap",
});

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["400", "700"],
    variable: "--font-poppins",
    display: "swap",
});

const archivo = Archivo({
    subsets: ["latin"],
    weight: ["800"],
    variable: "--font-archivo",
    display: "swap",
});

// Login and member dashboard: keep out of search results. Not disallowed in
// robots.txt, so crawlers can still read this noindex.
export const metadata: Metadata = {
    robots: { index: false, follow: false },
};

export default function DashboardRootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html
            lang="nl"
            className={`${anton.variable} ${poppins.variable} ${archivo.variable}`}
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
