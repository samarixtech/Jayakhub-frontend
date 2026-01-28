"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { OnboardingHeader } from "./OnboardingHeader";
import { StepperProgress } from "./StepperProgress";
import StepOwnerInfo from "./steps/StepOwnerInfoView";
import StepRestaurantInfo from "./steps/StepRestaurantInfoView";
import StepSchedule from "./steps/StepScheduleView";
import StepLicense from "./steps/StepLicenseView";
import StepKyc from "./steps/StepKycView";
import { OnboardingProvider, useOnboarding } from "./OnboardingContext";

function RestaurantOnboardingContent() {
  const [currentStep, setCurrentStep] = useState(1);
  const { logoPreview } = useOnboarding();

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 5));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StepOwnerInfo />;
      case 2:
        return <StepRestaurantInfo />;
      case 3:
        return <StepSchedule />;
      case 4:
        return <StepLicense />;
      case 5:
        return <StepKyc />;
      default:
        return <StepOwnerInfo />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-6 flex flex-col items-center justify-center">
      <Card className="w-full max-w-3xl border-none shadow-sm rounded-[32px] bg-white overflow-hidden p-8 sm:p-12">
        <OnboardingHeader logoPreview={logoPreview} />
        <StepperProgress currentStep={currentStep} />

        <CardContent className="p-0">
          {renderStep()}

          {/* Action Buttons */}
          <div className="mt-8 flex items-center justify-between border-t border-gray-50 pt-6">
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
                className="bg-[#346853] text-white px-8 h-12 rounded-xl font-bold hover:bg-[#2a5443] shadow-lg shadow-emerald-900/10 transition-all active:scale-95"
              >
                {currentStep === 5 ? "Complete Setup" : "Continue"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function RestaurantOnboarding() {
  return (
    <OnboardingProvider>
      <RestaurantOnboardingContent />
    </OnboardingProvider>
  );
}
