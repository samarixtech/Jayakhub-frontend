"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import { getDefaultCountryData } from "@/lib/utils/country";

interface CLCContextType {
  country: string;
  currency: string;
  currencyCode: string;
  language: string;
  setCLC: (data: {
    country: string;
    currency: string;
    language: string;
  }) => void;
  updateCountry: (countryCode: string) => void;
}

const CLCContext = createContext<CLCContextType | undefined>(undefined);

export const CLCProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState(() => {
    // Read USER_COUNTRY cookie on first render to avoid the $ flash on reload
    let countryCode = "US";
    let language = "en";
    if (typeof document !== "undefined") {
      const cookies = document.cookie.split(";").reduce(
        (acc, c) => {
          const [k, v] = c.trim().split("=");
          acc[k] = decodeURIComponent(v ?? "");
          return acc;
        },
        {} as Record<string, string>,
      );
      if (cookies["USER_COUNTRY"])
        countryCode = cookies["USER_COUNTRY"].toUpperCase();
      if (cookies["NEXT_LOCALE"]) language = cookies["NEXT_LOCALE"];
    }
    const countryData = getDefaultCountryData(countryCode);
    return {
      country: countryData.code,
      currency: countryData.currencySymbol,
      currencyCode: countryData.currencyCode,
      language,
    };
  });

  const setCLC = (data: {
    country: string;
    currency: string;
    language: string;
  }) => {
    const countryData = getDefaultCountryData(data.country);
    setState({
      ...data,
      currency: countryData.currencySymbol,
      currencyCode: countryData.currencyCode,
    });
  };

  const updateCountry = (countryCode: string) => {
    const countryData = getDefaultCountryData(countryCode);
    setState((prev) => ({
      ...prev,
      country: countryData.code,
      currency: countryData.currencySymbol,
      currencyCode: countryData.currencyCode,
    }));
  };

  return (
    <CLCContext.Provider value={{ ...state, setCLC, updateCountry }}>
      {children}
    </CLCContext.Provider>
  );
};

export const useCLC = () => {
  const context = useContext(CLCContext);
  if (!context) {
    throw new Error("useCLC must be used within a CLCProvider");
  }

  // Helper to format currency dynamically without repeating currencyCode & language
  const formatPrice = (amount: number | string) => {
    // We import dynamically or just use the logic directly here to avoid circular dep risks
    const numericAmount =
      typeof amount === "string" ? parseFloat(amount) : amount;
    if (isNaN(numericAmount)) return "0.00";
    return new Intl.NumberFormat(context.language || "en-US", {
      style: "currency",
      currency: context.currencyCode.toUpperCase(),
    }).format(numericAmount);
  };

  return { ...context, formatPrice };
};
