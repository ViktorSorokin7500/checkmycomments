import { NextResponse } from "next/server";
import { initDb, sql } from "@/lib/db";

export async function GET() {
  try {
    await initDb();
    await sql`INSERT INTO users (clerk_id, tokens) VALUES ('test_clerk_id_123', 20000) ON CONFLICT (clerk_id) DO NOTHING;`;
    const result =
      await sql`SELECT * FROM users WHERE clerk_id = 'test_clerk_id_123'`;
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
