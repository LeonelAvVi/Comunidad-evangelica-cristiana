import type { Metadata } from "next";
import { Fraunces, IBM_Plex_Mono, Inter } from "next/font/google";
import { EventsProvider } from "@/lib/events-context";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ToastProvider } from "@/components/Toast";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const plex = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-plex",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://www.comunidadcce.online",
  ),
  title: {
    default: "Comunidad Cristiana — Sucre",
    template: "%s · Comunidad Cristiana",
  },
  description:
    "Iglesia en Sucre: niños, adolescentes, jóvenes y matrimonios. Enterate de los próximos eventos de cada sector.",
  openGraph: {
    type: "website",
    siteName: "Comunidad Cristiana",
    locale: "es_BO",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${inter.variable} ${fraunces.variable} ${plex.variable}`}>
      <body>
        <ToastProvider>
          <EventsProvider>
            <Header />
            <main>{children}</main>
            <Footer />
          </EventsProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
