import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
// import getClientIp from "./lib/getClientIp";
import api from "./components/services/api";

// Don't hit /my-restaurant on every single request to a /restaurant/* route
// (middleware also runs on RSC data-fetch/prefetch requests, not just full
// page loads) — only re-check once this many ms have passed since the last check.
const PLAN_CHECK_INTERVAL_MS = 60_000;

// Refreshes isExpired/isCancelled from the authoritative /my-restaurant
// endpoint, throttled via a timestamp cookie. Returns the cookies to set on
// the eventual response, or null if the check was skipped/failed (in which
// case the existing cookie values — however stale — are left untouched).
async function getPlanCookieUpdates(
  request: NextRequest,
): Promise<Record<string, string> | null> {
  const token = request.cookies.get("token")?.value;
  if (!token) return null;

  const lastChecked = request.cookies.get("planCheckedAt")?.value;
  const isStale =
    !lastChecked || Date.now() - Number(lastChecked) > PLAN_CHECK_INTERVAL_MS;
  if (!isStale) return null;

  try {
    const res = (await api.get("/my-restaurant", {
      headers: { Authorization: `Bearer ${token}` },
    })) as any;
    const data = res.data?.data;
    if (!data) return null;

    const isExpired = data?.isExpired ?? data?.activePlan?.isExpired ?? false;
    const isCancelled = data?.isCancel ?? data?.activePlan?.isCancel ?? false;

    return {
      isExpired: isExpired ? "true" : "false",
      isCancelled: isCancelled ? "true" : "false",
      planCheckedAt: String(Date.now()),
    };
  } catch (error) {
    console.error("[proxy] /my-restaurant plan check failed:", error);
    return null;
  }
}

export async function proxy(request: NextRequest) {
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

  // 2. Get Country, Language from Cookies
  const cookieCountry = request.cookies.get("USER_COUNTRY")?.value;
  const cookieLanguage = request.cookies.get("NEXT_LOCALE")?.value;

  let country: string = cookieCountry || "";
  let language: string = cookieLanguage || "";

  // 3. If cookies are missing, call detect API
  if (!country || !language) {
    try {
      const clientIp =
        request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
        request.headers.get("x-real-ip") ||
        "";

      console.log("[proxy] detecting location for IP:", clientIp || "unknown");

      const detectRes = (await api.get("/detect", {
        headers: clientIp
          ? { "x-forwarded-for": clientIp, "x-real-ip": clientIp }
          : {},
      })) as any;

      const data = detectRes.data?.data;
      if (data && data.isActive) {
        country = (data.code || "iq").toLowerCase();
        language = (data.language || "en").toLowerCase();
      } else {
        if (!country) country = "iq";
        if (!language) language = "en";
      }
    } catch (error) {
      console.error("Middleware: detect API error:", error);
      if (!country) country = "iq";
      if (!language) language = "en";
    }
  }

  // 4. Analyze Path Segments
  const pathSegments = pathname.split("/").filter(Boolean);

  // Auth Protection
  const token = request.cookies.get("token")?.value;
  const rawRole = request.cookies.get("role")?.value;
  const role = rawRole ? rawRole.toLowerCase() : undefined;

  const isCustomerRoute = pathSegments.some(
    (segment) => segment === "customer",
  );
  const isRestaurantRoute = pathSegments.some(
    (segment) => segment === "restaurant",
  );
  const isProtected = isCustomerRoute || isRestaurantRoute;

  if (isProtected) {
    if (!token) {
      const loginUrl = new URL(`/${country}/${language}/login`, request.url);
      const response = NextResponse.redirect(loginUrl);
      response.cookies.set("USER_COUNTRY", country, {
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
      });
      response.cookies.set("NEXT_LOCALE", language, {
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
      });
      // No valid token — ensure any stale auth cookies (e.g. left over from
      // a session killed server-side after a 403 "Session Expired") are
      // wiped too, so the client is in a fully logged-out state.
      ["role", "planKeywords", "isExpired", "isCancelled", "restaurantId", "planCheckedAt"].forEach((name) => {
        response.cookies.delete(name);
      });
      return response;
    }

    // Role-based access control
    if (isCustomerRoute && role !== "customer") {
      let redirectPath = "login";
      if (role === "restaurant_owner" || role === "admin" || role === "manager") redirectPath = "restaurant/dashboard";
      if (role === "cashier") redirectPath = "restaurant/pos";

      return NextResponse.redirect(
        new URL(`/${country}/${language}/${redirectPath}`, request.url),
      );
    }

    if (isRestaurantRoute) {
      if (
        role !== "restaurant_owner" &&
        role !== "cashier" &&
        role !== "admin" &&
        role !== "manager"
      ) {
        const redirectPath =
          role === "customer" ? "customer/dashboard" : "login";
        return NextResponse.redirect(
          new URL(`/${country}/${language}/${redirectPath}`, request.url),
        );
      }

      // Restrict cashiers exclusively to the POS route
      if (role === "cashier" && !pathSegments.includes("pos")) {
        return NextResponse.redirect(
          new URL(`/${country}/${language}/restaurant/pos`, request.url),
        );
      }
    }
  }

  // Check if the URL already has the valid format /[country]/[language]/...
  const hasCountry = pathSegments[0]?.length === 2;
  const hasLanguage = pathSegments[1]?.length === 2;

  if (hasCountry && hasLanguage) {
    const countryInUrl = pathSegments[0];
    const languageInUrl = pathSegments[1];

    if (
      countryInUrl !== countryInUrl.toLowerCase() ||
      languageInUrl !== languageInUrl.toLowerCase()
    ) {
      const url = request.nextUrl.clone();
      const segments = [...pathSegments];
      segments[0] = countryInUrl.toLowerCase();
      segments[1] = languageInUrl.toLowerCase();
      url.pathname = `/${segments.join("/")}`;
      return NextResponse.redirect(url);
    }

    // Ensure cookies are synced with URL
    const response = NextResponse.next();
    if (pathSegments[0] !== request.cookies.get("USER_COUNTRY")?.value) {
      response.cookies.set("USER_COUNTRY", pathSegments[0], {
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
      });
    }
    if (pathSegments[1] !== request.cookies.get("NEXT_LOCALE")?.value) {
      response.cookies.set("NEXT_LOCALE", pathSegments[1], {
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
      });
    }

    // Keep isExpired/isCancelled honest for restaurant routes — throttled,
    // so a purchase or an expiry is reflected within ~60s instead of only
    // ever refreshing at login.
    if (isRestaurantRoute) {
      const planCookies = await getPlanCookieUpdates(request);
      if (planCookies) {
        Object.entries(planCookies).forEach(([name, value]) => {
          response.cookies.set(name, value, {
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
          });
        });
      }
    }

    return response;
  }

  // 5. Handle Root Path "/"
  if (pathname === "/") {
    const url = request.nextUrl.clone();
    url.pathname = `/${country}/${language}/restaurants`;
    const response = NextResponse.redirect(url);
    response.cookies.set("USER_COUNTRY", country, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });
    response.cookies.set("NEXT_LOCALE", language, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });
    return response;
  }

  // 6. Handle Paths missing Country/Language (e.g. /restaurants -> /pk/ur/restaurants)
  const url = request.nextUrl.clone();
  url.pathname = `/${country}/${language}${pathname}`;
  const response = NextResponse.redirect(url);
  response.cookies.set("USER_COUNTRY", country, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
  response.cookies.set("NEXT_LOCALE", language, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};