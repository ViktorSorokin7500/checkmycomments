import { WithTranslationsProps } from "@/types/component-props";
import React from "react";
import { Badge, Button } from "../ui";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { Locale } from "@/i18n.config";

interface HeroSectionProps extends WithTranslationsProps {
  lang: Locale;
}

export function HeroSection({ dictionary, lang }: HeroSectionProps) {
  const t = dictionary.home.hero;
  return (
    <section className="relative mx-auto flex flex-col z-0 items-center justify-center py-12 sm:py-20 lg:pb-28 transition-all animate-in px-4 lg:px-12 max-w-7xl">
      <div className="relative p-[1px] overflow-hidden rounded-full bg-linear-to-r from-green-200 via-green-500 to-green-800 animate-gradient-x cursor-default group">
        <Badge
          variant={"secondary"}
          className="relative px-6 py-2 text-base font-medium bg-white rounded-full group-hover:bg-gradient-to-r group-hover:from-green-50 group-hover:to-green-200 transition-colors duration-200 animate-pulse-slow"
        >
          <Sparkles className="size-6 mr-2 text-green-600 animate-pulse" />
          <p className="text-base text-green-600">{t.powered}</p>
        </Badge>
      </div>
      <h1 className="font-bold py-6 text-center">{t.title}</h1>
      <h2 className="text-lg sm:text-xl lg:text-2xl text-center px-4 lg:px-0 lg:max-w-4xl text-gray-600">
        {t.subtitle}
      </h2>
      <Button
        variant={"link"}
        className="text-white mt-6 text-base sm:text-lg lf:text-xl rounded-full px-8 sm:px-10 lg:px-12 py-6 sm:py-7 lg:py-8 lg:mt-16 bg-gradient-to-r from-green-900 to-lime-500 hover:from-lime-500 hover:to-green-900 hover:no-underline font-bold shadow-lg shadow-slate-900/50 transition duration-500 hover:shadow-lg hover:shadow-green-500/50"
      >
        <Link href={`/${lang}#pricing`} className="flex gap-2 items-center">
          <span>{t.button}</span>
          <ArrowRight className="animate-pulse" />
        </Link>
      </Button>
    </section>
  );
}
