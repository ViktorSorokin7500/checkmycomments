import { NextResponse } from "next/server";
import { Webhook } from "svix";
import { sql } from "@/lib/db";

export async function POST(request: Request) {
  const payload = await request.json();
  const headers = request.headers;

  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET || "");
  try {
    // Проверяем валидность вебхука
    wh.verify(JSON.stringify(payload), {
      "svix-id": headers.get("svix-id") || "",
      "svix-timestamp": headers.get("svix-timestamp") || "",
      "svix-signature": headers.get("svix-signature") || "",
    });

    // Обрабатываем создание пользователя
    if (payload.type === "user.created") {
      const clerkId = payload.data.id;
      const email = payload.data.email_addresses[0].email_address; // Основная почта из Clerk

      // Проверяем, есть ли пользователь с таким email
      const existingUser = await sql`
        SELECT * FROM users WHERE email = ${email} LIMIT 1;
      `;

      if (existingUser.length > 0) {
        // Если пользователь уже есть, обновляем clerk_id, токены остаются прежними
        await sql`
          UPDATE users
          SET clerk_id = ${clerkId}
          WHERE email = ${email};
        `;
        console.log(
          `User with email ${email} updated with new clerk_id ${clerkId}`
        );
      } else {
        // Если пользователя нет, создаём нового с 20000 токенов
        await sql`
          INSERT INTO users (clerk_id, email, tokens)
          VALUES (${clerkId}, ${email}, 20000);
        `;
        console.log(
          `New user ${clerkId} with email ${email} added with 20000 tokens`
        );
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json(
      { error: "Webhook verification failed" },
      { status: 400 }
    );
  }
}
