import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { AddressFormData } from "@/hooks/useAddressGeocoding";
import { useTranslations } from "next-intl";

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
  const t = useTranslations('CustomerDashboard.MyAddress');

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
        <Label className="text-sm font-bold text-gray-900">{t('address_label')}</Label>
        <div className="flex gap-3">
          {["Home", "Work", "Other"].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setAddressType(type as any)}
              className={`
                px-6 py-2.5 rounded-full text-sm font-bold transition-all flex-1
                ${addressType === type
                  ? "bg-[#1E4D3B] text-white shadow-md"
                  : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                }
              `}
            >
              {type === "Home" ? t('home') : type === "Work" ? t('work') : t('other')}
            </button>
          ))}
        </div>
        {addressType === "Other" && (
          <div className="mt-3 animate-in fade-in slide-in-from-top-2 duration-300">
            <Input
              placeholder={t('other_placeholder')}
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
          {t('street_address')}
        </Label>
        <Input
          id="street"
          placeholder={t('street_placeholder')}
          className="h-12 rounded-xl bg-gray-50/50 border-gray-200 focus-visible:ring-emerald-500/20 text-base"
          value={formData.street}
          onChange={handleInputChange}
        />
      </div>

      {/* Apartment */}
      <div className="space-y-2">
        <Label htmlFor="apt" className="text-sm font-bold text-gray-900">
          {t('apartment')}
        </Label>
        <Input
          id="apt"
          placeholder={t('apt_placeholder')}
          className="h-12 rounded-xl bg-gray-50/50 border-gray-200 focus-visible:ring-emerald-500/20 text-base"
          value={formData.apt}
          onChange={handleInputChange}
        />
      </div>

      {/* City & State */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city" className="text-sm font-bold text-gray-900">
            {t('city')}
          </Label>
          <Input
            id="city"
            placeholder={t('city_placeholder')}
            className="h-12 rounded-xl bg-gray-50/50 border-gray-200 focus-visible:ring-emerald-500/20 text-base"
            value={formData.city}
            onChange={handleInputChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="state" className="text-sm font-bold text-gray-900">
            {t('state_province')}
          </Label>
          <Input
            id="state"
            placeholder={t('state_placeholder')}
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
            {t('zip_code')}
          </Label>
          <Input
            id="zip"
            placeholder={t('zip_placeholder')}
            className="h-12 rounded-xl bg-gray-50/50 border-gray-200 focus-visible:ring-emerald-500/20 text-base"
            value={formData.zip}
            onChange={handleInputChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="country" className="text-sm font-bold text-gray-900">
            {t('country')}
          </Label>
          <Input
            id="country"
            placeholder={t('country_placeholder')}
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
            {t('set_active')}
          </Label>
          <p className="text-xs text-gray-500">
            {t('use_this_address')}
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
          {t('note_to_courier')}
        </Label>
        <Textarea
          id="note"
          placeholder={t('note_placeholder')}
          className="min-h-[100px] rounded-xl bg-gray-50/50 border-gray-200 focus-visible:ring-emerald-500/20 resize-none text-base"
          value={formData.note}
          onChange={handleInputChange}
        />
      </div>
    </form>
  );
};
