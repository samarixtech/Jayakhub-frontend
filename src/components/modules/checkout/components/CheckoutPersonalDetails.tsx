import { useState } from "react";
import { User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import { useTranslations } from "next-intl";

interface UserProfile {
  name?: string;
  email?: string;
  phone?: string;
}

interface CheckoutPersonalDetailsProps {
  userProfile: UserProfile | null | undefined;
}

export const CheckoutPersonalDetails = ({
  userProfile,
}: CheckoutPersonalDetailsProps) => {
  const [phone, setPhone] = useState(userProfile?.phone || "");
  const t = useTranslations("Checkout");

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <User className="text-[#346853]" size={20} />
        <h3 className="font-bold text-lg text-gray-900">
          {t("personalDetails")}
        </h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-gray-500 mb-1">
            {t("email")}
          </label>
          <Input
            defaultValue={userProfile?.email || ""}
            className="h-11 bg-white"
            readOnly={!!userProfile?.email}
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 mb-1">
            {t("fullName")}
          </label>
          <Input
            defaultValue={userProfile?.name || ""}
            className="h-11 bg-white"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-gray-500 mb-1">
            {t("mobileNumber")}
          </label>
          <div className="flex gap-2">
            <PhoneInput
              value={phone}
              onChange={setPhone}
              className="h-11 bg-white flex-1"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
