"use client";

import { useEffect } from "react";
import { useAnalysisStore } from "@/lib/store";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import { Button } from "@/components/ui";
import toast from "react-hot-toast";
import { Locale } from "@/i18n.config";

ChartJS.register(ArcElement, Tooltip, Legend);

interface DashboardCommentsProps {
  t: {
    welcome: string;
  };
  lang: Locale;
}

export function DashboardComments({ t, lang }: DashboardCommentsProps) {
  const {
    url,
    platform,
    analysisResult,
    loading,
    error,
    lastRetryTimestamp,
    setLoading,
    setAnalysisResult,
    setError,
    setLastRetryTimestamp,
  } = useAnalysisStore();

  useEffect(() => {
    const fetchAnalysis = async () => {
      if (!url || platform !== "telegram" || analysisResult || error) return;

      setLoading(true);
      try {
        const res = await fetch("/api/analyze/telegram/comments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url, lang }),
        });

        const data = await res.json();
        if (data.error) throw new Error(data.error);
        setAnalysisResult(data);
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
    error,
    lang,
    setLoading,
    setAnalysisResult,
    setError,
  ]);

  const handleRetry = () => {
    const now = Date.now();
    if (lastRetryTimestamp && now - lastRetryTimestamp < 120000) {
      toast.error("Сорян, зачекай 2 хвилини перед наступною спробою", {
        style: { background: "#FF8C00", color: "#FFD700" },
      });
      return;
    }
    setLoading(true);
    setError(null);
    setLastRetryTimestamp(now);
    setAnalysisResult(null);
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
        ],
      },
    ],
  };

  return (
    <>
      {loading && <p>Завантаження...</p>}
      {error && (
        <div>
          <p>Помилка: {error}</p>
          <Button
            onClick={handleRetry}
            className="mt-4 bg-lime-zest/90 text-sunset-glow hover:bg-lime-zest/80"
          >
            Повторить
          </Button>
        </div>
      )}
      {analysisResult && (
        <>
          <div className="max-w-md mx-auto">
            <Pie data={chartData} />
          </div>
          <ul className="mt-4">
            {analysisResult.map((item, idx) => (
              <li key={idx} className="mb-2">
                <strong>
                  {item.title} ({item.percentage}%)
                </strong>
                : {item.description}
              </li>
            ))}
          </ul>
        </>
      )}
      {!loading && !error && !analysisResult && (
        <>
          <h1 className="text-3xl font-semibold"></h1>
          <p className="text-lg mt-4">{t.welcome}</p>
        </>
      )}
    </>
  );
}
