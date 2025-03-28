import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Locale } from "@/i18n.config";
import { BgGradient } from "@/components/shared";
import { DashboardMain } from "@/components/dashboard";
import type { Metadata } from "next";

const localizedMetadata = {
  en: {
    title: "Dashboard",
    description: "Manage and analyze your social media comments",
    keywords: "dashboard, social media, analysis, comments",
  },
  uk: {
    title: "Панель керування",
    description: "Керуйте та аналізуйте коментарі з соціальних мереж",
    keywords: "панель керування, соціальні мережі, аналіз, коментарі",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}): Promise<Metadata> {
  const { lang } = await params;

  return {
    title: localizedMetadata[lang].title,
    description: localizedMetadata[lang].description,
    keywords: localizedMetadata[lang].keywords,
    openGraph: {
      title: localizedMetadata[lang].title,
      description: localizedMetadata[lang].description,
      url: `https://www.commentpulse.site/${lang}/dashboard`,
      type: "website",
      locale: lang === "en" ? "en_US" : "uk_UA",
    },
    twitter: {
      card: "summary_large_image",
      title: localizedMetadata[lang].title,
      description: localizedMetadata[lang].description,
    },
  };
}

async function getDictionary(lang: Locale) {
  const dictionary = await import(`@/dictionaries/${lang}.json`);
  return dictionary.default;
}

export default async function Dashboard({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  const { lang } = await params;
  const dictionary = await getDictionary(lang);

  return (
    <section>
      <BgGradient />
      <div className="mx-auto max-w-7xl px-6 py-12 sm:py-20 lg:px-8 space-y-4">
        <DashboardMain lang={lang} dictionary={dictionary} />
      </div>
    </section>
  );
}
