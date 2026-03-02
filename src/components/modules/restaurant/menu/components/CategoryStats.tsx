import React from "react";
import { Shapes } from "lucide-react";
import { Typography } from "@/components/ui/typography";
import { Skeleton } from "@/components/ui/skeleton";

interface CategoryStatsProps {
  count: number;
  isLoading: boolean;
}

export const CategoryStats: React.FC<CategoryStatsProps> = ({
  count,
  isLoading,
}) => {
  return (
    <div className="bg-[#E2F1E8] rounded-2xl p-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm text-[#1F4D36]">
          <Shapes className="w-6 h-6" />
        </div>
        <div>
          <Typography
            variant="h3"
            className="text-lg font-bold text-gray-900 mb-1"
          >
            Organize Your Menu
          </Typography>
          <Typography className="text-sm text-gray-600 max-w-md">
            Create categories to group your menu items.
          </Typography>
        </div>
      </div>

      {isLoading ? (
        <div className="flex gap-4">
          <Skeleton className="h-16 w-24 rounded-xl" />
          <Skeleton className="h-16 w-24 rounded-xl" />
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <div className="bg-white px-6 py-3 rounded-xl shadow-sm text-center min-w-[100px]">
            <Typography className="text-2xl font-bold text-[#1F4D36] block leading-none">
              {count}
            </Typography>
            <Typography className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
              Categories
            </Typography>
          </div>
        </div>
      )}
    </div>
  );
};
