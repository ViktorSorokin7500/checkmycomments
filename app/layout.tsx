import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Locale, i18n } from "@/i18n.config";

export const metadata: Metadata = {
  title: "Social Analyzer",
  description: "Analyze comments from social platforms",
};

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: Locale }>;
}) {
  return (
    <ClerkProvider>
      <html lang={(await params).lang === "en" ? "en-US" : "uk-UA"}>
        <body className="bg-forest-night text-bright-snow">{children}</body>
      </html>
    </ClerkProvider>
  );
}
