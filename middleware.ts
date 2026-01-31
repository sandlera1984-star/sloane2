import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const TERMS_COOKIE = "termsAccepted";
const AGE_COOKIE = "ageConfirmed";

const PUBLIC_FILE = /\.(.*)$/;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname === "/" ||
    pathname.startsWith("/terms") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  const hasTerms = request.cookies.get(TERMS_COOKIE)?.value === "true";
  const hasAge = request.cookies.get(AGE_COOKIE)?.value === "true";

  if (!hasTerms || !hasAge) {
    const url = request.nextUrl.clone();
    url.pathname = "/terms";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

