import { Utensils } from "lucide-react";
import { Typography } from "@/components/ui/typography";

interface OnboardingHeaderProps {
  logoPreview: string | null;
}

export const OnboardingHeader = ({ logoPreview }: OnboardingHeaderProps) => {
  return (
    <div className="flex flex-col items-center">
      <div className="h-16 w-16 bg-[#346853] rounded-2xl flex items-center justify-center mb-4 overflow-hidden relative shadow-lg shadow-emerald-900/10">
        {logoPreview ? (
          <img
            src={logoPreview}
            alt="Restaurant Logo"
            className="h-full w-full object-cover animate-in zoom-in duration-300"
          />
        ) : (
          <Utensils className="text-white h-8 w-8 animate-in fade-in duration-300" />
        )}
      </div>
      <Typography variant="h3" className="text-2xl font-black">
        Complete Your Profile
      </Typography>
      <Typography className="text-[#64748B] text-sm mt-1">
        Let&apos;s get your restaurant set up on JayakHub
      </Typography>
    </div>
  );
};
