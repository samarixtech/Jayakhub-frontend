import React from "react";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

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
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-gray-700">
            Item Name*
          </Label>
          <Input
            placeholder="e.g. Classic Beef Burger"
            value={formData.name}
            onChange={(e) => onChange("name", e.target.value)}
            className="h-11 bg-white border-gray-200"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-semibold text-gray-700">
            Category*
          </Label>
          <Select
            value={formData.category}
            onValueChange={(v: string) => onChange("category", v)}
          >
            <SelectTrigger className="h-11 bg-white border-gray-200">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat: any) => (
                <SelectItem
                  key={cat.id || cat._id}
                  value={cat.categoryName || cat.name}
                >
                  {cat.categoryName || cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-semibold text-gray-700">
          Description
        </Label>
        <Textarea
          placeholder="Briefly describe your item..."
          className="min-h-[100px] resize-none bg-white border-gray-200"
          value={formData.description}
          onChange={(e) => onChange("description", e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-gray-700">
            Base Price*
          </Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">
              $
            </span>
            <Input
              type="number"
              placeholder="0.00"
              className="h-11 pl-8 bg-white border-gray-200"
              value={formData.basePrice}
              onChange={(e) => onChange("basePrice", e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-semibold text-gray-700">
            Dietary Type
          </Label>
          <RadioGroup
            value={formData.dietaryType}
            onValueChange={(v: "Veg" | "Non-Veg" | "None") =>
              onChange("dietaryType", v)
            }
            className="flex items-center gap-4 h-11"
          >
            <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg border border-gray-100 shadow-sm cursor-pointer hover:bg-gray-50">
              <RadioGroupItem
                value="Veg"
                id="veg"
                className="text-emerald-bg border-emerald-bg"
              />
              <Label
                htmlFor="veg"
                className="cursor-pointer font-medium text-gray-600"
              >
                Veg
              </Label>
            </div>
            <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg border border-gray-100 shadow-sm cursor-pointer hover:bg-gray-50">
              <RadioGroupItem
                value="Non-Veg"
                id="non-veg"
                className="text-red-500 border-red-500"
              />
              <Label
                htmlFor="non-veg"
                className="cursor-pointer font-medium text-gray-600"
              >
                Non-Veg
              </Label>
            </div>
            <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg border border-gray-100 shadow-sm cursor-pointer hover:bg-gray-50">
              <RadioGroupItem
                value="None"
                id="none"
                className="text-gray-400 border-gray-400"
              />
              <Label
                htmlFor="none"
                className="cursor-pointer font-medium text-gray-600"
              >
                None
              </Label>
            </div>
          </RadioGroup>
        </div>
      </div>
    </div>
  );
};
