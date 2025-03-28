import { NextResponse } from "next/server";
import { Webhook } from "svix";
import { sql } from "@/lib/db";

export async function POST(request: Request) {
  const payload = await request.json();
  const headers = request.headers;

  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET || "");
  try {
    // Перевіряємо, чи валідний Webhook
    wh.verify(JSON.stringify(payload), {
      "svix-id": headers.get("svix-id") || "",
      "svix-timestamp": headers.get("svix-timestamp") || "",
      "svix-signature": headers.get("svix-signature") || "",
    });

    // Якщо юзер створений, додаємо його в БД
    if (payload.type === "user.created") {
      const clerkId = payload.data.id;
      const email = payload.data.email_addresses[0].email_address;
      await sql`
        INSERT INTO users (clerk_id, email, tokens)
        VALUES (${clerkId}, ${email}, 20000)
        ON CONFLICT (clerk_id) DO NOTHING;
      `;
      console.log(`User ${clerkId} - ${email} added with 20000 tokens`);
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
