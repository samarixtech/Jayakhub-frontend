import React from "react";
import { Sliders } from "lucide-react";
import { Typography } from "@/components/ui/typography";
import { Skeleton } from "@/components/ui/skeleton";

interface VariantsHeaderProps {
  groupsCount: number;
  optionsCount: number;
  isLoading: boolean;
}

export const VariantsHeader: React.FC<VariantsHeaderProps> = ({
  groupsCount,
  optionsCount,
  isLoading,
}) => {
  return (
    <div className="bg-[#E2F1E8] rounded-2xl p-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm text-[#1F4D36]">
          <Sliders className="w-6 h-6 rotate-90" />
        </div>
        <div>
          <Typography
            variant="h3"
            className="text-lg font-bold text-gray-900 mb-1"
          >
            Manage Your Item Variants
          </Typography>
          <Typography className="text-sm text-gray-600 max-w-md">
            Create reusable variant groups like sizes, spice levels, or add-ons.
            Apply them to multiple menu items for consistent pricing.
          </Typography>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center gap-3">
          <Skeleton className="h-16 w-24 rounded-xl" />
          <Skeleton className="h-16 w-24 rounded-xl" />
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <div className="bg-white px-6 py-3 rounded-xl shadow-sm text-center min-w-[100px]">
            <Typography className="text-2xl font-bold text-[#1F4D36] block leading-none">
              {groupsCount}
            </Typography>
            <Typography className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
              Groups
            </Typography>
          </div>
          <div className="bg-white px-6 py-3 rounded-xl shadow-sm text-center min-w-[100px]">
            <Typography className="text-2xl font-bold text-[#1F4D36] block leading-none">
              {optionsCount}
            </Typography>
            <Typography className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
              Options
            </Typography>
          </div>
        </div>
      )}
    </div>
  );
};
