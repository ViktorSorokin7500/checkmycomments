"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { WithTranslationsProps } from "@/types/component-props";

export function NoticeBlock({ dictionary }: WithTranslationsProps) {
  const t = dictionary.dashboard.dearUsers.description;
  const [expanded, setExpanded] = useState(true);

  const text = `
    ${t[1]}
    ${t[2]}
    ${t[3]}
    ${t[4]}
    ${t[5]}

  `;

  return (
    <div className="rounded-2xl max-w-2xl mx-auto text-center">
      {expanded ? (
        <p className="text-gray-700 text-sm leading-6 whitespace-pre-line">
          {text}
        </p>
      ) : (
        <p className="text-gray-800 text-sm leading-6 whitespace-pre-line line-clamp-2">
          {text}
        </p>
      )}
      <Button
        onClick={() => setExpanded(!expanded)}
        variant="link"
        className="text-sm text-green-600 hover:text-lime-700"
      >
        {expanded ? "Згорнути" : "Розгорнути"}
      </Button>
    </div>
  );
}
