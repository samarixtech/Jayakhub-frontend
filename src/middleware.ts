import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Exclude static assets and API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  // 2. Get Country and Language from Cookies
  const country = request.cookies.get("USER_COUNTRY")?.value || "iraq";
  const language = request.cookies.get("NEXT_LOCALE")?.value || "en";

  // 3. Check if the URL already has the dynamic segments
  // This regex checks if path starts with /[string]/[string]/
  const pathSegments = pathname.split("/").filter(Boolean);
  const hasLocalePrefix =
    pathSegments.length >= 2 &&
    !["banner", "corporate", "partner"].includes(pathSegments[0]);

  if (!hasLocalePrefix && pathname !== "/") {
    // 4. Silently rewrite to the [country]/[langauge] structure
    // This keeps the URL in the browser as "/myorders"
    const url = request.nextUrl.clone();
    url.pathname = `/${country}/${language}${pathname}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  // Matcher ignores specific static folders
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
