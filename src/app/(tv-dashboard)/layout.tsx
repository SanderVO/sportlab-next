import { Archivo, Open_Sans, Poppins } from "next/font/google";
import React from "react";

import "../(frontend)/globals.css";

const archivo = Archivo({
    subsets: ["latin"],
    weight: ["400", "500", "700", "800"],
    variable: "--font-archivo",
    display: "swap",
});

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["400", "500", "700", "800"],
    variable: "--font-poppins",
    display: "swap",
});

const openSans = Open_Sans({
    subsets: ["latin"],
    weight: ["400", "700"],
    variable: "--font-open-sans",
    display: "swap",
});

export default function TvDashboardRootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html
            lang="nl"
            className={`${archivo.variable} ${poppins.variable} ${openSans.variable}`}
            suppressHydrationWarning
        >
            <head>
                <link
                    rel="icon"
                    href="https://cdn.sportlabgroningen.nl/images/favicon.ico"
                    sizes="any"
                />
            </head>

            <body className="bg-[#06090f] text-white">{children}</body>
        </html>
    );
}
