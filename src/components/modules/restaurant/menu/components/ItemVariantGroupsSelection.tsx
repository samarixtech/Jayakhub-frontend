import React from "react";
import { Label } from "@/components/ui/label";
import { Typography } from "@/components/ui/typography";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

interface ItemVariantGroupsSelectionProps {
  variantGroups: any[];
  selectedGroups: string[];
  onToggle: (id: string) => void;
}

export const ItemVariantGroupsSelection: React.FC<
  ItemVariantGroupsSelectionProps
> = ({ variantGroups, selectedGroups, onToggle }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-semibold text-gray-700">
          Variant Groups
        </Label>
        <Typography className="text-xs text-gray-400">Optional</Typography>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {variantGroups.map((group) => {
          const isSelected = selectedGroups.includes(group.id || group._id);
          return (
            <div
              key={group.id || group._id}
              onClick={() => onToggle(group.id || group._id)}
              className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all cursor-pointer group ${
                isSelected
                  ? "border-emerald-bg bg-emerald-50/30"
                  : "border-gray-100 bg-white hover:border-emerald-bg/30"
              }`}
            >
              <div>
                <Typography
                  className={`font-semibold text-sm ${isSelected ? "text-emerald-bg" : "text-gray-700"}`}
                >
                  {group.groupName}
                </Typography>
                <div className="flex flex-wrap gap-1 mt-1">
                  {group.options.slice(0, 3).map((opt: any, idx: number) => (
                    <Badge
                      key={idx}
                      variant="secondary"
                      className="text-[10px] py-0 px-1.5 bg-gray-100 text-gray-500 font-normal"
                    >
                      {opt.name}
                    </Badge>
                  ))}
                  {group.options.length > 3 && (
                    <span className="text-[10px] text-gray-400">
                      +{group.options.length - 3} more
                    </span>
                  )}
                </div>
              </div>
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                  isSelected
                    ? "bg-emerald-bg border-emerald-bg text-white"
                    : "border-gray-200 bg-white"
                }`}
              >
                {isSelected && <Check className="w-4 h-4" />}
              </div>
            </div>
          );
        })}
      </div>

      {variantGroups.length === 0 && (
        <div className="text-center py-6 bg-gray-50 rounded-xl border-2 border-dashed border-gray-100">
          <Typography className="text-sm text-gray-400">
            No variant groups found. Create them in the Variants tab first.
          </Typography>
        </div>
      )}
    </div>
  );
};
