import { Locale } from "@/i18n.config";
import { cn } from "@/lib/utils";
import { WithTranslationsProps } from "@/types/component-props";
import { ArrowRight, CheckIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

interface PricingSectionProps extends WithTranslationsProps {
  lang: Locale;
}

export function PricingSection({ dictionary, lang }: PricingSectionProps) {
  const t = dictionary.home.pricing;
  const plans = [
    {
      id: "free",
      name: t.free.name,
      price: 0,
      description: t.free.description,
      items: [t.free.item1, t.free.item2],
      paymentLink: `${lang}/sign-in`,
      priceId: "",
      cta: t.free.cta,
      month: t.month,
      freeMonth: t.freeMonth,
    },
    {
      id: "paid",
      name: t.paid.name,
      price: 3,
      description: t.paid.description,
      items: [t.paid.item1, t.paid.item2, t.paid.item3],
      paymentLink: "",
      priceId: "",
      cta: t.paid.cta,
      month: t.month,
    },
  ];
  return (
    <section className="relative overflow-hidden" id="pricing">
      <div className="py-12 lg:py-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 lg:pt-12">
        <div className="flex items-center justify-center w-full pb-12">
          <h2 className="uppercase font-bold text-xl text-green-600">
            {t.title}
          </h2>
        </div>
        <div className="relative flex justify-center flex-col lg:flex-row items-center lg:items-stretch gap-8">
          {plans.map((plan) => (
            <PricingCard key={plan.id} {...plan} />
          ))}
        </div>
      </div>
    </section>
  );
}

const PricingCard = ({
  name,
  price,
  description,
  items,
  id,
  paymentLink,
  cta,
  month,
  freeMonth,
}: {
  name: string;
  price: number;
  description: string;
  items: string[];
  id: string;
  paymentLink: string;
  cta: string;
  month: string;
  freeMonth?: string;
}) => {
  return (
    <div className="relative w-full max-w-lg hover:scale-105 hover:transition-all duration-200">
      <div
        className={cn(
          "relative flex flex-col h-full gap-4 lg:gap-8 z-10 p-8 border-[1px] border-gray-500/20 rounded-2xl shadow-lg transition-transform duration-500",
          id === "paid" && "border-green-500 gap-5 border-2"
        )}
      >
        <div className="flex justify-between items-center gap-4">
          <div>
            <h5 className="text-lg lg:text-xl font-bold">{name}</h5>
            <p className="text-base-content/80 mt-2">{description}</p>
          </div>
        </div>

        {id === "free" ? (
          <p className="text-5xl tracking-tight uppercase font-semibold">
            {freeMonth}
          </p>
        ) : (
          <div className="flex gap-2">
            <p className="text-5xl tracking-tight font-extrabold">${price}</p>
            <div>
              <p className="text-xs uppercase font-semibold">USD</p>
              <p className="text-xs">/{month}</p>
            </div>
          </div>
        )}

        <div className="space-y-2.5 leading-relaxed text-base flex-1">
          {items.map((item, i) => (
            <li key={i} className="flex items-center gap-2">
              <CheckIcon size={18} />
              <span>{item}</span>
            </li>
          ))}
        </div>

        <div className="space-y-2 flex justify-center w-full">
          <Link
            href={paymentLink}
            className={cn(
              "w-full rounded-full flex items-center justify-center gap-2 bg-linear-to-r text-white border-2 py-2 transition-colors duration-500",
              id === "paid"
                ? "border-lime-600 hover:border-green-600 from-green-900 to-lime-500 hover:from-lime-500 hover:to-green-900 grayscale pointer-events-none"
                : "border-green-100 from-lime-400 to-green-500 hover:from-green-500 hover:to-lime-400"
            )}
          >
            {cta} <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
};
