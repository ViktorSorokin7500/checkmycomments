import { neon } from "@neondatabase/serverless";

export const sql = neon(process.env.DATABASE_URL!);

export async function initDb() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        clerk_id VARCHAR(255) UNIQUE NOT NULL,
        tokens INTEGER DEFAULT 20000
      );
    `;
    console.log("Table 'users' created or already exists");
  } catch (error) {
    console.error("Failed to initialize database:", error);
    throw error;
  }
}
