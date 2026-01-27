"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface OnboardingContextType {
  logoPreview: string | null;
  setLogoPreview: (url: string | null) => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const OnboardingProvider = ({ children }: { children: ReactNode }) => {
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  return (
    <OnboardingContext.Provider value={{ logoPreview, setLogoPreview }}>
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error("useOnboarding must be used within an OnboardingProvider");
  }
  return context;
};
