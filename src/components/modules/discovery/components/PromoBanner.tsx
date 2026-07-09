import React from "react";
import { Button } from "@/components/ui/button";
import { Tag } from "lucide-react";
import { useTranslations } from "next-intl";

const PromoBanner = () => {
  const t = useTranslations("Discovery.promoBanner");
  return (
    <div className="w-full bg-[#346853] rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 my-8 text-white relative overflow-hidden">
      {/* Texture/Pattern Overlay */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,var(--tw-gradient-stops))] from-white to-transparent" />

      <div className="flex items-start gap-4 z-10">
        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center shrink-0">
          <Tag className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-1">{t("title")}</h2>
          <p className="text-emerald-100 text-sm">
            {t("description")}
          </p>
        </div>
      </div>

      <Button className="bg-white text-[#346853] hover:bg-emerald-50 font-bold rounded-lg px-6 z-10 shrink-0">
        {t("cta", { price: "$9.99" })}
      </Button>
    </div>
  );
};

export default PromoBanner;
