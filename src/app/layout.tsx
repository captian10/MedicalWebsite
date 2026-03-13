import type { Metadata, Viewport } from "next";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Mega Medical Academy | Anesthesiology Education & Training",
    template: "%s | Mega Medical Academy",
  },
  description:
    "Mega Medical Academy provides high-quality anesthesiology education for anesthesiologists, residents, and critical care professionals. Learn anesthesia techniques, airway management, ICU care, and perioperative safety.",
  keywords: [
    "anesthesiology",
    "anesthesia",
    "anesthesiologist",
    "anesthesia lectures",
    "airway management",
    "critical care",
    "ICU",
    "pain management",
    "regional anesthesia",
    "general anesthesia",
    "perioperative medicine",
    "sedation",
    "anesthesia training",
    "medical education",
    "resident education",
  ],
  authors: [{ name: "Mega Medical Academy" }],
  creator: "Mega Medical Academy",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Mega Medical Academy",
    title: "Mega Medical Academy | Anesthesiology Education & Training",
    description:
      "High-quality anesthesiology education for doctors and residents. Explore lectures in anesthesia, airway management, ICU care, and perioperative safety.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Mega Medical Academy - Anesthesiology Education & Training",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mega Medical Academy | Anesthesiology Education & Training",
    description:
      "Advanced anesthesiology education covering anesthesia techniques, airway management, ICU care, pain management, and perioperative safety.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0f19" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
