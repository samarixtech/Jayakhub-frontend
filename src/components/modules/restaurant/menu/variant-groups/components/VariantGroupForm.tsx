import React from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";

interface VariantGroupFormProps {
  groupName: string;
  setGroupName: (v: string) => void;
  options: any[];
  onAddOption: () => void;
  onRemoveOption: (idx: number) => void;
  onOptionChange: (idx: number, field: "name" | "price", value: string) => void;
  onSave: () => void;
  onCancel: () => void;
  isSaving: boolean;
  isEditing: boolean;
}

export const VariantGroupForm: React.FC<VariantGroupFormProps> = ({
  groupName,
  setGroupName,
  options,
  onAddOption,
  onRemoveOption,
  onOptionChange,
  onSave,
  onCancel,
  isSaving,
  isEditing,
}) => {
  const t = useTranslations("RestaurantDashboard.Menu.VariantGroups.form");

  return (
    <div className="border border-dashed border-[#1F4D36] rounded-xl p-6 bg-[#F9FAFB] relative animate-in fade-in zoom-in-95 duration-200">
      <div className="space-y-6">
        <div className="space-y-2">
          <Label className="text-gray-700 font-medium">{t("groupName")}</Label>
          <Input
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder={t("namePlaceholder")}
            className="bg-white border-gray-200"
            autoFocus
          />
        </div>

        <div className="space-y-2">
          <Label className="text-gray-700 font-medium">{t("options")}</Label>
          {options.map((opt, idx) => (
            <div key={idx} className="flex items-center gap-2 mb-2">
              <Input
                value={opt.name}
                onChange={(e) => onOptionChange(idx, "name", e.target.value)}
                placeholder={t("optionPlaceholder")}
                className="bg-white border-gray-200 flex-1"
              />
              <div className="relative w-32 shrink-0">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  $
                </span>
                <Input
                  value={opt.price}
                  type="number"
                  min="0"
                  onChange={(e) => onOptionChange(idx, "price", e.target.value)}
                  placeholder="0"
                  className="bg-white border-gray-200 pl-6 text-center"
                />
              </div>
              {options.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onRemoveOption(idx)}
                  className="h-10 w-10 text-gray-400 hover:text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}

          <Button
            onClick={onAddOption}
            variant="outline"
            className="mt-2 border-dashed border-[#1F4D36] text-[#1F4D36] hover:bg-[#1F4D36]/5 h-10 w-auto px-4 gap-2"
          >
            <Plus className="w-4 h-4" />
            {t("addOption")}
          </Button>
        </div>

        <div className="flex items-center gap-4 pt-4 border-t border-gray-100 mt-4">
          <Button
            onClick={onSave}
            className="bg-[#1F4D36] hover:bg-[#183d2b] text-white px-6"
            disabled={isSaving}
          >
            {isSaving
              ? t("saving")
              : isEditing
                ? t("updateBtn")
                : t("createBtn")}
          </Button>
          <Button
            onClick={onCancel}
            variant="ghost"
            className="text-gray-500 hover:text-gray-900"
            disabled={isSaving}
          >
            {t("cancel")}
          </Button>
        </div>
      </div>
    </div>
  );
};
