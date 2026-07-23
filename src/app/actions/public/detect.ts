"use server";

import { cookies, headers } from "next/headers";
import { serverApi } from "@/components/services/api";
import { countryCurrencyMap } from "@/lib/utils/country";
import getClientIp from "@/lib/getClientIp";

interface DetectApiResult {
  country: string;
  code: string;
  language: string;
  token?: string;
  isActive: boolean;
}

interface DetectResponse {
  success: boolean;
  data?: DetectApiResult;
  message?: string;
  fallback?: boolean;
}

export async function detectLocationAction(
  readOnly: boolean = false,
): Promise<DetectResponse> {
  const cookieStore = await cookies();
  const existingCountry = cookieStore.get("USER_COUNTRY")?.value;
  const existingLang = cookieStore.get("NEXT_LOCALE")?.value;

  // 1. Return from Cookies if available
  if (existingCountry && existingLang) {
    return {
      success: true,
      data: {
        country: "Unknown",
        code: existingCountry,
        language: existingLang,
        isActive: true,
      },
    };
  }

  // 2. Fetch from API if Cookies missing
  try {
    const headerStore = await headers();
    // Checks 7 proxy header variants (Cloudflare, Akamai, generic LBs, etc.)
    // and already filters out loopback addresses.
    const clientIp = (await getClientIp(headerStore)) || "";

    const outgoingHeaders: Record<string, string> = clientIp
      ? {
          "x-forwarded-for": clientIp,
          "x-real-ip": clientIp,
          "x-pm-ip": clientIp,
        }
      : {};

    // See proxy.ts for why this is needed locally — clientIp resolves to
    // nothing without a real reverse proxy in front of it. Safe to leave
    // keyed only on DEV_TEST_IP being set — it must never be present in the
    // real deployed environment's env config.
    if (!clientIp && process.env.DEV_TEST_IP) {
      outgoingHeaders["x-test-ip"] = process.env.DEV_TEST_IP;
    }

    console.log(
      "[detectLocationAction] sending IP headers to backend /detect:",
      outgoingHeaders,
    );

    const api = await serverApi();
    const res = await api.get<{ data: DetectApiResult }>("/detect", {
      headers: outgoingHeaders,
    });
    const json = res.data;
    const data = json.data;

    if (data && data.isActive) {
      const code = data.code.toLowerCase();
      const lang = (data.language || "en").toLowerCase();

      // 3. Set Cookies Securely (Only if not readOnly)
      if (!readOnly) {
        cookieStore.set("USER_COUNTRY", code, {
          path: "/",
          maxAge: 60 * 60 * 24 * 365, // 1 year
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
        });
        cookieStore.set("NEXT_LOCALE", lang, {
          path: "/",
          maxAge: 60 * 60 * 24 * 365,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
        });
        const currencySymbol =
          countryCurrencyMap[code.toUpperCase()]?.symbol || "$";
        cookieStore.set("NEXT_CURRENCY", currencySymbol, {
          path: "/",
          maxAge: 60 * 60 * 24 * 365,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
        });
      }
      return {
        success: true,
        data: { ...data, code, language: lang },
      };
    }

    return { success: false, message: "Detection inactive", fallback: true };
  } catch (error: any) {
    console.error("Server Action: Locale detection error:", error);
    // Return fallback Pakistan/Urdu if fails
    cookieStore.set("USER_COUNTRY", "pk", { path: "/" });
    cookieStore.set("NEXT_LOCALE", "en", { path: "/" }); // Default to EN

    return {
      success: true, // Treat as success for flow continuity
      data: {
        country: "Pakistan",
        code: "pk",
        language: "en",
        isActive: true,
      },
      fallback: true,
    };
  }
}

export async function getClientIpAction(): Promise<string | null> {
  const headerStore = await headers();
  const ip = await getClientIp(headerStore);
  if (!ip && process.env.DEV_TEST_IP) {
    return process.env.DEV_TEST_IP;
  }
  return ip;
}


