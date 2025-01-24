import { AuthProvider } from "@/hooks/authContext";
import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata = {
    title: "GIVEWELL",
    description: "Be the Change You Wish to See",
};

export default function RootLayout({ children }) {
    return (
        <AuthProvider>
            <html lang="en">
                <link
                    rel="icon"
                    href="./images/logo.png"
                    type="image"
                    sizes="<generated>"
                />
                <body
                    className={`${geistSans.variable} ${geistMono.variable} antialiased`}
                >
                    {children}
                </body>
            </html>
        </AuthProvider>
    );
}
