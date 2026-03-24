import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "./providers";
import FloatingWhatsAppButton from "@/components/utils/FloatingWhatsAppButton";
import ClientWrapper from "./ClientWrapper";
import "mapbox-gl/dist/mapbox-gl.css";
import ScrollToTopOnRouteChange from "@/components/utils/ScrollToTopRouteChange";

export const metadata: Metadata = {
    title: "OPENDOOR",
    description:
    "Find, rent, and manage properties easily with OPENDOOR. Discover featured properties, testimonials, and more.",
    metadataBase: new URL("https://opendoor.com.bd"),
    icons: {
        icon: [
            { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
            { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
            { url: "/favicon.ico", sizes: "any" },
        ],
        apple: [
            { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
        ],
        other: [
            {
                rel: "manifest",
                url: "/site.webmanifest",
            },
        ],
    },
    openGraph: {
        title: "OPENDOOR",
        description:
      "Find, rent, and manage properties easily with OPENDOOR. Discover featured properties, testimonials, and more.",
        url: "https://opendoor.com.bd",
        siteName: "OPENDOOR",
        images: [
            {
                url: "https://opendoor.com.bd/og-image-v2.PNG",
                width: 1200,
                height: 630,
                alt: "OPENDOOR Property Search",
            },
        ],
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "OPENDOOR",
        description:
      "Find, rent, and manage properties easily with OPENDOOR. Discover featured properties, testimonials, and more.",
        images: ["https://opendoor.com.bd/og-image-v2.PNG"],
    },
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    themeColor: "#ffffff",
};

export default function RootLayout({
    children,
}: {
  children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <head>
                {/* Urbanist Font */}
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link
                    rel="preconnect"
                    href="https://fonts.gstatic.com"
                    crossOrigin="anonymous"
                />
                <link
                    href="https://fonts.googleapis.com/css2?family=Urbanist:wght@300;400;500;600;700&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body className="bg-white" style={{ fontFamily: "Urbanist, sans-serif" }}>
                <Providers>
                    <FloatingWhatsAppButton />
                    <ScrollToTopOnRouteChange />
                    <ClientWrapper>{children}</ClientWrapper>
                </Providers>
            </body>
        </html>
    );
}