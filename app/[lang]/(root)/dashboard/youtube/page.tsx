import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Locale } from "@/i18n.config";
import { BgGradient } from "@/components/shared";
import { NoticeBlock } from "@/components/dashboard";

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
      <BgGradient />
      <div className="mx-auto max-w-7xl px-6 py-12 sm:py-20 lg:px-8">
        <h1 className="font-bold text-center">Youtube</h1>
        <NoticeBlock dictionary={dictionary} />
      </div>
    </section>
  );
}
