import React from "react";
import Image from "next/image";
import Facebook from "../../../public/assets/icons/facebook.svg";
import Instagram from "../../../public/assets/icons/instagram.svg";
import Telegram from "../../../public/assets/icons/telegram.svg";
import Tiktok from "../../../public/assets/icons/tiktok.svg";
import Xcom from "../../../public/assets/icons/x.jpg";
import Youtube from "../../../public/assets/icons/youtube.jpg";
import Bracket from "../../../public/assets/icons/bracket.png";

interface ResearchingProps {
  t: {
    description: string;
  };
}

export function Researching({ t }: ResearchingProps) {
  const logos = [
    { src: Facebook, alt: "Facebook" },
    { src: Instagram, alt: "Instagram" },
    { src: Telegram, alt: "Telegram" },
    { src: Tiktok, alt: "TikTok" },
    { src: Xcom, alt: "X" },
    { src: Youtube, alt: "YouTube" },
  ];
  return (
    <section className="py-6 mb:py-12">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex flex-wrap justify-center gap-8 md:gap-12 mb-12">
          {logos.map((logo) => (
            <div
              key={logo.alt}
              className="flex items-center justify-center hover:scale-105 transition-all duration-300"
            >
              <Image
                src={logo.src}
                alt={logo.alt}
                title={logo.alt}
                width={80}
                height={80}
                className="object-contain animate-fade-in-delay"
              />
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center">
          {/* Скобка */}
          <div className="w-full max-w-5xl mb-4">
            <Image
              src={Bracket}
              alt="Bracket"
              width={1280}
              height={40}
              className="w-full h-10 object-fill animate-fade-in-delay"
            />
          </div>

          <div className="text-center max-w-sm p-4 bg-soft-fog/20 shadow-lg rounded-lg">
            <p className="text-base md:text-lg text-bright-snow font-semibold leading-relaxed animate-fade-in-delay">
              {t.description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
