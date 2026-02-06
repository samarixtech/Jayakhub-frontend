"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface CLCContextType {
  country: string;
  currency: string;
  language: string;
  setCLC: (data: { country: string; currency: string; language: string }) => void;
}

const CLCContext = createContext<CLCContextType | undefined>(undefined);

export const CLCProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState({
    country: "US",
    currency: "$",
    language: "en",
  });

  const setCLC = (data: { country: string; currency: string; language: string }) => {
    setState(data);
  };

  return (
    <CLCContext.Provider value={{ ...state, setCLC }}>
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
