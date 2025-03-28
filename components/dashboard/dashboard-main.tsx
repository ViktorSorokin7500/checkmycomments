import React from "react";
import { Sparkles } from "lucide-react";
import {
  FaYoutube,
  FaTelegram,
  FaFacebook,
  FaSquareInstagram,
  FaTiktok,
  FaSquareXTwitter,
} from "react-icons/fa6";
import { Badge, Button } from "@/components/ui";
import { ReactNode } from "react";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Locale } from "@/i18n.config";
import { WithTranslationsProps } from "@/types/component-props";

type MediaProps = {
  id: string;
  icon: ReactNode;
  label: string;
  description?: string;
  cta?: string;
  lang?: Locale;
  disabled?: boolean;
};

interface DashboardMainProps extends WithTranslationsProps {
  lang: Locale;
}

export function DashboardMain({ dictionary, lang }: DashboardMainProps) {
  const t = dictionary.dashboard.main;

  const medias: MediaProps[] = [
    {
      id: "youtube",
      icon: <FaYoutube size={52} fill="#FF0000" />,
      label: "Youtube",
      description: t.available,
    },
    {
      id: "telegram",
      icon: <FaTelegram size={52} fill="#229ED9" />,
      label: "Telegram",
      description: t.available,
    },
    {
      id: "facebook",
      icon: <FaFacebook size={52} fill="#1877F2" />,
      label: "Facebook",
      description: t.unavailable,
      disabled: true,
    },
    {
      id: "instagram",
      icon: <FaSquareInstagram size={52} fill="#E4405F" />,
      label: "Instagram",
      description: t.unavailable,
      disabled: true,
    },
    {
      id: "tiktok",
      icon: <FaTiktok size={52} fill="#69C9D0" />,
      label: "Tiktok",
      description: t.unavailable,
      disabled: true,
    },
    {
      id: "twitter",
      icon: <FaSquareXTwitter size={52} fill="#000000" />,
      label: "X/Twitter",
      description: t.unavailable,
      disabled: true,
    },
  ];

  return (
    <>
      <div className="flex flex-col items-center justify-center gap-6 text-center">
        <div className="relative p-[1px] overflow-hidden rounded-full bg-linear-to-r from-green-200 via-green-500 to-green-800 animate-gradient-x cursor-default group">
          <Badge
            variant={"secondary"}
            className="relative px-4 py-0.5 text-base font-medium bg-white rounded-full group-hover:bg-gradient-to-r group-hover:from-green-50 group-hover:to-green-200 transition-colors duration-200 animate-pulse-slow"
          >
            <Sparkles className="size-4 mr-2 text-green-600 animate-pulse" />
            <p className="text-base text-green-600">Powered by AI</p>
          </Badge>
        </div>
        <div>
          <h1 className="font-bold py-6 text-center">{t.title}</h1>
          <p className="text-lg leading-8 text-gray-600 max-w-2xl text-center mx-auto">
            {t.description}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative">
        {medias.map((media, index) => (
          <div key={index} className="relative flex items-stretch">
            <SocailMedia lang={lang} cta={t.cta} {...media} />
          </div>
        ))}
      </div>
    </>
  );
}

function SocailMedia({
  id,
  icon,
  label,
  description,
  cta,
  disabled,
  lang,
}: MediaProps) {
  return (
    <div
      className={cn(
        "relative p-6 rounded-2xl bg-white/5 backdrop-blur-xs border-4 border-white/10 transition-colors group w-full space-y-1",
        disabled
          ? "hover:border-gray-100 grayscale"
          : "hover:border-green-500/10"
      )}
    >
      <div className="flex flex-col gap-4 h-full">
        <div className="flex items-center justify-center size-24 mx-auto rounded-2xl bg-linear-to-br from-green-500/10 to-transparent group-hover:from-green-500/20 transition-colors group-hover:shadow">
          <div>{icon}</div>
        </div>
        <div className="flex flex-col flex-1 gap-2">
          <h4 className="text-center font-bold text-xl">{label}</h4>
          <p className="text-center text-gray-600 text-sm">{description}</p>
        </div>
        <div className="w-fit mx-auto">
          <Button
            asChild
            className={cn(
              "bg-green-500 hover:bg-lime-500",
              disabled && "pointer-events-none"
            )}
          >
            <Link href={`/${lang}/dashboard/${id}`}>{cta}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
