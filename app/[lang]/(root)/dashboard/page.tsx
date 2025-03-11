import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { SignOutButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Locale } from "@/i18n.config";

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
      <h1 className="text-3xl font-semibold">{dictionary.dashboard.title}</h1>
      <p className="text-lg  mt-4">{dictionary.dashboard.welcome}</p>
      <SignOutButton redirectUrl="/">
        <Button className="mt-6 bg-sunset-glow">
          {dictionary.dashboard.cta}
        </Button>
      </SignOutButton>
    </div>
  );
}
