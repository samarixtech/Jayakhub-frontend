import React from "react";
import { Edit, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

interface ReviewSectionProps {
  icon: any;
  title: string;
  stepPath: string;
  children: React.ReactNode;
  className?: string;
}

export const ReviewContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <div className="bg-white rounded-[32px] border border-gray-100 p-6 md:p-8 shadow-sm space-y-10">
    {children}
  </div>
);

export const ReviewSection: React.FC<ReviewSectionProps> = ({
  icon: Icon,
  title,
  stepPath,
  children,
  className,
}) => {
  const router = useRouter();
  const t = useTranslations("Onboarding.reviewComponents");
  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-orange-50 text-brand-orange">
            <Icon className="w-5 h-5" />
          </div>
          <Typography className="font-bold text-lg text-navy">
            {title}
          </Typography>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-xs text-navy hover:text-brand-orange hover:bg-transparent font-bold cursor-pointer"
          onClick={() => router.push(stepPath)}
        >
          <Edit className="w-3.5 h-3.5 mr-1" />
          {t("edit")}
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
    </div>
  );
};

export const ReviewField = ({
  label,
  value,
  className,
  fullWidth = false,
}: {
  label: string;
  value?: string | React.ReactNode;
  className?: string;
  fullWidth?: boolean;
}) => (
  <div
    className={cn(
      "bg-gray-50/50 rounded-2xl p-4 flex flex-col gap-1 border border-transparent hover:border-gray-100 transition-colors",
      fullWidth ? "md:col-span-2" : "",
      className,
    )}
  >
    <Typography className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
      {label}
    </Typography>
    <Typography className="text-sm font-bold text-navy break-all">
      {value || "—"}
    </Typography>
  </div>
);

export const ReviewDocField = ({
  label,
  status = "UPLOADED",
  className,
}: {
  label: string;
  status?: "UPLOADED" | "VERIFIED" | "PENDING";
  className?: string;
}) => {
  const t = useTranslations("Onboarding.reviewComponents");
  return (
    <div
      className={cn(
        "bg-gray-50/50 rounded-2xl p-4 flex items-center justify-between border border-transparent md:col-span-2",
        className,
      )}
    >
      <Typography className="text-sm font-bold text-navy">
        {label}
      </Typography>
      <div
        className={cn(
          "px-3 py-1 rounded-full text-[10px] font-black tracking-wider flex items-center gap-1",
          status === "VERIFIED"
            ? "bg-orange-50 text-brand-orange"
            : "bg-orange-50/60 text-brand-orange",
        )}
      >
        {status === "VERIFIED" && <Check className="w-3 h-3" />}
        {t(status.toLowerCase())}
      </div>
    </div>
  );
};
