"use client";

import { Button } from "@/components/ui";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import LangSwitcher from "./LangSwitcher";
import { Locale } from "@/i18n.config";
import { usePathname } from "next/navigation";

export function Header() {
  const pathname = usePathname();
  const lang = pathname.split("/")[1] as Locale;

  return (
    <header className="flex justify-between items-center p-4 bg-forest-night">
      <LangSwitcher lang={lang} />
      <div className="flex items-center">
        <SignedIn>
          <UserButton
            appearance={{
              elements: {
                userButtonAvatarBox:
                  "w-9 h-9 rounded-full border-2 border-cosmic-blue",
              },
            }}
          />
        </SignedIn>
        <SignedOut>
          <SignInButton mode="modal">
            <Button className="bg-lime-zest text-forest-night hover:bg-lime-zest/80">
              Sign In
            </Button>
          </SignInButton>
        </SignedOut>
      </div>
    </header>
  );
}
