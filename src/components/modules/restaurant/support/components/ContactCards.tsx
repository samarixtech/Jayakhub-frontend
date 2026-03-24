import { MessageSquare, Phone, Mail } from "lucide-react";
import { useTranslations } from "next-intl";

export const ContactCards = () => {
  const t = useTranslations("RestaurantDashboard.Support.contact");
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white border border-gray-100 rounded-2xl p-6 md:py-8 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow cursor-pointer">
        <div className="w-10 h-10 rounded-lg bg-[#e8f3ef] flex items-center justify-center mb-4">
          <MessageSquare className="w-5 h-5 text-[#346853] fill-current opacity-80" />
        </div>
        <h3 className="text-[14px] font-bold text-gray-800 mb-1">{t("liveChat")}</h3>
        <div className="flex items-center gap-1.5 text-[12px] text-gray-500 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-[#1E9E74]" />
          {t("liveChatDesc")}
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-6 md:py-8 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow cursor-pointer">
        <div className="w-10 h-10 rounded-lg bg-[#e8f3ef] flex items-center justify-center mb-4">
          <Phone className="w-5 h-5 text-[#346853] fill-current opacity-80" />
        </div>
        <h3 className="text-[14px] font-bold text-gray-800 mb-1">
          {t("phoneSupport")}
        </h3>
        <p className="text-[12px] text-gray-500 font-medium">
          {t("phoneDesc")}
        </p>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-6 md:py-8 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow cursor-pointer">
        <div className="w-10 h-10 rounded-lg bg-[#e8f3ef] flex items-center justify-center mb-4">
          <Mail className="w-5 h-5 text-[#346853] fill-current opacity-80" />
        </div>
        <h3 className="text-[14px] font-bold text-gray-800 mb-1">{t("emailUs")}</h3>
        <p className="text-[12px] text-gray-500 font-medium">
          {t("emailDesc")}
        </p>
      </div>
    </div>
  );
};
