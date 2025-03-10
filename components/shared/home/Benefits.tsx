import React from "react";

interface BenefitsProps {
  t: {
    title: string;
    subtitle: string;
    description1: string;
    description2: string;
    description3: string;
  };
}

export function Benefits({ t }: BenefitsProps) {
  return (
    <section className="py-12 flex justify-center">
      <div className="flex flex-col md:flex-row max-w-4xl lg:max-w-5xl gap-6 lg:gap-12">
        <div className="flex-1 text-center md:text-left">
          <span className="text-lime-zest text-sm md:text-base uppercase tracking-wider animate-fade-in">
            {t.subtitle}
          </span>
          <h2 className="text-4xl md:text-5xl font-semibold mt-2 animate-fade-in-delay max-w-xl">
            {t.title}
          </h2>
        </div>

        <ul className="flex-1 flex flex-col gap-4 md:gap-6 text-base md:text-lg">
          <li className="flex items-start gap-3 animate-fade-in-delay">
            <p>{t.description1}</p>
          </li>
          <li className="flex items-start gap-3 animate-fade-in-delay">
            <p>{t.description2}</p>
          </li>
          <li className="flex items-start gap-3 animate-fade-in-delay">
            <p>{t.description3}</p>
          </li>
        </ul>
      </div>
    </section>
  );
}
