"use client";

import { useAnalysisStore } from "@/lib/store";

export function DashboardHeader() {
  const { url, platform } = useAnalysisStore();

  return (
    <header className="bg-forest-night text-xl font-bold sticky top-0 z-10">
      {url ? (
        <>
          Dashboard: {platform === "telegram" ? "Telegram" : "YouTube"} {url}
        </>
      ) : (
        "Dashboard"
      )}
    </header>
  );
}
