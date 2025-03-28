import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Locale } from "@/i18n.config";
import { BgGradient } from "@/components/shared";
import { DashboardHeader, DashboardViewer } from "@/components/dashboard";
import type { Metadata } from "next";

// Локализованные метаданные для YouTube-страницы
const localizedMetadata = {
  en: {
    title: "YouTube Dashboard",
    description: "Analyze and manage your YouTube comments",
    keywords: "youtube, dashboard, social media, comments, analysis",
  },
  uk: {
    title: "Панель YouTube",
    description: "Аналізуйте та керуйте коментарями з YouTube",
    keywords: "youtube, панель керування, соціальні мережі, коментарі, аналіз",
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
      url: `https://www.commentpulse.site/${lang}/dashboard/youtube`,
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

export default async function Youtube({
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
      <BgGradient className="from-sky-700 via-sky-800 to-sky-900" />
      <div className="max-w-7xl mx-auto">
        <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-12 lg:py-24">
          <DashboardHeader
            title="Youtube"
            dictionary={dictionary}
            className={
              "bg-linear-to-r bg-clip-text text-transparent from-red-500 to-rose-700"
            }
          />

          <DashboardViewer dictionary={dictionary} lang={lang} />
        </div>
      </div>
    </section>
  );
}
