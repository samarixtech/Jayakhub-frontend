"use client";
import { usePathname, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { OnboardingHeader } from "@/components/modules/restaurant/onboarding/OnboardingHeader";
import { StepperProgress } from "@/components/modules/restaurant/onboarding/StepperProgress";
import {
  OnboardingProvider,
  useOnboarding,
} from "@/components/modules/restaurant/onboarding/OnboardingContext";
import { Typography } from "@/components/ui/typography";
import { toast } from "react-hot-toast";
import { useTranslations } from "next-intl";

// Inner component to consume context
const OnboardingLayoutContent = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const pathname = usePathname();
  const { logoPreview } = useOnboarding();
  const t = useTranslations("Onboarding.layout");

  const router = useRouter();

  // Determine current step based on pathname
  let currentStep = 1;
  if (pathname.includes("step-owner-info")) currentStep = 1;
  else if (pathname.includes("step-restaurant-info")) currentStep = 2;
  else if (pathname.includes("step-brand-assets")) currentStep = 3;
  else if (pathname.includes("step-schedule")) currentStep = 4;
  else if (pathname.includes("step-kyc")) currentStep = 5;
  else if (pathname.includes("step-bank-details")) currentStep = 6;
  else if (pathname.includes("step-review")) currentStep = 7;

  const isStepComplete = (stepId: number) => {
    if (typeof window === "undefined") return false;
    switch (stepId) {
      case 1:
        return !!localStorage.getItem("onboarding_owner_info");
      case 2:
        return !!localStorage.getItem("onboarding_restaurant_info");
      case 3:
        return !!localStorage.getItem("onboarding_brand_assets_previews");
      case 4:
        return !!localStorage.getItem("onboarding_schedule_info");
      case 5:
        return localStorage.getItem("onboarding_kyc_completed") === "true";
      case 6:
        return !!localStorage.getItem("onboarding_bank_details");
      default:
        return true;
    }
  };

  const handleStepClick = (stepId: number) => {
    if (stepId > currentStep) {
      if (!isStepComplete(currentStep)) {
        toast.error(t("incompleteStepError"));
        return;
      }
    }

    let path = "";
    switch (stepId) {
      case 1:
        path = "step-owner-info";
        break;
      case 2:
        path = "step-restaurant-info";
        break;
      case 3:
        path = "step-brand-assets";
        break;
      case 4:
        path = "step-schedule";
        break;
      case 5:
        path = "step-kyc";
        break;
      case 6:
        path = "step-bank-details";
        break;
      case 7:
        path = "step-review";
        break;
      default:
        return;
    }
    router.push(`/restaurant/onboarding/${path}`);
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-0 sm:p-6 flex flex-col items-center justify-center">
      <div className="w-full max-w-4xl mb-8 text-center">
        <Typography
          variant="h2"
          className="text-[28px] font-black text-[#111827]"
        >
          {t("title")}
        </Typography>
        <Typography className="text-gray-500 text-base mt-1">
          {t("subtitle")}
        </Typography>
      </div>

      <Card className="w-full max-w-4xl border-none shadow-xl shadow-gray-200/50 rounded-[40px] bg-white overflow-hidden p-4 sm:p-12">
        <OnboardingHeader
          logoPreview={logoPreview}
          onBack={() => router.back()}
          showBack={currentStep > 1}
        />
        <StepperProgress
          currentStep={currentStep}
          onStepClick={handleStepClick}
        />

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


