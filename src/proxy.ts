import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import getClientIp from "./lib/getClientIp";
import api, { isSessionExpiredPayload, SESSION_EXPIRED_FLAG_COOKIE } from "./components/services/api";

const AUTH_COOKIE_NAMES = ["role", "planKeywords", "isExpired", "isCancelled", "restaurantId", "planCheckedAt"];

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
): Promise<Record<string, string> | null | "EXPIRED"> {
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

    // /my-restaurant is authenticated by the same token, so a killed session
    // (e.g. deactivated from User Management) surfaces here too — this is
    // the one path that runs without any client component around to show
    // the toast itself, so the caller has to force a redirect instead.
    if (isSessionExpiredPayload(res.data)) return "EXPIRED";

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
      // Checks 7 proxy header variants (Cloudflare, Akamai, generic LBs,
      // etc.) and already filters out loopback addresses — a broader net
      // than the old 2-header check, which was leaving clientIp empty in
      // production whenever the reverse proxy used a different header name.
      const clientIp = (await getClientIp(request.headers)) || "";

      const outgoingHeaders: Record<string, string> = clientIp
        ? { "x-forwarded-for": clientIp, "x-real-ip": clientIp }
        : {};

      // Local dev has no real reverse proxy in front of it, so clientIp
      // resolves to nothing — the backend can't geolocate that. Set
      // DEV_TEST_IP in .env(.local) to a real public IP to simulate a
      // location locally; the backend's geoDetectMiddleware checks
      // x-test-ip ahead of x-forwarded-for/x-real-ip.
      if (process.env.NODE_ENV !== "production" && !clientIp && process.env.DEV_TEST_IP) {
        outgoingHeaders["x-test-ip"] = process.env.DEV_TEST_IP;
      }

      console.log(
        "[proxy] sending IP headers to backend /detect:",
        outgoingHeaders,
      );

      const detectRes = (await api.get("/detect", {
        headers: outgoingHeaders,
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
      // A session killed server-side (SSR/Server Action detecting a 403
      // "Session Expired") clears cookies before any client toast can fire —
      // it leaves this short-lived flag behind so the login page can still
      // show the toast once it loads.
      const wasSessionExpired =
        request.cookies.get(SESSION_EXPIRED_FLAG_COOKIE)?.value === "1";
      const loginUrl = new URL(
        `/${country}/${language}/login${wasSessionExpired ? "?reason=session-expired" : ""}`,
        request.url,
      );
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
      [...AUTH_COOKIE_NAMES, SESSION_EXPIRED_FLAG_COOKIE].forEach((name) => {
        response.cookies.delete(name);
      });
      return response;
    }

    // Role-based access control
    if (isCustomerRoute && role !== "customer") {
      let redirectPath = "login";
      if (role === "restaurant_owner" || role === "admin" || role === "manager") redirectPath = "restaurant/dashboard";
      if (role === "cashier") redirectPath = "restaurant/pos";
      if (role === "kitchen") redirectPath = "restaurant/pos/orders";

      return NextResponse.redirect(
        new URL(`/${country}/${language}/${redirectPath}`, request.url),
      );
    }

    if (isRestaurantRoute) {
      if (
        role !== "restaurant_owner" &&
        role !== "cashier" &&
        role !== "admin" &&
        role !== "manager" &&
        role !== "kitchen"
      ) {
        const redirectPath =
          role === "customer" ? "customer/dashboard" : "login";
        return NextResponse.redirect(
          new URL(`/${country}/${language}/${redirectPath}`, request.url),
        );
      }

      // Restrict cashiers and kitchen staff exclusively to the POS routes
      if (
        (role === "cashier" || role === "kitchen") &&
        !pathSegments.includes("pos")
      ) {
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
      if (planCookies === "EXPIRED") {
        const loginUrl = new URL(
          `/${country}/${language}/login?reason=session-expired`,
          request.url,
        );
        const expiredResponse = NextResponse.redirect(loginUrl);
        ["token", ...AUTH_COOKIE_NAMES].forEach((name) => {
          expiredResponse.cookies.delete(name);
        });
        return expiredResponse;
      }
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