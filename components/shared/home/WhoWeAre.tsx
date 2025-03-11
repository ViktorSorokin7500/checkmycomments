import React from "react";

interface WhoWeAreProps {
  t: {
    title: string;
    description: string;
  };
}

export function WhoWeAre({ t }: WhoWeAreProps) {
  return (
    <section className="flex justify-center py-6 mb:py-12">
      <div className="flex flex-col md:flex-row gap-6 items-center justify-center py-6 px-8 md:px-16 rounded-lg md:rounded-full w-max max-w-[90%] bg-soft-fog/20 text-bright-snow shadow-lg hover:shadow-xl transition-shadow duration-300 animate-fade-in-delay text-center md:text-left">
        <h2 className="text-2xl md:text-3xl font-semibold text-lime-zest min-w-[12rem] md:w-auto">
          {t.title}
        </h2>
        <p className="text-base md:text-lg max-w-2xl leading-relaxed">
          {t.description}
        </p>
      </div>
    </section>
  );
}
