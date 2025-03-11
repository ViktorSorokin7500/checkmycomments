import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { i18n } from "@/i18n.config";
import { match as matchLocale } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import { clerkMiddleware } from "@clerk/nextjs/server";
import { Locale } from "@/i18n.config";

function getLocale(request: NextRequest): string {
  const pathname = request.nextUrl.pathname;
  console.log("getLocale - Pathname:", pathname);

  const currentLocale = i18n.locales.find(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );
  console.log("getLocale - Current locale from pathname:", currentLocale);

  if (currentLocale) return currentLocale;

  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();
  console.log("getLocale - Languages from headers:", languages);

  const locales: string[] = [...i18n.locales];
  const matchedLocale = matchLocale(languages, locales, i18n.defaultLocale);
  console.log("getLocale - Matched locale:", matchedLocale);

  const finalLocale = matchedLocale || i18n.defaultLocale || "en";
  console.log("getLocale - Final locale:", finalLocale);
  return finalLocale;
}

export default clerkMiddleware(async (auth, request: NextRequest) => {
  console.log("Middleware - Initial URL:", request.url);
  console.log("Middleware - Initial Pathname:", request.nextUrl.pathname);

  const { userId } = await auth();
  console.log("Middleware - User ID:", userId);

  const pathname = request.nextUrl.pathname;
  console.log("Middleware - Processing pathname:", pathname);

  // Пропускаємо API-запити
  if (pathname.startsWith("/api")) {
    console.log("Middleware - Skipping API request");
    return NextResponse.next();
  }

  // Перевіряємо, чи шлях має валідну локаль
  const hasLocalePrefix = i18n.locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );
  console.log("Middleware - Has locale prefix:", hasLocalePrefix);

  // Ловимо невалідні локалі типу /undefined/dashboard
  if (pathname.startsWith("/undefined") || (!hasLocalePrefix && userId)) {
    const locale = getLocale(request);
    const safeLocale = i18n.locales.includes(locale as Locale)
      ? locale
      : i18n.defaultLocale || "en";
    console.log("Middleware - Fixing invalid locale, using:", safeLocale);

    // Визначаємо правильний шлях
    const cleanPath = pathname.replace(/^\/undefined/, "");
    const redirectUrl = new URL(
      `/${safeLocale}${cleanPath === "" ? "/" : cleanPath}`,
      request.url
    );
    console.log("Middleware - Redirecting to:", redirectUrl.toString());
    return NextResponse.redirect(redirectUrl);
  }

  // Редирект авторизованих юзерів на /dashboard
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
    console.log("Middleware - Redirecting to:", redirectUrl.toString());
    return NextResponse.redirect(redirectUrl);
  }

  // Додаємо локаль до шляхів без префікса
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
    console.log("Middleware - Redirecting to:", redirectUrl.toString());
    return NextResponse.redirect(redirectUrl);
  }

  console.log("Middleware - Proceeding with NextResponse.next()");
  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|assets|favicon.ico|sitemap.xml|robots.txt).*)",
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
