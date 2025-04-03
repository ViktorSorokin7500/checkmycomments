import { WithTranslationsProps } from "@/types/component-props";
import {
  BrainCircuit,
  FileOutput,
  MessageSquareText,
  MoveRight,
} from "lucide-react";
import React, { ReactNode } from "react";
import { MotionDiv, MotionH2, MotionH3, MotionSection } from "../shared";
import { containerVariants, itemVariants } from "@/lib/constants";

type StepProps = {
  icon: ReactNode;
  label: string;
  description: string;
};

export function HowItWorksSection({ dictionary }: WithTranslationsProps) {
  const t = dictionary.home.hiws;
  const steps: StepProps[] = [
    {
      icon: <MessageSquareText size={64} strokeWidth={1.5} />,
      label: t.title1,
      description: t.description1,
    },
    {
      icon: <BrainCircuit size={64} strokeWidth={1.5} />,
      label: t.title2,
      description: t.description2,
    },
    {
      icon: <FileOutput size={64} strokeWidth={1.5} />,
      label: t.title3,
      description: t.description3,
    },
  ];
  return (
    <MotionSection
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="relative overflow-hidden bg-gray-200"
    >
      <div className="py-6 sm:py-12 lg:py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 lg:pt-12">
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

        <div className="text-center mb:4 sm:mb-8">
          <MotionH2
            variants={itemVariants}
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="font-bold text-xl uppercase mb-3 text-green-600"
          >
            {t.subtitle}
          </MotionH2>
          <MotionH3
            variants={itemVariants}
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="font-bold text-3xl max-w-2xl mx-auto"
          >
            {t.maintitle}
          </MotionH3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto relative">
          {steps.map((step, index) => (
            <MotionDiv
              variants={itemVariants}
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: (index + 1) * 0.1 }}
              key={index}
              className="relative flex items-stretch"
            >
              <StepItem {...step} />
              {index < steps.length - 1 && (
                <div className="absolute hidden lg:block top-1/2 -right-4 transform -translate-y-1/2 z-10">
                  <MoveRight
                    size={32}
                    strokeWidth={1}
                    className="text-green-400"
                  />
                </div>
              )}
            </MotionDiv>
          ))}
        </div>
      </div>
    </MotionSection>
  );
}

function StepItem({ icon, label, description }: StepProps) {
  return (
    <div className="relative p-6 rounded-2xl bg-white/5 backdrop-blur-xs border-4 border-white/10 hover:border-green-500/10 transition-colors group w-full">
      <div className="flex flex-col gap-4 h-full">
        <div className="flex items-center justify-center size-24 mx-auto rounded-2xl bg-linear-to-br from-green-500/10 to-transparent group-hover:from-green-500/20 transition-colors group-hover:shadow">
          <div className="text-green-500">{icon}</div>
        </div>
        <div className="flex flex-col flex-1 gap-1 justify-between">
          <h4 className="text-center font-bold text-xl">{label}</h4>
          <p className="text-center text-gray-600 text-sm">{description}</p>
        </div>
      </div>
    </div>
  );
}
