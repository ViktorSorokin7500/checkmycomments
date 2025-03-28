import type { Metadata } from "next";
import "../globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Locale, i18n } from "@/i18n.config";
import { Toaster } from "react-hot-toast";
import { Source_Sans_3 as FontSans } from "next/font/google";
import { Footer, Header } from "@/components/shared";
import { enClerk, ukClerk } from "@/lib/clerkLocalizations";

const fontSans = FontSans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
});

const localizedMetadata = {
  en: {
    description: "Analyze comments from social platforms",
    keywords: "social media, comments, analysis, tool",
  },
  uk: {
    description: "Аналізуйте коментарі з соціальних платформ",
    keywords: "соціальні мережі, коментарі, аналіз, інструмент",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}): Promise<Metadata> {
  const { lang } = await params;

  return {
    title: {
      template: "%s | Comment Pulse",
      default: "Comment Pulse",
    },
    description: localizedMetadata[lang].description,
    keywords: localizedMetadata[lang].keywords,
    openGraph: {
      title: "Comment Pulse",
      description: localizedMetadata[lang].description,
      url: `https://www.commentpulse.site/${lang}`,
      type: "website",
      locale: lang === "en" ? "en_US" : "uk_UA",
      siteName: "Social Analyzer",
    },
    twitter: {
      card: "summary_large_image",
      title: "Comment Pulse",
      description: localizedMetadata[lang].description,
    },
  };
}

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

  const clerkLocalization = lang === "uk" ? ukClerk : enClerk;

  return (
    <ClerkProvider
      localization={clerkLocalization}
      signInUrl={`/${lang}/sign-in`}
      signUpUrl={`/${lang}/sign-up`}
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
