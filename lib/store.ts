import { create } from "zustand";

interface AnalysisState {
  url: string | null;
  platform: "telegram" | "youtube" | null;
  analysisType: "comments" | null;
  analysisResult:
    | { title: string; description: string; percentage: number }[]
    | null;
  loading: boolean;
  error: string | null;
  lastRetryTimestamp: number | null;
  setUrl: (url: string, platform: "telegram" | "youtube") => void;
  setLoading: (loading: boolean) => void;
  setAnalysisResult: (
    result: { title: string; description: string; percentage: number }[] | null
  ) => void;
  setError: (error: string | null) => void;
  setLastRetryTimestamp: (timestamp: number) => void;
  reset: () => void;
}

export const useAnalysisStore = create<AnalysisState>((set) => ({
  url: null,
  platform: null,
  analysisType: null,
  analysisResult: null,
  loading: false,
  error: null,
  lastRetryTimestamp: null,
  setUrl: (url, platform) =>
    set({
      url,
      platform,
      analysisType: "comments",
      analysisResult: null,
      error: null,
    }),
  setLoading: (loading) => set({ loading }),
  setAnalysisResult: (result) =>
    set(() => ({
      analysisResult: result,
      loading: false,
      error: null,
    })),
  setError: (error) => set({ error, loading: false }),
  setLastRetryTimestamp: (timestamp) => set({ lastRetryTimestamp: timestamp }),
  reset: () =>
    set({
      url: null,
      platform: null,
      analysisType: null,
      analysisResult: null,
      error: null,
      loading: false,
    }),
}));
