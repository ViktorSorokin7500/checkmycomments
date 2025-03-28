import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { sql } from "@/lib/db";
import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions";
import axios from "axios";
import { jsonrepair } from "jsonrepair";

if (!process.env.API_HASH) throw new Error("API_HASH is not defined");
if (!process.env.TOGETHER_API_KEY)
  throw new Error("TOGETHER_API_KEY is not defined");

const session = new StringSession(process.env.STRING_SESSION || "");
const client = new TelegramClient(
  session,
  Number(process.env.API_ID),
  process.env.API_HASH as string,
  { connectionRetries: 5 }
);

async function getAllComments(
  client: TelegramClient,
  channel: string,
  postId: number
) {
  const allMessages = [];
  let offsetId = 0;
  const limit = 50;

  for (let i = 0; i < 2; i++) {
    const messages = await client.getMessages(channel, {
      limit,
      replyTo: postId,
      offsetId,
    });
    if (!messages.length) break;
    allMessages.push(...messages);
    offsetId = messages[messages.length - 1].id;
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  return allMessages.map((msg) => msg.message).filter(Boolean);
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
  results: { title: string; description: string; percentage: number }[],
  lang: "uk" | "en"
) {
  const categoryMap: {
    [key: string]: { description: string; percentage: number };
  } = {};

  results.forEach((item) => {
    const percentage =
      typeof item.percentage === "number" ? item.percentage : 0;
    if (categoryMap[item.title]) {
      categoryMap[item.title].percentage += percentage;
    } else {
      categoryMap[item.title] = { description: item.description, percentage };
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
  try {
    const authData = await auth();
    const userId = authData.userId;
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { url, lang = "uk" } = await request.json();
    const tokenTracker = { total: 0 };

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

    const match = url.match(/https:\/\/t\.me\/([^\/]+)\/(\d+)/);
    if (!match)
      return NextResponse.json(
        {
          error:
            lang === "uk" ? "Невірний формат посилання" : "Invalid URL format",
        },
        { status: 400 }
      );

    const [, channel, postId] = match;

    await client.connect();
    await client.getEntity(channel);
    const comments = await getAllComments(client, channel, Number(postId));
    if (!comments.length)
      return NextResponse.json(
        {
          error: lang === "uk" ? "Коментарів не знайдено" : "No comments found",
        },
        { status: 400 }
      );

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
    console.error("Error in route.ts:", error);
    const errorMessage =
      error instanceof Error ? error.message && "message" : "Unknown error";
    return NextResponse.json(
      { error: errorMessage },
      {
        status:
          error instanceof Error && error.message.includes("Unauthorized")
            ? 401
            : 500,
      }
    );
  }
}
