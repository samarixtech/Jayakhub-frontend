"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface OnboardingContextType {
  logoPreview: string | null;
  setLogoPreview: (url: string | null) => void;
  bannerPreview: string | null;
  setBannerPreview: (url: string | null) => void;
  // Store actual File objects for FormData upload
  logoFile: File | null;
  setLogoFile: (file: File | null) => void;
  bannerFile: File | null;
  setBannerFile: (file: File | null) => void;
  // Wizard Navigation
  currentStep: number;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(
  undefined,
);

export const OnboardingProvider = ({ children }: { children: ReactNode }) => {
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [currentStep, setCurrentStep] = useState(1);

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 7));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));
  const goToStep = (step: number) => setCurrentStep(step);

  return (
    <OnboardingContext.Provider
      value={{
        logoPreview,
        setLogoPreview,
        bannerPreview,
        setBannerPreview,
        logoFile,
        setLogoFile,
        bannerFile,
        setBannerFile,
        currentStep,
        nextStep,
        prevStep,
        goToStep,
      }}
    >
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
