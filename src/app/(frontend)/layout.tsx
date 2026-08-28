import {
    Anton,
    Archivo,
    Bebas_Neue,
    Montserrat,
    Open_Sans,
    Poppins,
} from "next/font/google";
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

const anton = Anton({
    subsets: ["latin"],
    weight: ["400"],
    variable: "--font-anton",
    display: "swap",
});

// Weights are the union of what the site and the TV dashboard need,
// now that both share this root layout.
const poppins = Poppins({
    subsets: ["latin"],
    weight: ["400", "500", "700", "800"],
    variable: "--font-poppins",
    display: "swap",
});

const archivo = Archivo({
    subsets: ["latin"],
    weight: ["400", "500", "700", "800"],
    variable: "--font-archivo",
    display: "swap",
});

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html
            lang="nl"
            className={`${montserrat.variable} ${bebasNeue.variable} ${openSans.variable} ${anton.variable} ${poppins.variable} ${archivo.variable}`}
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
