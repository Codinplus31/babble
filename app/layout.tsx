import "./globals.css";
import type { Metadata } from "next";

import ToasterContext from "./context/ToasterContext";
import AuthContext from "./context/AuthContent";

import ActiveStatus from "./components/ActiveStatus";

import bg from "../public/assets/bg.png";

export const metadata: Metadata = {
    title: "Babble",
    description: "Real-time chat application",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <head>
                <link rel="icon" href="/assets/icon.png" sizes="any" />
            </head>
            <body
                style={{
                    backgroundImage: `url(${bg.src})`,
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                }}
            >
                <AuthContext>
                    <ToasterContext />
                    <ActiveStatus />
                    {children}
                </AuthContext>
            </body>
        </html>
    );
}
