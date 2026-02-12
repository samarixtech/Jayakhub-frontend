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

import StepBrandAssetsView from "./steps/StepBrandAssetsView";
import StepBankDetailsView from "./steps/StepBankDetailsView";

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
        return <StepOwnerInfo />;
      case 2:
        return <StepRestaurantInfo />;
      case 3:
        return <StepBrandAssetsView />;
      case 4:
        return <StepSchedule />;
      case 5:
        return <StepKyc />;
      case 6:
        return <StepBankDetailsView />;
      default:
        return <StepOwnerInfo />;
    }
  };

  return (
    <div className="min-h-screen  p-6 flex flex-col items-center justify-center">
      <Card className="w-full max-w-3xl border-none shadow-sm rounded-[32px] bg-white overflow-hidden p-8 sm:p-12">
        <OnboardingHeader
          logoPreview={logoPreview}
          onBack={prevStep}
          showBack={currentStep > 1}
        />
        <StepperProgress
          currentStep={currentStep}
          onStepClick={setCurrentStep}
        />

        <CardContent className="p-0 mt-8">{renderStep()}</CardContent>
      </Card>
    </div>
  );
}

export default RestaurantOnboardingContent;
