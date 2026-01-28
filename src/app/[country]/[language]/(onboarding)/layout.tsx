"use client";

import { usePathname } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { OnboardingHeader } from "@/components/modules/restaurant/onboarding/OnboardingHeader";
import { StepperProgress } from "@/components/modules/restaurant/onboarding/StepperProgress";
import {
  OnboardingProvider,
  useOnboarding,
} from "@/components/modules/restaurant/onboarding/OnboardingContext";
import { Typography } from "@/components/ui/typography";

// Inner component to consume context
const OnboardingLayoutContent = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const pathname = usePathname();
  const { logoPreview } = useOnboarding();

  // Determine current step based on pathname
  let currentStep = 1;
  if (pathname.includes("step-owner-info")) currentStep = 1;
  else if (pathname.includes("step-restaurant-info")) currentStep = 2;
  else if (pathname.includes("step-license")) currentStep = 3;
  else if (pathname.includes("step-schedule")) currentStep = 4;
  else if (pathname.includes("step-kyc")) currentStep = 5;

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-6 flex flex-col items-center justify-center">
      <div className="w-full max-w-4xl mb-8 text-center">
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

      <Card className="w-full max-w-4xl border-none shadow-xl shadow-gray-200/50 rounded-[40px] bg-white overflow-hidden p-8 md:p-12">
        <OnboardingHeader logoPreview={logoPreview} />
        <StepperProgress currentStep={currentStep} />

        <CardContent className="p-0">{children}</CardContent>
      </Card>
    </div>
  );
};

export default function RestaurantOnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <OnboardingProvider>
      <OnboardingLayoutContent>{children}</OnboardingLayoutContent>
    </OnboardingProvider>
  );
}
