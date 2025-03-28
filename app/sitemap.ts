import { NextResponse } from "next/server";
import { Locale, i18n } from "@/i18n.config";

export async function GET() {
  const baseUrl = "https://www.commentpulse.site";
  const locales = i18n.locales;

  // Генерация URL для всех локалей
  const urls = locales.flatMap((locale: Locale) => [
    {
      loc: `${baseUrl}/${locale}`,
      lastmod: new Date().toISOString().split("T")[0],
      changefreq: "daily",
      priority: "1.0",
    },
    {
      loc: `${baseUrl}/${locale}/dashboard`,
      lastmod: new Date().toISOString().split("T")[0],
      changefreq: "weekly",
      priority: "0.8",
    },
  ]);

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls
    .map(
      (url) => `
    <url>
      <loc>${url.loc}</loc>
      <lastmod>${url.lastmod}</lastmod>
      <changefreq>${url.changefreq}</changefreq>
      <priority>${url.priority}</priority>
    </url>`
    )
    .join("")}
</urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      "Content-Type": "text/xml",
    },
  });
}
