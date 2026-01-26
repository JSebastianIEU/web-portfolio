import type { Metadata } from "next";
import { Space_Grotesk, Sora } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "REPLACE_WITH_PRODUCTION_URL"; // TODO: set to production URL
const metadataBase =
  SITE_URL.startsWith("http://") || SITE_URL.startsWith("https://")
    ? new URL(SITE_URL)
    : new URL("http://localhost:3000");
const SOCIAL_IMAGE = "/images/me.png";
const TITLE = "Juan Sebastian Peña | Software Engineering & AI";
const DESCRIPTION =
  "Portfolio of Juan Sebastian Peña, focused on software engineering, artificial intelligence, and data-driven projects.";
const OG_DESCRIPTION = "Portfolio focused on software engineering, artificial intelligence, and data-driven projects.";
const TWITTER_DESCRIPTION = "Software engineering and artificial intelligence portfolio.";

const display = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const body = Sora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  metadataBase,
  alternates: {
    canonical: `${SITE_URL}/`,
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: TITLE,
    description: OG_DESCRIPTION,
    url: `${SITE_URL}/`,
    type: "website",
    siteName: "Juan Sebastián Peña",
    locale: "en_US",
    images: [
      {
        url: `${SITE_URL}${SOCIAL_IMAGE}`,
        width: 1200,
        height: 630,
        alt: TITLE,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: TWITTER_DESCRIPTION,
    images: [`${SITE_URL}${SOCIAL_IMAGE}`],
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.png", type: "image/png", sizes: "32x32" },
    ],
    shortcut: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${display.variable} ${body.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
