import {
  DashboardHeader,
  ModalWrapper,
  SidebarDashboard,
} from "@/components/shared";
import { Locale } from "@/i18n.config";

async function getDictionary(lang: Locale) {
  const dictionary = await import(`@/dictionaries/${lang}.json`);
  return dictionary.default;
}

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);

  return (
    <div>
      <SidebarDashboard t={dictionary.dashboard.sidebar} />
      <div className="md:ml-64">
        <div>
          <div className="hidden md:block md:py-4 text-center">
            <DashboardHeader />
          </div>
          <ModalWrapper />
        </div>
        <main className="flex-1 container mx-auto px-4">{children}</main>
      </div>
    </div>
  );
}
