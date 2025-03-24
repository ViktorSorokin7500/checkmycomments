import { NextResponse } from "next/server";
import { initDb, sql } from "@/lib/db";

export async function GET() {
  try {
    await initDb();
    const result = await sql`SELECT * FROM users`; // Показуємо всіх юзерів
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
