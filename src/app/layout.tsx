import type { Metadata } from "next";
import { Space_Grotesk, Sora } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";
import SocialRail from "@/components/SocialRail";
import Footer from "@/components/Footer";

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
  title: "Juan Sebastian Peña | Portfolio",
  description:
    "Portafolio web con experiencias 3D, animaciones on-scroll, modo claro/oscuro y contenido bilingÃ¼e.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning style={{ cursor: "none" }}>
      <body
        suppressHydrationWarning
        className={`${display.variable} ${body.variable} antialiased`}
        style={{ cursor: "none" }}
      >
        <Providers>
          <SocialRail />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
