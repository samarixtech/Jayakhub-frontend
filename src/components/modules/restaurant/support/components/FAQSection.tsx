"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";

export const FAQSection = () => {
  const t = useTranslations("RestaurantDashboard.Support.faq");
  
  const FAQ_ITEMS = [
    { q: t("q1"), a: t("a1") },
    { q: t("q2"), a: t("a2") },
    { q: t("q3"), a: t("a3") },
    { q: t("q4"), a: t("a4") },
    { q: t("q5"), a: t("a5") },
    { q: t("q6"), a: t("a6") },
    { q: t("q7"), a: t("a7") },
    { q: t("q8"), a: t("a8") },
  ];

  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
      <h3 className="text-[16px] font-bold text-[#1a1a1a] mb-5">
        {t("title")}
      </h3>
      <div className="flex flex-col">
        {FAQ_ITEMS.map((item, i) => (
          <div
            key={i}
            className="flex flex-col py-3.5 border-b border-gray-100 last:border-0 cursor-pointer hover:bg-gray-50 -mx-2 px-2 rounded-lg transition-colors"
            onClick={() => toggleFaq(i)}
          >
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-gray-700 font-medium">
                {item.q}
              </span>
              <ChevronRight
                className={`w-4 h-4 text-gray-300 shrink-0 transition-transform ${expandedFaq === i ? "rotate-90" : ""}`}
              />
            </div>
            {expandedFaq === i && (
              <div className="mt-2 text-[12px] text-gray-500 pr-4">
                {item.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
