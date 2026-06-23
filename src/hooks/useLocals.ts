"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import api from "@/components/services/api";
import { useLocale as useNextIntlLocale } from "next-intl";

/* ---------- API TYPES ---------- */

interface DetectApiResponse {
  meta: {
    status: number;
    message: string;
  };
  data: {
    country: string;
    code: string;
    language: string;
    token: string;
    isActive: boolean;
  };
}

interface Locale {
  country: string;
  countryCode: string;
  language: string;
  dir: "rtl" | "ltr";
  loading: boolean;
  error?: string;
}

/* ---------- RTL LANGUAGES ---------- */
const RTL_LANGS = ["ar", "ur", "fa", "he"];

export default function useLocale(): Locale {
  const nextIntlLocale = useNextIntlLocale();
  const [country, setCountry] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [language, setLanguage] = useState(nextIntlLocale);
  const [dir, setDir] = useState<"rtl" | "ltr">(
    RTL_LANGS.includes(nextIntlLocale) ? "rtl" : "ltr"
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();

  // Reactively synchronize language and direction when the next-intl locale changes
  useEffect(() => {
    if (nextIntlLocale) {
      setLanguage(nextIntlLocale);
      setDir(RTL_LANGS.includes(nextIntlLocale) ? "rtl" : "ltr");
    }
  }, [nextIntlLocale]);

  function applyFallback() {
    setCountry("pk");
    setCountryCode("pk");
    setLanguage("en");
    setDir("ltr");

    Cookies.set("USER_COUNTRY", "pk", { expires: 365 });
    Cookies.set("NEXT_LOCALE", "en", { expires: 365 });
  }

  useEffect(() => {
    async function fetchLocale() {
      // 1. Check Cookies FIRST
      const existingCountry = Cookies.get("USER_COUNTRY");
      const existingLang = Cookies.get("NEXT_LOCALE");

      if (existingCountry && existingLang) {
        setCountry(existingCountry);
        setCountryCode(existingCountry);
        setLanguage(existingLang);
        setDir(RTL_LANGS.includes(existingLang) ? "rtl" : "ltr");
        setLoading(false);
        return; // EXIT EARLY - NO API CALL
      }

      // 2. Only API if Cookies Missing (should be rare due to middleware/root page)
      try {
        const res = await api.get<DetectApiResponse>("/detect", {
          timeout: 5000,
        });

        const data = res.data?.data;

        if (!data || !data.isActive) {
          throw new Error("Locale detection inactive");
        }

        const lang = data.language || "en";
        const direction: "rtl" | "ltr" = RTL_LANGS.includes(lang)
          ? "rtl"
          : "ltr";

        setCountry(data.code);
        setCountryCode(data.code);
        setLanguage(lang);
        setDir(direction);

        Cookies.set("USER_COUNTRY", data.code.toLowerCase(), {
          expires: 365,
        });
        Cookies.set("NEXT_LOCALE", lang.toLowerCase(), {
          expires: 365,
        });

        
      } catch (err: any) {
        console.error("❌ Locale detection failed (Client):", err.message);
        setError(err.message);
        applyFallback();
      } finally {
        setLoading(false);
      }
    }

    fetchLocale();
  }, []);

  return {
    country,
    countryCode,
    language,
    dir,
    loading,
    error,
  };
}
