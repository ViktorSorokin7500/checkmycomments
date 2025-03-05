"use client";

import { Button } from "@/components/ui";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

export function Header() {
  return (
    <header className="flex justify-between items-center p-4 bg-forest-night">
      <div />
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
