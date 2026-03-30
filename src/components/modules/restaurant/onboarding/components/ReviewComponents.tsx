import React from "react";
import { Edit, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
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
  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-emerald-bg">
          <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
            <Icon className="w-5 h-5" />
          </div>
          <Typography className="font-bold text-lg text-gray-900">
            {title}
          </Typography>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-xs text-gray-400 hover:text-emerald-bg hover:bg-transparent font-medium"
          onClick={() => router.push(stepPath)}
        >
          <Edit className="w-3.5 h-3.5 mr-1" />
          Edit
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
    <Typography className="text-sm font-medium text-gray-900 break-all">
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
}) => (
  <div
    className={cn(
      "bg-gray-50/50 rounded-2xl p-4 flex items-center justify-between border border-transparent md:col-span-2",
      className,
    )}
  >
    <Typography className="text-sm font-medium text-gray-700">
      {label}
    </Typography>
    <div
      className={cn(
        "px-3 py-1 rounded-full text-[10px] font-black tracking-wider flex items-center gap-1",
        status === "VERIFIED"
          ? "bg-emerald-50 text-emerald-600"
          : "bg-emerald-50/50 text-emerald-600/70",
      )}
    >
      {status === "VERIFIED" && <Check className="w-3 h-3" />}
      {status}
    </div>
  </div>
);
