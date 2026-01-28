"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { OnboardingHeader } from "./OnboardingHeader";
import { StepperProgress } from "./StepperProgress";
import StepOwnerInfo from "./steps/StepOwnerInfoView";
import StepRestaurantInfo from "./steps/StepRestaurantInfoView";
import StepSchedule from "./steps/StepScheduleView";
import StepKyc from "./steps/StepKycView";
import StepLicenseView from "./steps/StepLicenseView";

function RestaurantOnboardingContent() {
  const [currentStep, setCurrentStep] = useState(1); // 1 == initial form step

  // State for Images
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [licenseFile, setLicenseFile] = useState<File | null>(null);

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 5));

  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  // --- Image Handlers ---
  const handleLogoUpload = (file: File) => {
    const objectUrl = URL.createObjectURL(file);
    setLogoPreview(objectUrl);
  };
  const handleRemoveLogo = () => setLogoPreview(null);

  const handleBannerUpload = (file: File) => {
    const objectUrl = URL.createObjectURL(file);
    setBannerPreview(objectUrl);
  };
  const handleRemoveBanner = () => setBannerPreview(null);

  const handleLicenseUpload = (file: File) => {
    setLicenseFile(file);
  };
  const handleRemoveLicense = () => setLicenseFile(null);

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        console.log("RenderStep 1: Passing nextStep", nextStep);
        return <StepOwnerInfo onNext={nextStep} onBack={prevStep} />;
      case 2:
        return <StepRestaurantInfo onNext={nextStep} onBack={prevStep} />;
      case 3:
        return <StepLicenseView onNext={nextStep} onBack={prevStep} />;
      case 4:
        return <StepSchedule onNext={nextStep} onBack={prevStep} />;
      case 5:
        return <StepKyc onBack={prevStep} />; // Last step redirects

      default:
        return <StepOwnerInfo onNext={nextStep} onBack={prevStep} />;
    }
  };

  return (
    <div className="min-h-screen  p-6 flex flex-col items-center justify-center">
      <Card className="w-full max-w-3xl border-none shadow-sm rounded-[32px] bg-white overflow-hidden p-8 sm:p-12">
        <OnboardingHeader logoPreview={logoPreview} />
        <StepperProgress currentStep={currentStep} />

        <CardContent className="p-0 mt-8">{renderStep()}</CardContent>
      </Card>
    </div>
  );
}

// Ensure OnboardingProvider is imported if used, otherwise remove it or define it.
// Assuming OnboardingProvider is from ./OnboardingContext based on earlier context.
import { OnboardingProvider } from "./OnboardingContext";

export default function RestaurantOnboarding() {
  return (
    <OnboardingProvider>
      <RestaurantOnboardingContent />
    </OnboardingProvider>
  );
}
