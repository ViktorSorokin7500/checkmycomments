"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { WithTranslationsProps } from "@/types/component-props";
import { cn } from "@/lib/utils";

export function TokenCounter({ dictionary }: WithTranslationsProps) {
  const { isLoaded: isUserLoaded, user } = useUser();
  const userId = user?.id;
  const [tokens, setTokens] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isUserLoaded) return; // Ждем загрузки пользователя

    if (!userId) {
      setIsLoading(false);
      return;
    }

    const fetchTokens = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/get-tokens", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        });
        const data = await res.json();
        if (data.tokens !== undefined) {
          setTokens(data.tokens);
        }
      } catch (error) {
        console.error("Failed to fetch tokens:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTokens();
  }, [isUserLoaded, userId]);

  useEffect(() => {
    const handleTokenUpdate = (e: CustomEvent) => {
      setTokens(e.detail);
    };

    window.addEventListener("updateTokens", handleTokenUpdate as EventListener);
    return () => {
      window.removeEventListener(
        "updateTokens",
        handleTokenUpdate as EventListener
      );
    };
  }, []);

  // Всегда показываем загрузку, пока данные не загружены
  if (!isUserLoaded || isLoading) {
    return <div className="animate-pulse bg-green-200 h-7 w-40 rounded-full" />;
  }

  // Не показываем, если нет userId или tokens
  if (!userId || tokens === null) return null;

  return (
    <span
      className={cn(
        "px-2 py-0.5 rounded-full text-white transition-colors duration-300 cursor-default",
        tokens > 0 ? "bg-green-600" : "bg-red-600"
      )}
    >
      {dictionary.header.tokens}: {tokens}
    </span>
  );
}
