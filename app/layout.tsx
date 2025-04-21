import Footer from "../components/Footer";
import Header from "../components/Header";
import "./globals.css";

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="nl">
            <body>
                <Header />

                <main className="container">{children}</main>

                <Footer />
            </body>
        </html>
    );
}
