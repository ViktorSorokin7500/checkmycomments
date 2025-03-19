import { Locale } from "@/i18n.config";

async function getDictionary(lang: Locale) {
  const dictionary = await import(`@/dictionaries/${lang}.json`);
  return dictionary.default;
}

export async function Footer({ lang }: { lang: Locale }) {
  const dictionary = await getDictionary(lang);
  return <footer>Footer</footer>;
}
