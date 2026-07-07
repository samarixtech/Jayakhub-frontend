"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { useFaqs } from "../hooks/useFaqs";

export const FAQSection = () => {
  const t = useTranslations("RestaurantDashboard.Support.faq");
  const { faqs, isLoading } = useFaqs();
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  const toggleFaq = (id: string) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
      <h3 className="text-[16px] font-bold text-[#1a1a1a] mb-5">
        {t("title")}
      </h3>
      <div className="flex flex-col">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between py-3.5 border-b border-gray-100 last:border-0"
            >
              <div className="h-3.5 w-3/4 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-4 bg-gray-200 rounded animate-pulse ml-4" />
            </div>
          ))
        ) : faqs.length === 0 ? (
          <p className="py-6 text-center text-[13px] text-gray-400">
            {t("noFaqs")}
          </p>
        ) : (
          faqs.map((item) => (
            <div
              key={item.id}
              className="flex flex-col py-3.5 border-b border-gray-100 last:border-0 cursor-pointer hover:bg-gray-50 -mx-2 px-2 rounded-lg transition-colors"
              onClick={() => toggleFaq(item.id)}
            >
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-gray-700 font-medium">
                  {item.heading}
                </span>
                <ChevronRight
                  className={`w-4 h-4 text-gray-300 shrink-0 transition-transform ${expandedFaq === item.id ? "rotate-90" : ""}`}
                />
              </div>
              {expandedFaq === item.id && (
                <div className="mt-2 text-[12px] text-gray-500 pr-4">
                  {item.body}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
