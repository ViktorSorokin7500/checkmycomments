"use client";

import clsx from "clsx";
import { useState } from "react";
import { Button, Dialog } from "@/components/ui";
import { useAnalysisStore } from "@/lib/store";

export function ModalWrapper() {
  const [modalOpen, setModalOpen] = useState<string | null>(null);
  const [link, setLink] = useState("");
  const { setUrl, setLoading } = useAnalysisStore();

  const platforms = [
    { name: "Telegram", color: "bg-sky-500", hover: "hover:bg-sky-600" },
    { name: "YouTube", color: "bg-red-600", hover: "hover:bg-red-700" },
    { name: "X", color: "bg-black", hover: "hover:bg-stone-800" },
  ];

  const handleAnalyze = () => {
    if (!link) return;
    setUrl(link, modalOpen!.toLowerCase() as "telegram" | "youtube");
    setLoading(true);
    setModalOpen(null);
    setLink("");
  };

  return (
    <section className="flex flex-col items-center">
      <div className="flex gap-4">
        {platforms.map((platform) => (
          <Button
            key={platform.name}
            className={clsx(platform.color, platform.hover)}
            onClick={() => setModalOpen(platform.name)}
          >
            {platform.name}
          </Button>
        ))}
      </div>

      <Dialog.Dialog open={!!modalOpen} onOpenChange={() => setModalOpen(null)}>
        <Dialog.DialogContent>
          <Dialog.DialogHeader>
            <Dialog.DialogTitle className="text-forest-night">
              {modalOpen}
            </Dialog.DialogTitle>
          </Dialog.DialogHeader>
          <input
            type="text"
            placeholder={`Enter ${modalOpen} link`}
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className="mt-2 w-full rounded border p-2 text-forest-night"
          />
          <Button onClick={handleAnalyze}>Analyze</Button>
          <Button
            onClick={() => setModalOpen(null)}
            variant="outline"
            className="text-forest-night"
          >
            Close
          </Button>
        </Dialog.DialogContent>
      </Dialog.Dialog>
    </section>
  );
}
