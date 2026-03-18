"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { getDefaultCountryData } from "@/lib/utils/country";

interface CLCContextType {
  country: string;
  currency: string;
  currencyCode: string;
  language: string;
  setCLC: (data: { country: string; currency: string; language: string }) => void;
  updateCountry: (countryCode: string) => void;
}

const CLCContext = createContext<CLCContextType | undefined>(undefined);

export const CLCProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState({
    country: "US",
    currency: "$",
    currencyCode: "usd",
    language: "en",
  });

  const setCLC = (data: { country: string; currency: string; language: string }) => {
    const countryData = getDefaultCountryData(data.country);
    setState({
      ...data,
      currency: countryData.currencySymbol,
      currencyCode: countryData.currencyCode,
    });
  };

  const updateCountry = (countryCode: string) => {
    const countryData = getDefaultCountryData(countryCode);
    setState(prev => ({
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
  return context;
};
