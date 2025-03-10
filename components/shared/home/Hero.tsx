import { Button } from "@/components/ui";
import Image from "next/image";
import React from "react";
import HeroImg from "../../../public/assets/hero.png";

interface HeroProps {
  t: {
    title: string;
    subtitle: string;
    cta: string;
    beta: string;
  };
}

export function Hero({ t }: HeroProps) {
  return (
    <section className="flex flex-col md:flex-row items-center justify-around px-6 pb-12 text-bright-snow relative overflow-hidden">
      {/* Текстовий блок */}
      <div className="z-10 max-w-lg text-center md:text-left mb-8 md:mb-0">
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight animate-fade-in">
          {t.title}
        </h2>
        <h1 className="text-4xl md:text-6xl font-bold mt-2 animate-fade-in-delay text-lime-zest">
          CommentPulse
        </h1>
        <p className="text-lg md:text-xl mt-4 leading-relaxed animate-fade-in-delay">
          {t.subtitle}
        </p>
      </div>

      <div className="z-10 flex flex-col items-center">
        <div className="relative w-[300px] md:w-[400px] max-w-[450px]">
          <Image
            src={HeroImg}
            alt="hero"
            width={400}
            height={400}
            className="object-contain animate-fade-in"
          />
        </div>
        <p className="text-sm mt-4 opacity-75 animate-fade-in-delay">
          {t.beta}
        </p>
        <Button className="mt-6 px-8 py-3 bg-lime-zest text-forest-night font-semibold rounded-full hover:bg-sunset-glow hover:text-bright-snow transition-all duration-300 animate-glow animate-fade-in-delay">
          {t.cta}
        </Button>
      </div>
    </section>
  );
}
