import { NextResponse } from "next/server";

export async function GET() {
  const baseUrl = "https://www.commentpulse.site";
  const languages = ["en", "uk"];
  const staticPages = [
    "",
    "/dashboard",
    "/dashboard/telegram",
    "/dashboard/youtube",
  ];

  const urls = languages.flatMap((lang) =>
    staticPages.map((page) => ({
      url: `${baseUrl}/${lang}${page}`,
      lastModified: new Date().toISOString().split("T")[0],
      changeFrequency: page === "" ? "daily" : "weekly",
      priority: page === "" ? 1.0 : page.includes("dashboard") ? 0.8 : 0.7,
    }))
  );

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls
    .map(
      (entry) => `
  <url>
    <loc>${entry.url}</loc>
    <lastmod>${entry.lastModified}</lastmod>
    <changefreq>${entry.changeFrequency}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`
    )
    .join("")}
</urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
