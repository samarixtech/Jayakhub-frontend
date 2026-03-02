"use client";
import { Card, CardContent } from "@/components/ui/card";
import { OnboardingHeader } from "../OnboardingHeader";
import { StepperProgress } from "../StepperProgress";
import { useOnboarding } from "../OnboardingContext";
import StepOwnerInfo from "./steps/StepOwnerInfoView";
import StepRestaurantInfo from "./steps/StepRestaurantInfoView";
import StepBrandAssets from "./steps/StepBrandAssetsView";
import StepSchedule from "./steps/StepScheduleView";
import StepKyc from "./steps/StepKycView";
import StepBankDetails from "./steps/StepBankDetailsView";

export function RestaurantOnboardingView() {
  const { currentStep, goToStep, prevStep, logoPreview } = useOnboarding();

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StepOwnerInfo />;
      case 2:
        return <StepRestaurantInfo />;
      case 3:
        return <StepBrandAssets />;
      case 4:
        return <StepSchedule />;
      case 5:
        return <StepKyc />;
      case 6:
        return <StepBankDetails />;
      default:
        return <StepOwnerInfo />;
    }
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 flex flex-col items-center justify-center bg-gray-50/50">
      <Card className="w-full max-w-4xl border-none shadow-xl rounded-[40px] bg-white overflow-hidden p-8 sm:p-12 lg:p-16">
        <OnboardingHeader
          logoPreview={logoPreview}
          onBack={prevStep}
          showBack={currentStep > 1}
        />

        <StepperProgress currentStep={currentStep} onStepClick={goToStep} />

        <CardContent className="p-0 mt-12 bg-white">{renderStep()}</CardContent>
      </Card>

      <footer className="mt-8 text-center text-gray-400 text-xs">
        <p>© 2026 IFDP Restaurant Solutions. Built for speed and flavor.</p>
      </footer>
    </div>
  );
}
