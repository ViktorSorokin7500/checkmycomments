import { Header } from "@/components/shared";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto p-4">{children}</main>
      <footer className="bg-forest-night p-4 text-center text-soft-fog">
        &copy; 2025 Social Analyzer
      </footer>
    </div>
  );
}
