import { Anton, Archivo, Poppins } from "next/font/google";
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

const anton = Anton({
    subsets: ["latin"],
    weight: ["400"],
    variable: "--font-anton",
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
            className={`${archivo.variable} ${poppins.variable} ${anton.variable}`}
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
