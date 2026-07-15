import { FaApple } from "react-icons/fa";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { GoogleAuthButton } from "../GoogleAuthButton";
import { UserRole } from "@/config/role-map.config";

interface SocialAuthButtonsProps {
  isGoogleLoading: boolean;
  setIsGoogleLoading: (loading: boolean) => void;
  isPending: boolean;
  role?: UserRole;
  country?: string;
  language?: string;
}

export function SocialAuthButtons({
  isGoogleLoading,
  setIsGoogleLoading,
  isPending,
  role,
  country,
  language,
}: SocialAuthButtonsProps) {
  const t = useTranslations("Auth.social");

  return (
    <div className="grid grid-cols-2 gap-4 mb-6 mt-3">
      <GoogleAuthButton
        loading={isGoogleLoading}
        setLoading={setIsGoogleLoading}
        disabled={isPending}
        role={role}
        country={country}
        language={language}
      />
      <Button
        type="button"
        className="flex items-center justify-center gap-3 h-12 bg-black text-white rounded-xl hover:bg-gray-800 transition font-semibold text-sm"
      >
        <FaApple className="text-xl" /> {t("apple")}
      </Button>
    </div>
  );
}
