import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function POST(request: Request) {
  const { userId } = await request.json();
  if (!userId)
    return NextResponse.json({ error: "No userId provided" }, { status: 400 });

  const result = await sql`SELECT tokens FROM users WHERE clerk_id = ${userId}`;
  if (result.length === 0)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  return NextResponse.json({ tokens: result[0].tokens });
}
