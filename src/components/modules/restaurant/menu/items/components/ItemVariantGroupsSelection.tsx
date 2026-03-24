import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Typography } from "@/components/ui/typography";
import { Badge } from "@/components/ui/badge";
import { Check, Layers, Info, Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

interface ItemVariantGroupsSelectionProps {
  variantGroups: any[];
  selectedGroups: string[];
  onToggle: (id: string) => void;
}

export const ItemVariantGroupsSelection: React.FC<
  ItemVariantGroupsSelectionProps
> = ({ variantGroups, selectedGroups, onToggle }) => {
  const t = useTranslations("RestaurantDashboard.Menu.Items.variantGroups");
  const [groupToAdd, setGroupToAdd] = useState<string>("");

  const handleAddGroup = () => {
    if (groupToAdd && !selectedGroups.includes(groupToAdd)) {
      onToggle(groupToAdd);
      setGroupToAdd("");
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 space-y-8">
      {/* SECTION HEADER */}
      <div className="flex items-center gap-3 border-b border-gray-50 pb-5">
        <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
          <Layers className="w-5 h-5" />
        </div>
        <Typography className="font-semibold text-gray-900">
          {t("sectionTitle")}
        </Typography>
      </div>

      <div className="space-y-6">
        <div className="flex items-center gap-1.5 opacity-60">
          <Info className="w-3.5 h-3.5 text-gray-400" />
          <Typography className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
            {t("helpText")}
          </Typography>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1">
            <Select value={groupToAdd} onValueChange={setGroupToAdd}>
              <SelectTrigger className="h-12 bg-gray-50/50 border-gray-100 rounded-xl focus:bg-white transition-all font-medium">
                <SelectValue placeholder={t("selectPlaceholder")} />
              </SelectTrigger>
              <SelectContent className="rounded-2xl bg-gray-50 border-gray-100 shadow-xl p-1">
                {variantGroups.map((group) => (
                  <SelectItem
                    key={group.id || group._id}
                    value={group.id || group._id}
                    className="rounded-xl py-2 font-medium"
                    disabled={selectedGroups.includes(group.id || group._id)}
                  >
                    {group.groupName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            type="button"
            onClick={handleAddGroup}
            disabled={!groupToAdd}
            className="bg-[#2D5A43] hover:bg-[#234735] text-white h-12 px-6 rounded-xl font-bold flex items-center gap-2 disabled:opacity-50"
          >
            {t("addBtn")}
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {selectedGroups.length > 0 ? (
            variantGroups
              .filter((g) => selectedGroups.includes(g.id || g._id))
              .map((group) => (
                <div
                  key={group.id || group._id}
                  className="flex items-center justify-between p-4 rounded-2xl border border-emerald-100 bg-emerald-50/20"
                >
                  <div>
                    <Typography className="font-bold text-sm text-gray-900">
                      {group.groupName}
                    </Typography>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {group.options.map((opt: any, idx: number) => (
                        <Badge
                          key={idx}
                          variant="secondary"
                          className="text-[10px] py-0 px-2 bg-white border border-emerald-100 text-emerald-700 font-bold"
                        >
                          {opt.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => onToggle(group.id || group._id)}
                    className="text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl"
                  >
                    <Plus className="w-4 h-4 rotate-45" />
                  </Button>
                </div>
              ))
          ) : (
            <div className="text-center py-12 bg-gray-50/50 rounded-[24px] border border-dashed border-gray-100">
              <Typography className="text-sm font-bold text-gray-400">
                {t("noGroups")}
              </Typography>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
