"use client";

import { useState } from "react";
import { Button } from "@/components/ui";
import { useAnalysisStore } from "@/lib/store";

export function ModalWrapper() {
  const [link, setLink] = useState("");
  const { setUrl, setLoading } = useAnalysisStore();

  const handleAnalyze = () => {
    if (!link) return;
    setUrl(link, "telegram");
    setLoading(true);
    setLink("");
  };

  return (
    <section className="flex items-center gap-0 max-w-lg mx-auto p-1 bg-gray-100 rounded-2xl shadow-md">
      <input
        type="text"
        placeholder="Enter link"
        value={link}
        onChange={(e) => setLink(e.target.value)}
        className="flex-1 bg-transparent outline-none px-4 py-1 text-forest-night placeholder-gray-500 rounded-l-2xl"
      />
      <Button
        className="bg-green-600 hover:bg-green-500 text-white rounded-r-2xl px-6 py-3 transition-colors duration-300"
        onClick={handleAnalyze}
      >
        Analyze
      </Button>
    </section>
  );
}
