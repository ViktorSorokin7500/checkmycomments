"use client";
import { WithTranslationsProps } from "@/types/component-props";
import React, { useState, useEffect } from "react";
import { Card, Button } from "../ui";
import { NavigationControls } from "./navigation-controls";
import { ProgressBar } from "./progress-bar";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import { useAnalysisStore } from "@/lib/store";
import toast from "react-hot-toast";
import { Locale } from "@/i18n.config";
import { OctagonMinus, Save, Tags } from "lucide-react";

ChartJS.register(ArcElement, Tooltip, Legend);

interface DashboardViewerProps extends WithTranslationsProps {
  lang: Locale;
}

export function DashboardViewer({ dictionary, lang }: DashboardViewerProps) {
  const {
    url,
    platform,
    analysisResult,
    token,
    loading,
    error,
    lastRetryTimestamp,
    setLoading,
    setAnalysisResult,
    setToken,
    setError,
    setLastRetryTimestamp,
    reset,
  } = useAnalysisStore();

  const [currentSection, setCurrentSection] = useState(0);

  const t = dictionary.dashboard.viewer;

  useEffect(() => {
    const fetchAnalysis = async () => {
      if (!url || analysisResult || error) return;

      setLoading(true);
      try {
        const apiEndpoint =
          platform === "telegram"
            ? "/api/analyze/telegram/comments"
            : "/api/analyze/youtube/comments";
        const res = await fetch(apiEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url, lang }),
        });

        const data = await res.json();
        if (data.error) {
          if (data.error === "Insufficient tokens (<2000)") {
            toast.error("Too few tokens (<2000) for this operation", {
              style: { background: "#FF4444", color: "#FFFFFF" },
            });
          } else {
            throw new Error(data.error);
          }
        } else {
          setAnalysisResult(data.combinedResults);
          setToken(data.totalToken);
        }
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [
    url,
    platform,
    analysisResult,
    token,
    error,
    lang,
    setLoading,
    setToken,
    setAnalysisResult,
    setError,
  ]);

  const handleRetry = () => {
    const now = Date.now();
    if (lastRetryTimestamp && now - lastRetryTimestamp < 120000) {
      toast.error(t.toast, {
        style: { background: "#FF8C00", color: "#FFD700" },
      });
      return;
    }
    setLoading(true);
    setError(null);
    setLastRetryTimestamp(now);
    setAnalysisResult(null);
    setToken(0);
  };

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
          "#20B2AA",
          "#DC143C",
          "#6A5ACD",
          "#FFA07A",
        ],
      },
    ],
  };

  const sections = [
    <div key="chart" className="flex justify-center items-center h-full">
      <div className="h-[320px] w-[280px] sm:w-[500px]">
        {analysisResult && (
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
        )}
      </div>
    </div>,
    ...(analysisResult
      ? analysisResult
          .filter((item) => item.percentage > 0)
          .map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col justify-center items-start h-full text-left px-12"
            >
              <h3 className="text-xl font-bold text-green-700 mb-2">
                {t.categoryItem}: {item.title}
              </h3>
              <p className="text-gray-700 mb-4">
                {t.descriptionItem}: {item.description}
              </p>
              <span className="text-lg font-semibold text-lime-600">
                {t.percentagesItem}: {item.percentage}%
              </span>
            </div>
          ))
      : []),
  ];

  const handleNext = () =>
    setCurrentSection((prev) => Math.min(prev + 1, sections.length - 1));

  const handlePrevious = () =>
    setCurrentSection((prev) => Math.max(prev - 1, 0));

  const handleSectionSelect = (index: number) =>
    setCurrentSection(Math.min(Math.max(index, 0), sections.length - 1));

  if (loading) {
    return <div className="loader mx-auto mt-12 scale-200" />;
  }

  if (error) {
    return (
      <div className="text-center">
        <p className="text-lg text-red-600">{t.error}</p>
        <Button
          onClick={handleRetry}
          className="mt-4 bg-lime-600 text-white hover:bg-lime-500"
        >
          {t.repeat}
        </Button>
      </div>
    );
  }

  if (!analysisResult) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-6 bg-gray-50 rounded-2xl shadow-lg border border-lime-100">
        <div className="text-2xl font-bold text-lime-600 animate-bounce">
          {t.noAnalisisTitle}!
        </div>
        <div className="text-gray-700 text-lg">{t.noAnalysisDescription}</div>
      </div>
    );
  }

  return (
    <div className="relative p-4 sm:p-6 lg:p-8 bg-gray-100 backdrop-blur-md rounded-2xl sm:rounded-3xl shadow-xl border border-green-100 transition-all duration-300 hover:shadow-2xl hover:bg-gray-100/80 max-w-4xl mx-auto">
      <div className="absolute inset-0 bg-linear-to-br from-green-50/50 via-lime-50/30 to-transparent opacity-50 rounded-2xl sm:rounded-3xl" />
      <div className="absolute top-1 sm:top-2 right-2 sm:right-4 flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground bg-white/90 px-2 sm:px-3 py-0.5 rounded-full shadow-xs">
        <Tags size={14} />
        {t.tokens}: {token}
      </div>

      <div className="absolute top-1 sm:top-2 left-2 sm:left-4 flex items-center gap-1.5 text-xs sm:text-sm bg-lime-400 text-white px-2 sm:px-3 py-0.5 rounded-full shadow-xs grayscale cursor-not-allowed">
        <Save size={14} />
        {t.save}
      </div>
      <div
        className="absolute top-1 sm:top-2 left-[102px] sm:left-32 flex items-center gap-1.5 text-xs sm:text-sm bg-rose-400 hover:bg-rose-500 text-white px-2 sm:px-3 py-0.5 rounded-full shadow-xs cursor-pointer"
        onClick={() => reset()}
      >
        <OctagonMinus size={14} />
        {t.reset}
      </div>
      <div className="relative mt-4">
        <Card.Card className="relative px-2 h-[500px] w-full overflow-hidden bg-linear-to-br from-lime-50 to-green-50 backdrop-blur-lg shadow-2xl rounded-3xl border border-green-500/10">
          <ProgressBar section={sections} currentSection={currentSection} />
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
    </div>
  );
}
