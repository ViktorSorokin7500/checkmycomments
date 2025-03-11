import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch(
      "https://min-api.cryptocompare.com/data/price?fsym=SOL&tsyms=USD,UAH",
      { cache: "no-store" }
    );
    const data = await response.json();
    return NextResponse.json({
      solana: {
        usd: data.USD,
        uah: data.UAH,
      },
      usd: {
        uah: data.UAH / data.USD, // Розрахуємо курс USD/UAH
      },
    });
  } catch (error) {
    console.error("Помилка отримання цін:", error);
    return NextResponse.json(
      { error: "Failed to fetch prices" },
      { status: 500 }
    );
  }
}
