import { Anton, Archivo, Poppins } from "next/font/google";
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
