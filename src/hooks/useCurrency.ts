"use client";

import { useParams } from "next/navigation";
import { countryCurrencyMap } from "@/lib/utils/country";

export function useCurrency() {
  const params = useParams();
  const countryCode = ((params?.country as string) || "us").toUpperCase();
  const info = countryCurrencyMap[countryCode] || { symbol: "$", code: "USD" };
  return { symbol: info.symbol, code: info.code };
}
