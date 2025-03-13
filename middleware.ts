import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { i18n } from "@/i18n.config";
import { match as matchLocale } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import { clerkMiddleware } from "@clerk/nextjs/server";
import { Locale } from "@/i18n.config";

function getLocale(request: NextRequest): string {
  const pathname = request.nextUrl.pathname;

  const currentLocale = i18n.locales.find(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );

  if (currentLocale) return currentLocale;

  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();

  const locales: string[] = [...i18n.locales];
  const matchedLocale = matchLocale(languages, locales, i18n.defaultLocale);

  const finalLocale = matchedLocale || i18n.defaultLocale || "en";
  return finalLocale;
}

export default clerkMiddleware(async (auth, request: NextRequest) => {
  const { userId } = await auth();

  const pathname = request.nextUrl.pathname;

  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  const hasLocalePrefix = i18n.locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );

  if (pathname.startsWith("/undefined") || (!hasLocalePrefix && userId)) {
    const locale = getLocale(request);
    const safeLocale = i18n.locales.includes(locale as Locale)
      ? locale
      : i18n.defaultLocale || "en";

    const cleanPath = pathname.replace(/^\/undefined/, "");
    const redirectUrl = new URL(
      `/${safeLocale}${cleanPath === "" ? "/" : cleanPath}`,
      request.url
    );
    return NextResponse.redirect(redirectUrl);
  }

  if (
    userId &&
    (pathname === "/" ||
      i18n.locales.some((locale) => pathname === `/${locale}`))
  ) {
    const locale = getLocale(request);
    const safeLocale = i18n.locales.includes(locale as Locale)
      ? locale
      : i18n.defaultLocale || "en";
    const redirectUrl = new URL(`/${safeLocale}/dashboard`, request.url);
    return NextResponse.redirect(redirectUrl);
  }

  const skipLocalePaths = ["/sitemap.xml", "/robots.txt", "/ads.txt"];
  const isSkipPath = skipLocalePaths.some((skipPath) => pathname === skipPath);

  if (!hasLocalePrefix && !isSkipPath) {
    const locale = getLocale(request);
    const safeLocale = i18n.locales.includes(locale as Locale)
      ? locale
      : i18n.defaultLocale || "en";
    const redirectUrl = new URL(
      `/${safeLocale}${pathname === "/" ? "" : pathname}`,
      request.url
    );
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|assets|favicon.ico|sitemap.xml|robots.txt).*)",
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
