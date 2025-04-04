"use client";
import React, { useState } from "react";
import { WithTranslationsProps } from "@/types/component-props";
import {
  KeySquare,
  Lightbulb,
  ClockAlert,
  Handshake,
  Origami,
} from "lucide-react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Card } from "../ui";
import { NavigationControls, ProgressBar } from "../dashboard";
import { MotionDiv, MotionH3, MotionSection } from "../shared";
import { containerVariants, itemVariants } from "@/lib/constants";
ChartJS.register(ArcElement, Tooltip, Legend);

export function DemoSection({ dictionary }: WithTranslationsProps) {
  const t = dictionary.home.demo;

  const [currentSection, setCurrentSection] = useState(0);

  const analysisResult = [
    { title: `${t.category} 1`, percentage: 25 },
    { title: `${t.category} 2`, percentage: 23 },
    { title: `${t.category} 3`, percentage: 18 },
    { title: `${t.category} 4`, percentage: 13 },
    { title: `${t.category} 5`, percentage: 12 },
    { title: t.other, percentage: 9 },
  ];

  const points = [
    {
      id: 1,
      icon: <KeySquare size={20} className="text-green-600 hidden sm:block" />,
      text: t.points1,
    },
    {
      id: 2,
      icon: <Handshake size={20} className="text-green-600 hidden sm:block" />,
      text: t.points2,
    },
    {
      id: 3,
      icon: <Origami size={20} className="text-green-600 hidden sm:block" />,
      text: t.points3,
    },
    {
      id: 4,
      icon: <ClockAlert size={20} className="text-green-600 hidden sm:block" />,
      text: t.points4,
    },
  ];

  const chartData = {
    labels: analysisResult?.map((r) => r.title) || [],
    datasets: [
      {
        data: analysisResult?.map((r) => r.percentage) || [],
        backgroundColor: [
          "#FFD700",
          "#FF8C00",
          "#FF69B4",
          "#98FF98",
          "#87CEEB",
          "#DDA0DD",
        ],
      },
    ],
  };

  const handleNext = () =>
    setCurrentSection((prev) => Math.min(prev + 1, sections.length - 1));

  const handlePrevious = () =>
    setCurrentSection((prev) => Math.max(prev - 1, 0));

  const handleSectionSelect = (index: number) =>
    setCurrentSection(Math.min(Math.max(index, 0), sections.length - 1));

  const sections = [
    <div key="overview" className="space-y-1 sm:space-y-4 cursor-default">
      <h3 className="text-2xl sm:text-4xl">{t.overtitle}</h3>
      <p className="sm:text-lg bg-gray-50 text-gray-700 mx-2 sm:mx-12 px-4 sm:px-6 py-2 sm:py-4 border border-green-400 rounded-lg transition-all duration-300 hover:bg-gray-100 hover:shadow-lg hover:border-green-100">
        {t.overdesc}
      </p>
    </div>,
    <div key="chart" className="flex justify-center items-center h-full">
      <div className="relative h-[280px] w-[280px] sm:w-[500px] flex flex-col gap-1 scale-90 sm:scale-100">
        <h3 className="text-xl">{t.chartitle} [1/2]</h3>

        <Pie
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: true,
                position: "bottom",
                labels: {
                  boxWidth: 12,
                  padding: 4,
                  font: {
                    size: 12,
                    family: "'Inter', sans-serif",
                  },
                  color: "#333",
                },
              },
              tooltip: {
                enabled: true,
              },
            },
          }}
        />
      </div>
    </div>,
    <div key="description" className="flex flex-col items-center md:gap-8">
      <h3 className="m-4 text-xl">{t.chartitle} [2/2]</h3>
      <div className="flex flex-col gap-2 justify-around items-start text-left px-4 ">
        <h4 className="text-xl sm:text-2xl font-semibold text-green-700">
          {t.desctitle}
        </h4>
        <p className="sm:hidden leading-5">{t.shortdesc}</p>
        <p className="hidden sm:block text-gray-700">{t.longdesc}</p>
        <span className="text-sm sm:text-lg text-lime-600">{t.percentage}</span>
      </div>
    </div>,
    <div key="points" className="flex flex-col sm:gap-4">
      <h3>{t.pointitle}</h3>
      <ul className="space-y-2">
        {points.map((point) => (
          <li
            key={point.id}
            className="flex items-center gap-2 sm:text-lg bg-gray-50 text-gray-700 mx-2 sm:mx-12 px-4 sm:px-6 py-2 sm:py-4 border border-green-400 rounded-lg transition-all duration-300 hover:bg-gray-100 hover:shadow-lg hover:border-green-100"
          >
            {point.icon} <span className="leading-5">{point.text}</span>
          </li>
        ))}
      </ul>
    </div>,
  ];
  return (
    <MotionSection
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="relative"
    >
      <MotionDiv
        variants={itemVariants}
        className="py-12 lg:py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 transform-gpu overflow-hidden blur-3xl"
        >
          <div
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-linear-to-br from-emerald-500 via-teal-500 to-cyan-500 opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                "polugon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
          />
        </div>
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="inline-flex items-center justify-center p-2 rounded-2xl bg-gray-100/80 backdrop-blur-xs border border-gray-300 mb-4 shadow hover:shadow-none hover:bg-gray-100/90">
            <Lightbulb className="size-6 text-green-500" />
          </div>
          <div className="mb-4 sm:mb-8">
            <MotionH3
              variants={itemVariants}
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="font-bold text-3xl max-w-2xl mx-auto px-4 sm:px-6"
            >
              {t.title1}
              <span className="text-green-600 text-transform">{t.title2}</span>
              {t.title3}
            </MotionH3>
          </div>

          <MotionDiv
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            variants={itemVariants}
            className="relative p-4 sm:p-6 lg:p-8 bg-gray-100 backdrop-blur-md rounded-2xl sm:rounded-3xl shadow-xl border border-green-100 transition-all duration-300 hover:shadow-2xl hover:bg-gray-100/80 max-w-4xl mx-auto w-full"
          >
            <div className="relative mt-4">
              <Card.Card className="relative px-2 h-[500px] w-full overflow-hidden bg-linear-to-br from-lime-50 to-green-50 backdrop-blur-lg shadow-2xl rounded-3xl border border-green-500/10">
                <ProgressBar
                  section={sections}
                  currentSection={currentSection}
                />
                <div className="h-full flex items-center justify-center overflow-y-auto scroll-hide">
                  {sections[currentSection]}
                </div>
                <NavigationControls
                  currentSection={currentSection}
                  totalSections={sections.length}
                  onPrevious={handlePrevious}
                  onNext={handleNext}
                  onSectionSelect={handleSectionSelect}
                />
              </Card.Card>
            </div>
          </MotionDiv>
        </div>
      </MotionDiv>
    </MotionSection>
  );
}
