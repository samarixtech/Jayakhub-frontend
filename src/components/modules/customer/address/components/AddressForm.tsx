import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { AddressFormData } from "@/hooks/useAddressGeocoding";

interface AddressFormProps {
  formData: AddressFormData;
  setFormData: React.Dispatch<React.SetStateAction<AddressFormData>>;
  addressType: "Home" | "Work" | "Other";
  setAddressType: React.Dispatch<
    React.SetStateAction<"Home" | "Work" | "Other">
  >;
  otherLabel: string;
  setOtherLabel: React.Dispatch<React.SetStateAction<string>>;
}

export const AddressForm = ({
  formData,
  setFormData,
  addressType,
  setAddressType,
  otherLabel,
  setOtherLabel,
}: AddressFormProps) => {
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  return (
    <form className="space-y-5">
      {/* Address Label */}
      <div className="space-y-3">
        <Label className="text-sm font-bold text-gray-900">Address Label</Label>
        <div className="flex gap-3">
          {["Home", "Work", "Other"].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setAddressType(type as any)}
              className={`
                px-6 py-2.5 rounded-full text-sm font-bold transition-all flex-1
                ${
                  addressType === type
                    ? "bg-[#1E4D3B] text-white shadow-md"
                    : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                }
              `}
            >
              {type}
            </button>
          ))}
        </div>
        {addressType === "Other" && (
          <div className="mt-3 animate-in fade-in slide-in-from-top-2 duration-300">
            <Input
              placeholder="e.g. Grandma's House"
              className="h-12 rounded-xl bg-gray-50/50 border-gray-200 focus-visible:ring-emerald-500/20 text-base"
              autoFocus
              value={otherLabel}
              onChange={(e) => setOtherLabel(e.target.value)}
            />
          </div>
        )}
      </div>

      {/* Street Address */}
      <div className="space-y-2">
        <Label htmlFor="street" className="text-sm font-bold text-gray-900">
          Street Address
        </Label>
        <Input
          id="street"
          placeholder="e.g. 123 Main St"
          className="h-12 rounded-xl bg-gray-50/50 border-gray-200 focus-visible:ring-emerald-500/20 text-base"
          value={formData.street}
          onChange={handleInputChange}
        />
      </div>

      {/* Apartment */}
      <div className="space-y-2">
        <Label htmlFor="apt" className="text-sm font-bold text-gray-900">
          Apartment, Suite, Unit, etc. (Optional)
        </Label>
        <Input
          id="apt"
          placeholder="e.g. Apt 4B"
          className="h-12 rounded-xl bg-gray-50/50 border-gray-200 focus-visible:ring-emerald-500/20 text-base"
          value={formData.apt}
          onChange={handleInputChange}
        />
      </div>

      {/* City & State */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city" className="text-sm font-bold text-gray-900">
            City
          </Label>
          <Input
            id="city"
            placeholder="e.g. Baghdad"
            className="h-12 rounded-xl bg-gray-50/50 border-gray-200 focus-visible:ring-emerald-500/20 text-base"
            value={formData.city}
            onChange={handleInputChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="state" className="text-sm font-bold text-gray-900">
            State / Province
          </Label>
          <Input
            id="state"
            placeholder="e.g. Al Mansour"
            className="h-12 rounded-xl bg-gray-50/50 border-gray-200 focus-visible:ring-emerald-500/20 text-base"
            value={formData.state}
            onChange={handleInputChange}
          />
        </div>
      </div>

      {/* Zip & Country */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="zip" className="text-sm font-bold text-gray-900">
            Zip / Postal Code
          </Label>
          <Input
            id="zip"
            placeholder="e.g. 10011"
            className="h-12 rounded-xl bg-gray-50/50 border-gray-200 focus-visible:ring-emerald-500/20 text-base"
            value={formData.zip}
            onChange={handleInputChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="country" className="text-sm font-bold text-gray-900">
            Country
          </Label>
          <Input
            id="country"
            placeholder="Iraq"
            className="h-12 rounded-xl bg-gray-50/50 border-gray-200 focus-visible:ring-emerald-500/20 text-base"
            value={formData.country}
            onChange={handleInputChange}
          />
        </div>
      </div>

      {/* Status Toggle */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50/50 border border-gray-100">
        <div className="space-y-0.5">
          <Label className="text-sm font-bold text-gray-900">
            Set as Active Address
          </Label>
          <p className="text-xs text-gray-500">
            Use this address for your order
          </p>
        </div>
        <Switch
          checked={formData.status}
          onCheckedChange={(checked) =>
            setFormData((prev) => ({ ...prev, status: checked }))
          }
          className="data-[state=checked]:bg-[#1E4D3B]"
        />
      </div>

      {/* Note */}
      <div className="space-y-2">
        <Label htmlFor="note" className="text-sm font-bold text-gray-900">
          Note to Courier (Optional)
        </Label>
        <Textarea
          id="note"
          placeholder="e.g. Ring the doorbell, leave at front desk..."
          className="min-h-[100px] rounded-xl bg-gray-50/50 border-gray-200 focus-visible:ring-emerald-500/20 resize-none text-base"
          value={formData.note}
          onChange={handleInputChange}
        />
      </div>
    </form>
  );
};
