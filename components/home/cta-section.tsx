import { WithTranslationsProps } from "@/types/component-props";
import React from "react";
import { Button } from "../ui";
import Link from "next/link";
import { Locale } from "@/i18n.config";
import { ArrowRight } from "lucide-react";
import { MotionDiv, MotionH2, MotionP } from "../shared";
import { containerVariants, itemVariants } from "@/lib/constants";

interface CTASectionProps extends WithTranslationsProps {
  lang: Locale;
}

export function CTAsection({ dictionary, lang }: CTASectionProps) {
  const t = dictionary.home.cta;
  return (
    <section className="relative overflow-hidden bg-gray-200">
      <MotionDiv
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="py-6 sm:py-12 lg:py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 lg:pt-12"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 transform-gpu overflow-hidden blur-3xl"
        >
          <div
            className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-linear-to-br from-emerald-500 via-teal-500 to-cyan-500 opacity-10 sm:left-[calc(50%-26rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
          />
        </div>
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <MotionH2
              variants={itemVariants}
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl"
            >
              {t.title}
            </MotionH2>
            <MotionP
              variants={itemVariants}
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="mx-auto max-w-xl text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed"
            >
              {t.description}
            </MotionP>
          </div>
          <div className="flex flex-col gap-2 min-[400px]:flex-row justify-center">
            <MotionDiv
              variants={itemVariants}
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Button
                size="lg"
                variant={"link"}
                className="w-full min-[400px]:w-auto text-white bg-gradient-to-r from-green-900 to-lime-700 hover:from-lime-700 hover:to-green-900 hover:no-underline font-bold shadow-lg shadow-slate-900/50 hover:shadow-lg hover:shadow-green-500/50 transition-colors duration-300"
              >
                <Link
                  href={`/${lang}/#pricing`}
                  className="flex items-center justify-center"
                >
                  {t.cta} <ArrowRight className="ml-2 size-4 animate-pulse" />
                </Link>
              </Button>
            </MotionDiv>
          </div>
        </div>
      </MotionDiv>
    </section>
  );
}
