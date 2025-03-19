import {
  CTAsection,
  DemoSection,
  HeroSection,
  HowItWorksSection,
  PricingSection,
} from "@/components/home";
import { BgGradient } from "@/components/shared";
import { Locale } from "@/i18n.config";

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
    <div className="relative w-full">
      <BgGradient />
      <div className="flex flx-col">
        <HeroSection dictionary={dictionary} lang={lang} />
      </div>
      <DemoSection dictionary={dictionary} />
      <HowItWorksSection dictionary={dictionary} />
      <PricingSection dictionary={dictionary} />
      <CTAsection dictionary={dictionary} lang={lang} />
    </div>
  );
}
