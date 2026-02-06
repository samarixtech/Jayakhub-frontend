// app/layout.tsx
import { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "@/components/ReduxProvider";
// import NavbarHider from "@/components/NavbarHider";
import { cookies } from "next/headers";
import { CLCProvider } from "./context/CLCContext";
import { Toaster } from "react-hot-toast";
import { Metadata } from "next";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

type SupportedLocale = "en" | "fr" | "es" | "ar";
const defaultLocale: SupportedLocale = "en";
const supportedLocales: SupportedLocale[] = ["en", "fr", "es", "ar"];

interface RootLayoutProps {
  children: ReactNode;
  params?: Promise<{ locale?: string; country?: string }>;
}
export const metadata: Metadata = {
  title: "Jayak Hub",
  description: "Iraq's premier Food Delivery Platform",
};

export default async function RootLayout({
  children,
  params,
}: RootLayoutProps) {
  const resolvedParams = params ? await params : {};

  const cookieStore = cookies();
  let currentLocale: SupportedLocale = defaultLocale;

  const cookieLocale = (await cookieStore).get("NEXT_LOCALE")?.value;
  if (
    cookieLocale &&
    supportedLocales.includes(cookieLocale as SupportedLocale)
  ) {
    currentLocale = cookieLocale as SupportedLocale;
  } else if (
    resolvedParams?.locale &&
    supportedLocales.includes(resolvedParams.locale as SupportedLocale)
  ) {
    currentLocale = resolvedParams.locale as SupportedLocale;
  }

  const messages = (
    await import(`../components/messages/${currentLocale}.json`)
  ).default;
  const dir = currentLocale === "ar" ? "rtl" : "ltr";

  return (
    <html lang={currentLocale} dir={dir}>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "rgba(11, 93, 78, 0.55)", // ↓ reduced opacity
              color: "#E8F4F1",
              borderRadius: "12px",
              border: "1px solid rgba(255,255,255,0.15)",
              padding: "14px 18px",
              backdropFilter: "blur(6px)", // soft glass effect
              boxShadow: "0 4px 18px rgba(0,0,0,0.18)",
            },
            success: {
              iconTheme: {
                primary: "#E8F4F1",
                secondary: "rgba(11,93,78,0.55)",
              },
            },
            error: {
              iconTheme: {
                primary: "#FFD2D2",
                secondary: "rgba(122,0,0,0.55)",
              },
              style: {
                background: "rgba(122, 0, 0, 0.55)",
                border: "1px solid rgba(255,255,255,0.15)",
              },
            },
          }}
        />

        <CLCProvider>
          <ReduxProvider>
            <NextIntlClientProvider locale={currentLocale} messages={messages}>
              {children}
            </NextIntlClientProvider>
          </ReduxProvider>
        </CLCProvider>
      </body>
    </html>
  );
}
