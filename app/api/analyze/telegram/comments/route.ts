import { NextResponse } from "next/server";
import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions";
import axios from "axios";

if (!process.env.API_HASH) throw new Error("API_HASH is not defined");
if (!process.env.TOGETHER_API_KEY)
  throw new Error("TOGETHER_API_KEY is not defined");

const session = new StringSession(process.env.STRING_SESSION || "");
const client = new TelegramClient(
  session,
  Number(process.env.API_ID),
  process.env.API_HASH as string,
  {
    connectionRetries: 5,
  }
);

async function getAllComments(
  client: TelegramClient,
  channel: string,
  postId: number
) {
  const allMessages = [];
  let offsetId = 0;
  const limit = 50;

  for (let i = 0; i < 5; i++) {
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

async function analyzeCommentsChunk(comments: string[], lang: "en" | "uk") {
  const prompt =
    lang === "uk"
      ? `Проаналізуй подані коментарі та розподіли їх за категоріями (максимум 6) на основі основних тем, емоційного забарвлення та ключових згадок (персоналії, події, терміни). Поверни результат як повний JSON-рядок у подвійних кавичках із масивом об’єктів: [{"title": "", "description": "", "percentage": 0, "examples": [""]}], де:
- "title" — чітка назва категорії (наприклад, "Підтримка України", "Критика Путіна", а не просто "Політика"),
- "description" — детальний опис, що саме обговорюється, які настрої переважають (позитивні, негативні, агресивні), які слова чи особи згадуються,
- "percentage" — відсоток коментарів у цій категорії (число від 0 до 100),
- "examples" — 2-3 приклади коментарів (дослівно, без змін).
Якщо категорій більше 5, об’єднай решту в "Інше" з описом, що це за різнобій. Тільки JSON, без додаткового тексту. Відповідь — українською. Ось коментарі:\n${comments
          .map((c) => `- ${c}`)
          .join("\n")}`
      : `Analyze the provided comments and categorize them into a maximum of six categories based on key themes, emotional tone, and significant mentions (personalities, events, terms). Return the result as a complete JSON string in double quotes with an array of objects: [{"title": "", "description": "", "percentage": 0, "examples": [""]}], where:
- "title" — a clear category name (e.g., "Support for Ukraine", "Criticism of Putin", rather than just "Politics"),
- "description" — a detailed explanation of what is discussed, the prevailing sentiments (positive, negative, aggressive), and notable words or persons mentioned,
- "percentage" — the percentage of comments in this category (a number from 0 to 100),
- "examples" — 2-3 verbatim comment examples (unaltered).
If there are more than five categories, merge the rest into "Other" with a description of what this miscellany includes. Only JSON, no additional text. Response — in English. Here are the comments:\n${comments
          .map((c) => `- ${c}`)
          .join("\n")}`;

  const response = await axios.post(
    "https://api.together.xyz/v1/chat/completions",
    {
      model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1000,
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
  console.log("Chunk response (escaped):", JSON.stringify(content));

  const jsonEndIndex = content.lastIndexOf("]") + 1;
  const jsonContent = content.substring(0, jsonEndIndex);
  const cleanedContent = jsonContent
    .trim()
    .replace(/\n/g, " ")
    .replace(/\r/g, "")
    .replace(/�/g, "");
  console.log("Cleaned JSON content:", cleanedContent);

  try {
    return JSON.parse(cleanedContent);
  } catch (e) {
    console.error("Failed to parse JSON, attempting to fix...");
    const lastObjectEnd = cleanedContent.lastIndexOf("}");
    if (lastObjectEnd !== -1) {
      const fixedContent = cleanedContent.substring(0, lastObjectEnd + 1) + "]";
      console.log("Fixed JSON content:", fixedContent);
      return JSON.parse(fixedContent);
    }
    throw e;
  }
}

export async function POST(request: Request) {
  const { url, lang = "uk" } = await request.json();

  try {
    const match = url.match(/https:\/\/t\.me\/([^\/]+)\/(\d+)/);
    if (!match)
      throw new Error(
        lang === "uk" ? "Невірний формат посилання" : "Invalid URL format"
      );
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, channel, postId] = match;

    await client.connect();
    await client.getEntity(channel);
    const comments = await getAllComments(client, channel, Number(postId));

    if (!comments.length) {
      return NextResponse.json(
        {
          error: lang === "uk" ? "Коментарів не знайдено" : "No comments found",
        },
        { status: 400 }
      );
    }

    console.log("Total comments:", comments.length);

    const chunkSize = 50;
    const commentChunks = [];
    for (let i = 0; i < comments.length; i += chunkSize) {
      commentChunks.push(comments.slice(i, i + chunkSize));
    }

    const results = [];
    for (let i = 0; i < commentChunks.length; i++) {
      console.log(`Processing chunk ${i + 1} of ${commentChunks.length}`);
      const chunkResult = await analyzeCommentsChunk(
        commentChunks[i],
        lang as "uk" | "en"
      );
      results.push(...chunkResult);
    }

    const combinedResults = combineResults(results, lang as "uk" | "en");
    console.log("Combined results:", combinedResults);

    return NextResponse.json(combinedResults);
  } catch (error) {
    console.error("Ошибка:", error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : lang === "uk"
        ? "Невідома помилка"
        : "Unknown error";
    if (axios.isAxiosError(error) && error.response) {
      console.error("Axios Error Status:", error.response.status);
      console.error("Axios Error Data:", error.response.data);
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

function combineResults(
  results: {
    title: string;
    description: string;
    percentage: number;
    examples: string[];
  }[],
  lang: "uk" | "en"
) {
  const categoryMap: {
    [key: string]: {
      description: string;
      percentage: number;
      examples: string[];
    };
  } = {};

  results.forEach((item) => {
    const percentage =
      typeof item.percentage === "number" ? item.percentage : 0; // Защита от undefined/NaN
    if (categoryMap[item.title]) {
      categoryMap[item.title].percentage += percentage;
      categoryMap[item.title].examples = [
        ...new Set([...categoryMap[item.title].examples, ...item.examples]),
      ].slice(0, 3);
    } else {
      categoryMap[item.title] = {
        description: item.description,
        percentage: percentage,
        examples: item.examples,
      };
    }
  });

  let combined = Object.entries(categoryMap)
    .map(([title, { description, percentage, examples }]) => ({
      title,
      description,
      percentage,
      examples,
    }))
    .sort((a, b) => b.percentage - a.percentage);

  if (combined.length > 5) {
    const top5 = combined.slice(0, 5);
    const others = combined.slice(5);
    const othersPercentage = others.reduce(
      (sum, item) => sum + item.percentage,
      0
    );
    const othersExamples = others.flatMap((item) => item.examples).slice(0, 3);
    top5.push({
      title: lang === "uk" ? "Інше" : "Other",
      description:
        lang === "uk"
          ? "Різнобій коментарів, що не увійшли до основних категорій"
          : "Miscellaneous comments not fitting into main categories",
      percentage: othersPercentage,
      examples: othersExamples,
    });
    combined = top5;
  }

  const totalPercentage = combined.reduce(
    (sum, item) => sum + item.percentage,
    0
  );
  if (totalPercentage === 0) {
    // Если проценты не пришли, распределяем равномерно
    combined.forEach((item) => {
      item.percentage = Math.round(100 / combined.length);
    });
  } else {
    combined.forEach((item) => {
      item.percentage = Math.round((item.percentage / totalPercentage) * 100);
    });
  }

  return combined;
}
