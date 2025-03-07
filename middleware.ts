import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { i18n } from "@/i18n.config";
import { match as matchLocale } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import { clerkMiddleware, ClerkMiddlewareAuth } from "@clerk/nextjs/server";

function getLocale(request: NextRequest): string | undefined {
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  const locales: string[] = [...i18n.locales];
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();

  const locale = matchLocale(languages, locales, i18n.defaultLocale);
  return locale;
}

export default clerkMiddleware(
  (auth: ClerkMiddlewareAuth, request: NextRequest) => {
    const pathname = request.nextUrl.pathname;

    const skipLocalePaths = ["/sitemap.xml", "/robots.txt", "/ads.txt"];
    const isSkipPath = skipLocalePaths.some(
      (skipPath) => pathname === skipPath
    );

    const hasLocalePrefix = i18n.locales.some(
      (locale: string) =>
        pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    );

    if (!hasLocalePrefix && !isSkipPath) {
      const locale = getLocale(request);
      return NextResponse.redirect(
        new URL(`/${locale}${pathname === "/" ? "" : pathname}`, request.url)
      );
    }

    return undefined;
  }
);

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|assets|favicon.ico|sitemap.xml|robots.txt).*)",
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
