import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export const CheckoutLoginForm = () => {
  const router = useRouter();
  const t = useTranslations("Checkout");

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-6 bg-white p-10 rounded-2xl shadow-sm border border-gray-100">
      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-2">
        <User className="w-10 h-10 text-primary" />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">
          {t("loginTitle")}
        </h2>
        <p className="text-gray-500 max-w-sm mx-auto">
          {t("loginSubtitle")}
        </p>
      </div>
      <div className="flex gap-4">
        <Button
          onClick={() => router.push("/login")}
          className="bg-primary hover:bg-[#e85a2a] text-white px-8 rounded-full font-bold h-12"
        >
          {t("loginBtn")}
        </Button>
      </div>
    </div>
  );
};
