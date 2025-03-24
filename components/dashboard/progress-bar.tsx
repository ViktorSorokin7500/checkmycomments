import { cn } from "@/lib/utils";
import React from "react";

export function ProgressBar({
  section,
  currentSection,
}: {
  section: unknown[];
  currentSection: number;
}) {
  return (
    <div className="absolute top-0 left-0 right-0 z-20 bg-linear-to-br from-lime-50 to-green-50 backdrop-blur-xs pt-4 pb-2 border-b border-green-500/10">
      <div className="px-4 flex gap-1.5">
        {section.map((_, index) => (
          <div
            key={index}
            className="h-1.5 flex-1 rounded-full bg-green-500/10 overflow-hidden"
          >
            <div
              className={cn(
                "h-full bg-linear-to-r from-lime-500 to-green-500 transition-all duration-500",
                index === currentSection
                  ? "w-full"
                  : currentSection > index
                  ? "w-full opacity-10"
                  : "w-0"
              )}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
