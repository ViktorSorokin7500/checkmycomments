"use client";

import clsx from "clsx";

import { useState } from "react";
import { Button, Dialog } from "@/components/ui";

export function ModalsHome() {
  const [modalOpen, setModalOpen] = useState<string | null>(null);

  const platforms = [
    { name: "Telegram", color: "bg-sky-500", hover: "hover:bg-sky-600" },
    { name: "YouTube", color: "bg-red-600", hover: "hover:bg-red-700" },
    { name: "X", color: "bg-black", hover: "hover:bg-stone-800" },
  ];

  return (
    <section className="flex flex-col items-center">
      <div className="mt-10 flex gap-4">
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
            <Dialog.DialogTitle>{modalOpen}</Dialog.DialogTitle>
          </Dialog.DialogHeader>
          <input
            type="text"
            placeholder={`Enter ${modalOpen} link`}
            className="mt-2 w-full rounded border p-2"
          />
          <Button onClick={() => setModalOpen(null)}>Close</Button>
        </Dialog.DialogContent>
      </Dialog.Dialog>
    </section>
  );
}
