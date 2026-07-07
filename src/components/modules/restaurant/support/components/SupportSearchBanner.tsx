import { Search } from "lucide-react";
import { useTranslations } from "next-intl";

export const SupportSearchBanner = () => {
  const t = useTranslations("RestaurantDashboard.Support.searchBanner");
  return (
    <div className="w-full rounded-2xl bg-gradient-to-r from-[#219e74] to-[#39cd96] px-8 py-12 mb-6 text-center text-white relative flex flex-col items-center justify-center shadow-sm overflow-hidden">
      <div className="absolute top-0 right-0 w-[400px] h-full bg-white/5 transform -skew-x-[35deg] origin-top translate-x-32" />
      <div className="absolute top-0 right-0 w-[250px] h-[250px] bg-[#39cd96] rounded-full blur-3xl translate-x-1/3 -translate-y-1/3 opacity-80" />

      <h2 className="text-[22px] md:text-[24px] font-bold mb-2 relative z-10 tracking-wide text-white">
        {t("title")}
      </h2>
      <p className="text-white/80 text-[13px] relative z-10 font-medium">
        {t("subtitle")}
      </p>
    </div>
  );
};
