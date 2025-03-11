"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Locale } from "@/i18n.config";

interface PricingProps {
  t: {
    title: string;
    priceLabel: string;
    solPrice: string;
    usdEquivalent: string;
    uahEquivalent: string;
    note: string;
  };
  lang: Locale;
}

export function Pricing({ t, lang }: PricingProps) {
  const [solPrice, setSolPrice] = useState<number | null>(null);
  const [uahAmount, setUahAmount] = useState<number | null>(null);

  const fetchPrices = useCallback(async () => {
    try {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=solana,usd&vs_currencies=usd,uah"
      );
      const data = await response.json();

      const solUsd = data.solana.usd;
      const solUah = data.solana.uah;
      const usdUah = data.usd.uah;

      const usdSolAmount = 5 / solUsd;
      const uahValue = 5 * usdUah;
      const uahSolAmount = uahValue / solUah;

      setSolPrice(
        parseFloat((lang === "uk" ? uahSolAmount : usdSolAmount).toFixed(4))
      );
      setUahAmount(parseFloat(uahValue.toFixed(2)));
    } catch (error) {
      console.error("Помилка отримання цін:", error);
      setSolPrice(lang === "uk" ? 0.037 : 0.036);
      setUahAmount(210);
    }
  }, [lang]);

  useEffect(() => {
    fetchPrices();
    const interval = setInterval(() => {
      fetchPrices();
      console.log("Оновлення цін:", new Date().toLocaleTimeString());
    }, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchPrices, lang]);

  return (
    <section className="py-6 mb:py-12 flex justify-center">
      <div className="max-w-lg w-full py-6 px-8 rounded-lg animate-fade-in-delay text-center">
        <h2 className="text-3xl font-semibold text-bright-snow mb-4">
          {t.title}
        </h2>
        <div className="flex justify-center items-center gap-2 mb-2">
          <span className="text-xl text-soft-fog">{t.priceLabel}</span>
          <span className="text-4xl text-lime-zest font-bold">
            {solPrice !== null ? solPrice : "Завантаження..."} SOL
          </span>
        </div>
        <p className="text-sm text-soft-fog">
          {lang === "uk" && uahAmount !== null
            ? t.uahEquivalent.replace("{uahAmount}", uahAmount.toString())
            : t.usdEquivalent}
        </p>
        <p className="text-sm text-cosmic-blue mt-4 italic">{t.note}</p>
      </div>
    </section>
  );
}
