import React from "react";
import { Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";

interface ReviewSectionProps {
  icon: any;
  title: string;
  stepPath: string;
  children: React.ReactNode;
}

export const ReviewSection: React.FC<ReviewSectionProps> = ({
  icon: Icon,
  title,
  stepPath,
  children,
}) => {
  const router = useRouter();
  return (
    <Card className="p-6 border-none shadow-sm bg-gray-50/50 rounded-[24px]">
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
        <div className="flex items-center gap-2 text-emerald-bg">
          <Icon className="w-5 h-5" />
          <Typography className="font-bold text-lg text-gray-900">
            {title}
          </Typography>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-xs text-gray-400 hover:text-emerald-bg hover:bg-transparent"
          onClick={() => router.push(stepPath)}
        >
          <Edit className="w-3 h-3 mr-1" />
          Edit
        </Button>
      </div>
      <div className="space-y-2">{children}</div>
    </Card>
  );
};

export const ReviewInfoRow = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => (
  <div className="grid grid-cols-3 gap-2 py-1">
    <Typography className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
      {label}
    </Typography>
    <Typography className="text-sm font-medium text-gray-700 col-span-2 break-all">
      {value || "—"}
    </Typography>
  </div>
);
