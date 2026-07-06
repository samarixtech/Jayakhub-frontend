"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import Cookies from "js-cookie";
import { countryCurrencyMap } from "@/lib/utils/country";

export default function DetectLocationClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function detect() {
      try {
        // If cookies already set, skip detection
        const existingCountry = Cookies.get("USER_COUNTRY");
        const existingLang = Cookies.get("NEXT_LOCALE");

        let country = "pk";
        let language = "en";

        if (existingCountry && existingLang) {
          country = existingCountry;
          language = existingLang;
        } else {
          // Call detect directly from browser so backend sees the user's real IP
          const baseUrl =
            process.env.NEXT_PUBLIC_BASE_URL || "https://app.jayakhub.com/api/v1";
          const res = await fetch(`${baseUrl}/detect`);
          const json = await res.json();
          const data = json?.data;

          console.log("[DetectLocationClient] detect response:", data);

          if (data?.isActive) {
            country = data.code.toLowerCase();
            language = (data.language || "en").toLowerCase();
          }

          const currencySymbol =
            countryCurrencyMap[country.toUpperCase()]?.symbol || "$";

          const cookieOpts = {
            expires: 365,
            path: "/",
            secure: location.protocol === "https:",
            sameSite: "Lax" as const,
          };

          Cookies.set("USER_COUNTRY", country, cookieOpts);
          Cookies.set("NEXT_LOCALE", language, cookieOpts);
          Cookies.set("NEXT_CURRENCY", currencySymbol, cookieOpts);
        }

        if (!mounted) return;

        const currentParams = searchParams.toString();
        const url = `/${country}/${language}/restaurants${currentParams ? `?${currentParams}` : ""}`;
        router.replace(url);
      } catch (err) {
        console.error("Client detection error:", err);
        if (!mounted) return;
        setError("Failed to detect location. Redirecting...");
        setTimeout(() => {
          const currentParams = searchParams.toString();
          router.replace(`/pk/en/restaurants${currentParams ? `?${currentParams}` : ""}`);
        }, 1000);
      }
    }

    detect();

    return () => {
      mounted = false;
    };
  }, [router, searchParams]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <p className="text-red-500 mb-2">{error}</p>
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-emerald-600" />
        <p className="text-gray-500 text-sm font-medium animate-pulse">
          Detecting your location...
        </p>
      </div>
    </div>
  );
}
