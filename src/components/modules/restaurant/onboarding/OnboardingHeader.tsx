import { ChevronLeft, Utensils } from "lucide-react";
import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useTranslations } from "next-intl";

interface OnboardingHeaderProps {
  logoPreview: string | null;
  onBack?: () => void;
  showBack?: boolean;
}

export const OnboardingHeader = ({
  logoPreview,
  onBack,
  showBack,
}: OnboardingHeaderProps) => {
  const t = useTranslations("Onboarding.header");
  return (
    <div className="flex flex-col items-center relative w-full">
      {showBack && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="absolute left-0 top-0 h-10 px-2 rounded-xl hover:bg-gray-100 flex items-center gap-2 text-gray-600 font-bold"
        >
          <ChevronLeft className="h-5 w-5" />
          {t("back")}
        </Button>
      )}
      <div className="h-16 w-16 bg-[#346853] rounded-2xl flex items-center justify-center mb-4 overflow-hidden relative shadow-lg shadow-emerald-900/10">
        {logoPreview ? (
          <Image
            width={200}
            height={200}
            src={logoPreview}
            alt="Restaurant Logo"
            className="h-full w-full object-cover animate-in zoom-in duration-300"
          />
        ) : (
          <Utensils className="text-white h-8 w-8 animate-in fade-in duration-300" />
        )}
      </div>
      <Typography variant="h3" className="text-2xl font-black">
        {t("title")}
      </Typography>
      <Typography className="text-[#64748B] text-sm mt-1">
        {t("subtitle")}
      </Typography>
    </div>
  );
};
