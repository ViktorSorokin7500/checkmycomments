"use client";

import { useState } from "react";
import { Button } from "@/components/ui";
import { useAnalysisStore } from "@/lib/store";
import { WithTranslationsProps } from "@/types/component-props";
import toast from "react-hot-toast";

export function ModalWrapper({ dictionary }: WithTranslationsProps) {
  const [link, setLink] = useState("");
  const { setUrl, setLoading } = useAnalysisStore();
  const t = dictionary.dashboard.wrapper;

  const handleAnalyze = () => {
    if (!link) {
      toast.error(t.emptyLink || "Please enter a URL", {
        style: { background: "#FF4444", color: "#FFFFFF" },
      });
      return;
    }

    const normalizedLink = link.trim();
    let platform: "telegram" | "youtube" | null = null;

    if (normalizedLink.includes("t.me")) {
      platform = "telegram";
    } else if (
      normalizedLink.includes("youtube.com") ||
      normalizedLink.includes("youtu.be")
    ) {
      platform = "youtube";
    }

    if (!platform) {
      alert(t.invalidLink || "Invalid link format");
      return;
    }

    setUrl(normalizedLink, platform);
    setLoading(true);
    setLink("");
  };

  return (
    <section className="flex items-center gap-0 w-[280px] sm:w-md mx-auto p-1 bg-gray-100 rounded-2xl shadow-md mb-6">
      <input
        type="text"
        placeholder={t.placeholder}
        value={link}
        onChange={(e) => setLink(e.target.value)}
        className="flex-1 bg-transparent outline-none px-2 sm:px-4 py-1 text-forest-night text-xs sm:text-base placeholder-gray-500 rounded-l-2xl"
      />
      <Button
        className="bg-green-600 hover:bg-green-500 text-white rounded-r-2xl px-2 sm:px-6 py-3 transition-colors duration-300 text-xs sm:text-base"
        onClick={handleAnalyze}
      >
        {t.analyze}
      </Button>
    </section>
  );
}
