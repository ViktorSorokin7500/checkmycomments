"use client";
import { Locale } from "@/i18n.config";
import Link from "next/link";
import { usePathname } from "next/navigation";

const LangSwitcher = ({ lang }: { lang: Locale }) => {
  const targetLanguage = lang === "en" ? "uk" : "en";
  const pathname = usePathname();
  const redirectTarget = () => {
    if (!pathname) return "/";
    const segment = pathname.split("/");
    segment[1] = targetLanguage;
    return segment.join("/");
  };
  return (
    <Link locale={targetLanguage} href={redirectTarget()}>
      {targetLanguage === "uk" && <span>UA</span>}
      {targetLanguage === "en" && <span>EN</span>}
    </Link>
  );
};

export default LangSwitcher;
