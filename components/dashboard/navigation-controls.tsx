import { cn } from "@/lib/utils";
import { Button } from "../ui";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface NavigationControlsProps {
  currentSection: number;
  totalSections: number;
  onPrevious: () => void;
  onNext: () => void;
  onSectionSelect: (index: number) => void;
}

export function NavigationControls({
  currentSection,
  totalSections,
  onPrevious,
  onNext,
  onSectionSelect,
}: NavigationControlsProps) {
  const maxPerRow =
    totalSections <= 8 ? totalSections : Math.ceil(totalSections / 2);
  const firstRowCount = Math.min(maxPerRow, totalSections);
  const secondRowCount = totalSections - firstRowCount;
  return (
    <div className="absloute bottom-0 left-0 rigth-0 p-4 pb-0 bg-linear-to-br from-lime-50 to-green-50 backdrop-blur-xs border-t border-green-500/10">
      <div className="flex justify-between items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={onPrevious}
          disabled={currentSection === 0}
          className={cn(
            "rounded-full size-12 transition-all duration-200 bg-linear-to-br from-green-500 to-lime-600 backdrop-blur-xs border border-green-500/10",
            currentSection === 0 ? "opacity-50" : "hover:bg-lime-500/20"
          )}
        >
          <ChevronLeft className="size-6 text-white hover:text-lime-200" />
        </Button>

        <div className="flex flex-wrap gap-2 justify-center max-w-[100px] sm:max-w-full">
          {Array.from({ length: totalSections }).map((_, index) => (
            <button
              key={index}
              onClick={() => onSectionSelect(index)}
              className={cn(
                "size-2 rounded-full transition-all duration-300",
                currentSection === index
                  ? "bg-linear-to-r from-lime-500 to-lime-600"
                  : "bg-green-500/20 hover:bg-green-500/30",
                index === firstRowCount && secondRowCount > 0 ? "" : ""
              )}
            />
          ))}
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={onNext}
          disabled={currentSection === totalSections - 1}
          className={cn(
            "rounded-full size-12 transition-all duration-200 bg-linear-to-br from-green-500 to-lime-600 backdrop-blur-xs border border-green-500/10",
            currentSection === totalSections - 1
              ? "opacity-50"
              : "hover:bg-lime-500/20"
          )}
        >
          <ChevronRight className="size-6 text-white hover:text-lime-200" />
        </Button>
      </div>
    </div>
  );
}
