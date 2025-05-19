import { Bebas_Neue, Montserrat, Open_Sans } from "next/font/google";
import Footer from "../components/Footer";
import Header from "../components/Header";
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

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html
            lang="nl"
            className={`${montserrat.variable} ${bebasNeue.variable} ${openSans.variable}`}
        >
            <body>
                <Header />

                <main>{children}</main>

                <Footer />
            </body>
        </html>
    );
}
