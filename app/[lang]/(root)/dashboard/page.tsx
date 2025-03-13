import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Locale } from "@/i18n.config";
import { DashboardComments } from "@/components/shared";

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
    <div className="py-12 text-center">
      <h1 className="text-3xl font-semibold">
        {dictionary.dashboard.main.title}
      </h1>
      <DashboardComments t={dictionary.dashboard.main} lang={lang} />
    </div>
  );
}
