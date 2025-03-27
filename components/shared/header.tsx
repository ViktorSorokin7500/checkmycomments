import { Locale } from "@/i18n.config";
import { MessageCircleMore } from "lucide-react";
import { NavLink } from "./nav-link";
import LangSwitcher from "./lang-switcher";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { TokenCounter } from "./token-counter";
import { UserButtonWrapper } from "./user-button-wrapper";

async function getDictionary(lang: Locale) {
  const dictionary = await import(`@/dictionaries/${lang}.json`);
  return dictionary.default;
}

export async function Header({ lang }: { lang: Locale }) {
  const dictionary = await getDictionary(lang);
  const t = dictionary.header;

  return (
    <header>
      <nav className="container flex items-center justify-between py-4 px-2 lg:px-8 mx-auto">
        <div className="flex lg:flex-1 group">
          <NavLink
            href={`/${lang}`}
            className="flex items-center gap-1 lg:gap-2 shrink-0"
          >
            <MessageCircleMore className="size-5 lg:size-8 text-gray-900 group-hover:rotate-12 transform transition duration-200 ease-in-out" />
            <span className="hidden sm:block font-extrabold lg:text-xl text-gray-900">
              Comment Pulse
            </span>
            <span className="sm:hidden font-extrabold lg:text-xl text-gray-900">
              CP
            </span>
          </NavLink>
        </div>

        <div className="flex lg:justify-center gap-4 lg:gap-12 lg:items-center">
          <SignedOut>
            <NavLink href={`/${lang}#pricing`}>{t.pricing}</NavLink>
          </SignedOut>
          <SignedIn>
            <TokenCounter dictionary={dictionary} />
          </SignedIn>
        </div>

        <div className="flex lg:justify-end lg:flex-1">
          <SignedIn>
            <div className="flex gap-4 items-center">
              <LangSwitcher lang={lang} title={t.language} />
              <UserButtonWrapper />
            </div>
          </SignedIn>
          <SignedOut>
            <div className="flex items-center gap-1">
              <LangSwitcher lang={lang} title={t.language} />
              <NavLink href={`/${lang}/sign-in`}>{t.signIn}</NavLink>
            </div>
          </SignedOut>
        </div>
      </nav>
    </header>
  );
}
