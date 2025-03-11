import {
  Benefits,
  Efficiency,
  Footer,
  Hero,
  Pricing,
  Researching,
  WhoWeAre,
} from "@/components/shared";
import { Locale } from "@/i18n.config";

// Функція для завантаження словників на сервері
async function getDictionary(lang: Locale) {
  const dictionary = await import(`@/dictionaries/${lang}.json`);
  return dictionary.default;
}

export default async function Home({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);

  return (
    <>
      <Hero t={dictionary.home.hero} />
      <WhoWeAre t={dictionary.home.wwa} />
      <Researching t={dictionary.home.researching} />
      <Benefits t={dictionary.home.benefits} />
      <Efficiency t={dictionary.home.efficiency} />
      <Pricing t={dictionary.home.pricing} lang={lang} />
      <Footer t={dictionary.footer} />
    </>
  );
}
