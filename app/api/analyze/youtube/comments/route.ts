import { NextResponse } from "next/server";
import axios from "axios";
import { jsonrepair } from "jsonrepair";
import { auth } from "@clerk/nextjs/server";
import { sql } from "@/lib/db";

if (!process.env.YOUTUBE_API_KEY)
  throw new Error("YOUTUBE_API_KEY is not defined");
if (!process.env.TOGETHER_API_KEY)
  throw new Error("TOGETHER_API_KEY is not defined");

interface YouTubeCommentSnippet {
  textOriginal: string;
}

interface YouTubeComment {
  snippet: {
    topLevelComment: {
      snippet: YouTubeCommentSnippet;
    };
  };
}

interface YouTubeCommentThreadResponse {
  items: YouTubeComment[];
  nextPageToken?: string;
}

async function getAllComments(videoId: string): Promise<string[]> {
  const comments: string[] = [];
  let nextPageToken = "";
  const maxResults = 100;

  console.log("Fetching comments for videoId:", videoId);
  console.log(
    "Using API key:",
    process.env.YOUTUBE_API_KEY?.substring(0, 5) + "..."
  );

  try {
    do {
      const params: Record<string, string | number | undefined> = {
        key: process.env.YOUTUBE_API_KEY,
        part: "snippet",
        videoId,
        maxResults,
        pageToken: nextPageToken || undefined,
      };
      const queryString = new URLSearchParams(
        Object.entries(params)
          .filter(([, value]) => value !== undefined)
          .map(([key, value]) => [key, String(value)])
      ).toString();
      const url =
        "https://www.googleapis.com/youtube/v3/commentThreads?" + queryString;
      console.log("Full API URL:", url);

      const response = await axios.get<YouTubeCommentThreadResponse>(url, {
        timeout: 10000,
      });

      const items = response.data.items || [];
      console.log("Received items:", items.length);
      comments.push(
        ...items.map(
          (item) => item.snippet.topLevelComment.snippet.textOriginal
        )
      );
      nextPageToken = response.data.nextPageToken || "";
      await new Promise((resolve) => setTimeout(resolve, 500));
    } while (nextPageToken && comments.length < 200);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error("YouTube API error:", error.response.data);
      throw new Error(
        `YouTube API error: ${JSON.stringify(error.response.data)}`
      );
    }
    throw error;
  }

  console.log("Total comments collected:", comments.length);
  return comments.filter(Boolean);
}

async function analyzeCommentsChunk(
  comments: string[],
  lang: "en" | "uk",
  tokenTracker: { total: number },
  retries = 2
) {
  const prompt =
    lang === "uk"
      ? `Проаналізуй подані коментарі та розподіли їх за категоріями (максимум 5) на основі ключових тем, емоційного тону та повторюваних згадок (імена, об’єкти, події, терміни). Вияви найпомітніші тренди в коментарях, адаптуючись до їхнього змісту. Поверни валідний JSON-рядок у подвійних кавичках: [{"title": "", "description": "", "percentage": 0}], де:
  - "title" — унікальна назва тренду чи теми,
  - "description" — детальний аналіз: що обговорюється, які емоції переважають, можеш додати ключові слова які використовувались для цього тренду/теми,
  - "percentage" — відсоток коментарів у цій категорії (0-100).
  Тільки JSON, виключно українською. Ось коментарі:\n${comments
    .map((c) => `- ${c}`)
    .join("\n")}`
      : `Analyze the provided comments and categorize them (max 5 categories) based on key topics, emotional tone, and recurring mentions. Return a valid JSON string in double quotes: [{"title": "", "description": "", "percentage": 0}], where "title" is a unique trend name, "description" analyzes the discussion and emotions, "percentage" is the share (0-100). Output JSON only, on English.\n${comments
          .map((c) => `- ${c}`)
          .join("\n")}`;

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const response = await axios.post(
        "https://api.together.xyz/v1/chat/completions",
        {
          model: "mistralai/Mixtral-8x22B-Instruct-v0.1",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 16384,
          temperature: 0.7,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.TOGETHER_API_KEY}`,
            "Content-Type": "application/json",
          },
          timeout: 120000,
        }
      );

      const content = response.data.choices[0].message.content;
      console.log(response.data.usage.total_tokens);

      tokenTracker.total += response.data.usage.total_tokens;

      const jsonEndIndex = content.lastIndexOf("]") + 1;
      const jsonContent =
        jsonEndIndex > 0 ? content.substring(0, jsonEndIndex) : content;
      const cleanedContent = jsonContent
        .trim()
        .replace(/\n/g, " ")
        .replace(/\r/g, "")
        .replace(/�/g, "");

      try {
        return JSON.parse(cleanedContent);
      } catch (e) {
        console.error("Failed to parse JSON, repairing...", e);
        const repairedContent = jsonrepair(cleanedContent);
        return JSON.parse(repairedContent);
      }
    } catch (e) {
      console.error(`Attempt ${attempt + 1} failed:`, e);
      if (attempt === retries - 1) {
        console.error("All retries failed, returning empty result");
        return [];
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
  return [];
}

function combineResults(
  results: {
    title: string;
    description: string;
    percentage: number;
  }[],
  lang: "uk" | "en"
) {
  const categoryMap: {
    [key: string]: {
      description: string;
      percentage: number;
    };
  } = {};

  results.forEach((item) => {
    const percentage =
      typeof item.percentage === "number" ? item.percentage : 0;
    if (categoryMap[item.title]) {
      categoryMap[item.title].percentage += percentage;
    } else {
      categoryMap[item.title] = {
        description: item.description,
        percentage,
      };
    }
  });

  let combined = Object.entries(categoryMap)
    .map(([title, { description, percentage }]) => ({
      title,
      description,
      percentage,
    }))
    .sort((a, b) => b.percentage - a.percentage);

  if (combined.length > 15) {
    const top14 = combined.slice(0, 14);
    const others = combined.slice(14);
    const othersPercentage = others.reduce(
      (sum, item) => sum + item.percentage,
      0
    );

    top14.push({
      title: lang === "uk" ? "Інше" : "Other",
      description:
        lang === "uk"
          ? "Коментарі поза основними трендами"
          : "Comments outside main trends",
      percentage: othersPercentage,
    });
    combined = top14;
  }

  const totalPercentage = combined.reduce(
    (sum, item) => sum + item.percentage,
    0
  );
  if (totalPercentage === 0) {
    combined.forEach(
      (item) => (item.percentage = Math.round(100 / combined.length))
    );
  } else {
    combined.forEach(
      (item) =>
        (item.percentage = Math.round(
          (item.percentage / totalPercentage) * 100
        ))
    );
  }

  return combined;
}

export async function POST(request: Request) {
  const tokenTracker = { total: 0 };

  try {
    const authData = await auth();
    const userId = authData.userId;
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userResult =
      await sql`SELECT tokens FROM users WHERE clerk_id = ${userId}`;
    if (userResult.length === 0)
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    const currentTokens = userResult[0].tokens;
    if (currentTokens < 1200)
      return NextResponse.json(
        { error: "Insufficient tokens (<1200)" },
        { status: 403 }
      );
    const body = await request.json();
    console.log("Request body:", body);

    const { url, lang = "uk" } = body;
    console.log("Received URL:", url);
    console.log("Language:", lang);

    if (!url || typeof url !== "string") {
      console.error("URL is missing or not a string:", url);
      throw new Error(
        lang === "uk"
          ? "Посилання відсутнє або невалідне"
          : "URL is missing or invalid"
      );
    }

    // Извлекаем videoId без изменения регистра
    const videoIdMatch = url.match(
      /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i
    );
    if (!videoIdMatch) {
      console.error("Invalid URL format:", url);
      throw new Error(
        lang === "uk" ? "Невірний формат посилання" : "Invalid URL format"
      );
    }

    const urlParts = url.split("v=");
    const videoIdFromUrl =
      urlParts.length > 1
        ? urlParts[1].split("&")[0]
        : url.match(/[a-zA-Z0-9_-]{11}/)?.[0];
    const videoId = videoIdFromUrl || videoIdMatch[1];
    console.log("Extracted videoId:", videoId);

    const comments = await getAllComments(videoId);

    if (!comments.length) {
      console.log("No comments found for videoId:", videoId);
      return NextResponse.json(
        {
          error: lang === "uk" ? "Коментарів не знайдено" : "No comments found",
        },
        { status: 400 }
      );
    }

    const chunkSize = 40;
    const commentChunks = [];
    for (let i = 0; i < comments.length; i += chunkSize) {
      commentChunks.push(comments.slice(i, i + chunkSize));
    }

    const results = [];
    for (let i = 0; i < commentChunks.length; i++) {
      try {
        const chunkResult = await analyzeCommentsChunk(
          commentChunks[i],
          lang as "uk" | "en",
          tokenTracker
        );
        results.push(...chunkResult);
      } catch (e) {
        console.error(`Failed to process chunk ${i}:`, e);
        results.push({
          title: lang === "uk" ? "Помилка обробки" : "Processing Error",
          description:
            lang === "uk"
              ? "Не вдалося проаналізувати частину коментарів"
              : "Failed to analyze some comments",
          percentage: 0,
        });
      }
    }

    const combinedResults = combineResults(results, lang as "uk" | "en");
    const finalTokenCount = tokenTracker.total;

    await sql`UPDATE users SET tokens = ${
      currentTokens - finalTokenCount
    } WHERE clerk_id = ${userId}`;

    return NextResponse.json({ combinedResults, totalToken: finalTokenCount });
  } catch (error) {
    console.error("General error:", error);
    const lang = (await request.json())?.lang || "uk";
    const errorMessage =
      error instanceof Error
        ? error.message
        : lang === "uk"
        ? "Невідома помилка"
        : "Unknown error";
    if (axios.isAxiosError(error) && error.response) {
      console.log("API response data:", error.response.data);
      return NextResponse.json(
        {
          error: `${lang === "uk" ? "Помилка API" : "API Error"}: ${
            error.response.status
          } - ${JSON.stringify(error.response.data)}`,
        },
        { status: 500 }
      );
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
