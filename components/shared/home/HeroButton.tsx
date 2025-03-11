"use client";

import React from "react";
import { SignInButton, SignedOut } from "@clerk/nextjs";
import { Button } from "@/components/ui/button"; // Припускаю, що у тебе shadcn/ui

interface HeroProps {
  t: {
    cta: string;
    // інші пропси
  };
}

export function Hero({ t }: HeroProps) {
  return (
    <section className="py-12 text-center">
      {/* Твій Hero контент */}
      <SignedOut>
        <SignInButton mode="modal">
          <Button className="mt-6 px-8 py-3 bg-lime-zest text-forest-night font-semibold rounded-full hover:bg-sunset-glow hover:text-bright-snow transition-all duration-300 animate-glow animate-fade-in-delay">
            {t.cta} {/* "Get Started" чи "Розпочати" */}
          </Button>
        </SignInButton>
      </SignedOut>
      {/* Для SignedIn можна додати редирект у middleware */}
    </section>
  );
}
