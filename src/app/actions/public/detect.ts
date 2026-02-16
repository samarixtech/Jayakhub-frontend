"use server";

import { cookies } from "next/headers";
import api from "@/components/services/api";

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
    console.log("Server Action: Detecting locale using API helper");

    // Using api helper instance
    const res = await api.get<{ data: DetectApiResult }>("/detect");
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
        cookieStore.set("NEXT_CURRENCY", "$", {
          // Assuming default currency, API might provide it later
          path: "/",
          maxAge: 60 * 60 * 24 * 365,
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
