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

  // 2. Get Country, Language, and Token from Cookies
  const country = request.cookies.get("USER_COUNTRY")?.value || "iraq";
  const language = request.cookies.get("NEXT_LOCALE")?.value || "en";
  const token = request.cookies.get("token")?.value;

  // 3. Analyze Path Segments
  const pathSegments = pathname.split("/").filter(Boolean);

  // 4. Define Protected Routes
  // Check if any segment matches 'customer' or 'restaurant' exactly.
  // This avoids matching 'restaurants' (plural) or 'restaurant-register'.
  const isProtected = pathSegments.some(
    (segment) => segment === "customer" || segment === "restaurant",
  );

  // Exclude specific sub-paths if necessary (though 'restaurant' segment usually implies protected scope)
  // If there are public routes under /restaurant/, exclude them here.
  // For now, based on project structure, /restaurant/* is protected.

  if (isProtected && !token) {
    const loginUrl = new URL(`/${country}/${language}/login`, request.url);
    return NextResponse.redirect(loginUrl);
  }

  // 5. Check if the URL already has the dynamic segments
  // This regex checks if path starts with /[string]/[string]/
  const hasLocalePrefix =
    pathSegments.length >= 2 &&
    !["banner", "corporate", "partner"].includes(pathSegments[0]);

  if (!hasLocalePrefix && pathname !== "/") {
    // 6. Silently rewrite to the [country]/[langauge] structure
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
