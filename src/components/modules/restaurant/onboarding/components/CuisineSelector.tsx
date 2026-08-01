import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { useTranslations } from "next-intl";
import { RestaurantInfoInput } from "@/lib/schemas/restaurant-onboarding";

const CUISINE_TYPES = [
  "Fast Food",
  "Casual Dining",
  "Cafe",
  "Fine Dining",
  "Bakery",
  "Indian",
  "Chinese",
  "Italian",
  "Mexican",
  "Japanese",
  "Thai",
  "Mediterranean",
  "American",
  "Middle Eastern",
  "Korean",
  "Fusion",
] as const;

const CUISINE_TYPE_KEYS: Record<string, string> = {
  "Fast Food": "fastFood",
  "Casual Dining": "casualDining",
  Cafe: "cafe",
  "Fine Dining": "fineDining",
  Bakery: "bakery",
  Indian: "indian",
  Chinese: "chinese",
  Italian: "italian",
  Mexican: "mexican",
  Japanese: "japanese",
  Thai: "thai",
  Mediterranean: "mediterranean",
  American: "american",
  "Middle Eastern": "middleEastern",
  Korean: "korean",
  Fusion: "fusion",
};

interface CuisineSelectorProps {
  form: UseFormReturn<RestaurantInfoInput>;
}

export const CuisineSelector: React.FC<CuisineSelectorProps> = ({ form }) => {
  const t = useTranslations("Onboarding.cuisineSelector");
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <label className="text-[10px] font-bold uppercase text-gray-400">
          {t("label")}
        </label>
        <span className="bg-navy/10 text-navy text-[10px] px-2.5 py-0.5 rounded-full font-bold">
          {t("selectedBadge", { count: form.watch("cuisineTypes")?.length || 0 })}
        </span>
      </div>

      <FormField
        control={form.control}
        name="cuisineTypes"
        render={() => (
          <FormItem>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {CUISINE_TYPES.map((type) => (
                <FormField
                  key={type}
                  control={form.control}
                  name="cuisineTypes"
                  render={({ field }) => {
                    const isChecked = field.value?.includes(type);
                    return (
                      <FormItem key={type} className="space-y-0">
                        <label
                          className={`
                            cursor-pointer flex items-center gap-3 border rounded-xl p-3 w-full h-12 transition-all
                            ${isChecked ? "border-navy bg-navy/5" : "border-gray-100 bg-white hover:bg-gray-50"}
                          `}
                        >
                          <FormControl>
                            <Checkbox
                              checked={isChecked}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  field.onChange([
                                    ...(field.value || []),
                                    type,
                                  ]);
                                } else {
                                  field.onChange(
                                    field.value?.filter(
                                      (value) => value !== type,
                                    ),
                                  );
                                }
                              }}
                              className="rounded-md border-gray-300 data-[state=checked]:bg-navy data-[state=checked]:border-navy"
                            />
                          </FormControl>
                          <span
                            className={`text-sm font-bold ${isChecked ? "text-navy" : "text-gray-600"}`}
                          >
                            {t(`types.${CUISINE_TYPE_KEYS[type]}`)}
                          </span>
                        </label>
                      </FormItem>
                    );
                  }}
                />
              ))}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
