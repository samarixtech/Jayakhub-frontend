import React from "react";
import { useTranslations } from "next-intl";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LayoutList, Info } from "lucide-react";
import { Typography } from "@/components/ui/typography";
import { useCLC } from "@/context/CLCContext";

interface ItemBasicInfoProps {
  formData: any;
  categories: any[];
  onChange: (field: string, value: any) => void;
}

export const ItemBasicInfo: React.FC<ItemBasicInfoProps> = ({
  formData,
  categories,
  onChange,
}) => {
  const t = useTranslations("RestaurantDashboard.Menu.Items.basicInfo");

  const { currency } = useCLC();
  const discountExceedsBasePrice =
    !!formData.discount &&
    !!formData.basePrice &&
    Number(formData.discount) > Number(formData.basePrice);

  return (
    <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 space-y-4">
      {/* SECTION HEADER */}
      <div className="flex items-center gap-3 border-b border-gray-50">
        <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
          <LayoutList className="w-5 h-5" />
        </div>
        <Typography className="font-semibold text-gray-900">
          {t("sectionTitle")}
        </Typography>
      </div>

      <div className="space-y-5">
        {/* ITEM NAME */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label className="text-sm font-bold text-gray-700">
              {t("itemName")} <span className="text-red-500">*</span>
            </Label>
            <Typography className="text-[10px] font-bold text-gray-400">
              {formData.name?.length || 0}/60
            </Typography>
          </div>
          <Input
            placeholder={t("itemPlaceholder")}
            value={formData.name}
            onChange={(e) => onChange("name", e.target.value.slice(0, 60))}
            className="h-12 bg-gray-50/50 border-gray-100 rounded-xl focus:bg-white transition-all font-medium"
          />
        </div>

        {/* DESCRIPTION */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label className="text-sm font-bold text-gray-700">
              {t("description")}{" "}
              <span className="text-gray-400 font-normal">{t("optional")}</span>
            </Label>
            <Typography className="text-[10px] font-bold text-gray-400">
              {formData.description?.length || 0}/200
            </Typography>
          </div>
          <Textarea
            placeholder={t("descPlaceholder")}
            className="min-h-[120px] resize-none bg-gray-50/50 border-gray-100 rounded-2xl focus:bg-white transition-all font-medium py-4 px-4"
            value={formData.description}
            onChange={(e) =>
              onChange("description", e.target.value?.slice(0, 200))
            }
          />
        </div>

        {/* PRICE AND DISCOUNT */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-sm font-bold text-gray-700">
              {t("basePrice")} <span className="text-red-500">*</span>
            </Label>
            <div className="relative group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">
                {currency}
              </span>
              <Input
                type="number"
                placeholder="0.00"
                className="h-12 pl-10 bg-gray-50/50 border-gray-100 rounded-xl focus:bg-white transition-all font-bold"
                value={formData.basePrice}
                onChange={(e) => onChange("basePrice", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-bold text-gray-700">
              {t("discount")}{" "}
              <span className="text-gray-400 font-normal">{t("optional")}</span>
            </Label>
            <div className="relative group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">
                {currency}
              </span>
              <Input
                type="number"
                placeholder={t("discountPlaceholder")}
                className={`h-12 pl-10 bg-gray-50/50 border-gray-100 rounded-xl focus:bg-white transition-all font-bold ${
                  discountExceedsBasePrice ? "border-red-500 focus:border-red-500" : ""
                }`}
                value={formData.discount}
                onChange={(e) => onChange("discount", e.target.value)}
              />
            </div>
            {discountExceedsBasePrice && (
              <p className="text-xs text-red-500 font-medium">
                Discount cannot be greater than the base price
              </p>
            )}
          </div>
        </div>

        {/* CATEGORY AND DIETARY TYPE */}
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-sm font-bold text-gray-700">
              {t("category")} <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.category}
              onValueChange={(v: string) => onChange("category", v)}
            >
              <SelectTrigger className="h-12! bg-gray-50/50 border-gray-100 rounded-xl w-full focus:bg-white transition-all font-medium">
                <SelectValue placeholder={t("selectCategory")} />
              </SelectTrigger>
              <SelectContent className="rounded-2xl bg-gray-50 border-gray-100 shadow-xl p-1" position="popper">
                {categories.map((cat: any) => (
                  <SelectItem
                    key={cat.id || cat._id}
                    value={cat.id || cat._id}
                    className="rounded-xl py-2 font-medium"
                  >
                    {cat.categoryName || cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-bold text-gray-700">
              {t("dietaryType")}{" "}
              <span className="text-gray-400 font-normal">{t("optional")}</span>
            </Label>
            <Select
              value={formData.dietaryType || "None"}
              onValueChange={(v: "Veg" | "Non-Veg" | "None") =>
                onChange("dietaryType", v)
              }
            >
              <SelectTrigger className="h-12! bg-gray-50/50 border-gray-100 rounded-xl w-full focus:bg-white transition-all font-medium">
                <SelectValue placeholder={t("selectType")} />
              </SelectTrigger>
              <SelectContent className="rounded-2xl bg-gray-50 border-gray-100 shadow-xl p-1" position="popper">
                <SelectItem value="None" className="rounded-xl py-2 font-medium">
                  {t("dietaryNone")}
                </SelectItem>
                <SelectItem value="Veg" className="rounded-xl py-2 font-medium">
                  {t("dietaryVeg")}
                </SelectItem>
                <SelectItem
                  value="Non-Veg"
                  className="rounded-xl py-2 font-medium"
                >
                  {t("dietaryNonVeg")}
                </SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center gap-1.5 pt-1">
              <Info className="w-3.5 h-3.5 text-gray-400" />
              <Typography className="text-[11px] font-medium text-gray-400">
                {t("dietaryHelp")}
              </Typography>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
