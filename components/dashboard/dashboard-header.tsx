import React from "react";
import { NoticeBlock } from "./notice-block";
import { WithTranslationsProps } from "@/types/component-props";
import { Badge, Button } from "../ui";
import Link from "next/link";
import { Calendar, ChevronLeft, Sparkles } from "lucide-react";
import { ModalWrapper } from "./modal-wrapper";

interface DashboardHeader extends WithTranslationsProps {
  title: string;
  className: string;
}

export function DashboardHeader({
  dictionary,
  title,
  className,
}: DashboardHeader) {
  const isHidden = false;
  const t = dictionary.dashboard.header;
  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-4 mb-4 justify-between">
        <div className="flex items-center flex-row gap-6">
          <div className="relative p-[1px] overflow-hidden rounded-full bg-linear-to-r from-green-200 via-green-500 to-green-800 animate-gradient-x cursor-default group">
            <Badge
              variant={"secondary"}
              className="relative px-4 py-0.5 text-base font-medium bg-white rounded-full group-hover:bg-gradient-to-r group-hover:from-green-50 group-hover:to-green-200 transition-colors duration-200 animate-pulse-slow"
            >
              <Sparkles className="size-4 mr-2 text-green-600 animate-pulse" />
              <p className="text-base text-green-600">Powered by AI</p>
            </Badge>
          </div>
          {isHidden && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="size-4 text-green-400" />
              {new Date().toLocaleDateString()}
            </div>
          )}
        </div>
        <div className="">
          <Button
            variant={"link"}
            size={"sm"}
            className="group bg-green-50 hover:bg-green-100/80 backdrop-blur-xs rounded-full transition-all duration-200 shadow-xs hover:shadow-md border border-green-100/30 text-green-900"
          >
            <Link
              href="/dashboard"
              className="flex items-center gap-1 sm:gap-2"
            >
              <ChevronLeft className="size-3 sm:size-4 text-green-900 transition-transform group-hover:translate-x-0.5" />
              <span className="text-xs sm:text-sm font-medium">
                {t.back}{" "}
                <span className="hidden sm:inline">{t.toDashboard}</span>
              </span>
            </Link>
          </Button>
        </div>
      </div>
      <h1 className="text-2xl lg:text-4xl font-bold lg:tracking-tight">
        <span className={`${className}`}>{title}</span>
      </h1>
      <NoticeBlock dictionary={dictionary} />
      <ModalWrapper dictionary={dictionary} />
    </div>
  );
}
