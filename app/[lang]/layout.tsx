import type { Metadata } from "next";
import "../globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Locale, i18n } from "@/i18n.config";
import { Toaster } from "react-hot-toast";
import { Source_Sans_3 as FontSans } from "next/font/google";
import { Footer, Header } from "@/components/shared";

const fontSans = FontSans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
});

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
  const { lang } = await params;

  return (
    <ClerkProvider
      signInFallbackRedirectUrl={`/${lang}/dashboard`}
      signUpFallbackRedirectUrl={`/${lang}/dashboard`}
    >
      <html lang={lang === "en" ? "en-US" : "uk-UA"}>
        <body className={`font-sans ${fontSans.variable} antialiased`}>
          <div className="relative flex flex-col min-h-screen">
            <Header lang={lang} />
            <main className="flex-1">{children}</main>
            <Footer lang={lang} />
          </div>
          <Toaster position="top-right" />
        </body>
      </html>
    </ClerkProvider>
  );
}
