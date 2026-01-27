"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { Card, CardContent } from "@/components/ui/card";
import { OnboardingHeader } from "./OnboardingHeader";
import { StepperProgress } from "./StepperProgress";
import { StepOwnerInfo } from "./steps/StepOwnerInfo";
import { StepRestaurantInfo } from "./steps/StepRestaurantInfo";
import { StepSchedule } from "./steps/StepSchedule";
import { StepKyc } from "./steps/StepKyc";
export default function RestaurantOnboarding() {
  const [currentStep, setCurrentStep] = useState(1); // 1 == initial form step

  // State for Images
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 4));
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

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StepOwnerInfo />;
      case 2:
        return (
          <StepRestaurantInfo
            logoPreview={logoPreview}
            onLogoUpload={handleLogoUpload}
            onRemoveLogo={handleRemoveLogo}
            bannerPreview={bannerPreview}
            onBannerUpload={handleBannerUpload}
            onRemoveBanner={handleRemoveBanner}
          />
        );
      case 3:
        return <StepSchedule />;
      case 4:
        return <StepKyc />;
      default:
        return <StepOwnerInfo />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-6 flex flex-col">
      <div className="w-full max-w-full mb-8">
        <Typography
          variant="h2"
          className="text-[28px] font-black text-[#111827]"
        >
          Complete Profile
        </Typography>
        <Typography className="text-gray-500 text-base mt-1">
          Please finish setting up your restaurant to start accepting orders.
        </Typography>
      </div>

      <Card className="w-full max-w-full border-none shadow-sm rounded-[40px] bg-white overflow-hidden p-12">
        <OnboardingHeader logoPreview={logoPreview} />
        <StepperProgress currentStep={currentStep} />

        <CardContent className="p-0">
          {renderStep()}

          {/* Action Buttons */}
          <div className="mt-4 flex items-center justify-between border-t border-gray-50">
            {currentStep > 1 ? (
              <Button
                onClick={prevStep}
                variant="ghost"
                className="text-gray-400 font-bold hover:bg-transparent"
              >
                Back
              </Button>
            ) : (
              <div />
            )}

            <div className="flex gap-4 items-center">
              <Button
                onClick={nextStep}
                className="bg-[#346853] text-white px-10 h-12 rounded-2xl font-bold hover:bg-[#2a5443] shadow-md shadow-emerald-900/10"
              >
                {currentStep === 4 ? "Complete Setup" : "Continue"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
