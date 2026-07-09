import React from "react";
import { useTranslations } from "next-intl";
import {
  Star,
  Zap,
  Leaf,
  Sparkles,
  TrendingUp,
  Award,
  Sprout,
} from "lucide-react";

// ==================== CURATED CATEGORIES ====================
const CURATED_CATEGORY_ICONS = [
  { id: "top_rated", icon: Star },
  { id: "fastest", icon: Zap },
  { id: "healthy", icon: Leaf },
  { id: "new", icon: Sparkles },
  { id: "trending", icon: TrendingUp },
  { id: "best_sellers", icon: Award },
  { id: "vegan", icon: Sprout },
];

export const CuratedSection: React.FC<{
  selectedSort: string;
  onSortChange: (sort: string) => void;
}> = ({ selectedSort, onSortChange }) => {
  const t = useTranslations("Discovery.curatedSection");
  const CURATED_CATEGORIES = [
    { id: "top_rated", label: t("categories.topRated") },
    { id: "fastest", label: t("categories.fastest") },
    { id: "healthy", label: t("categories.healthy") },
    { id: "new", label: t("categories.new") },
    { id: "trending", label: t("categories.trending") },
    { id: "best_sellers", label: t("categories.bestSellers") },
    { id: "vegan", label: t("categories.vegan") },
  ].map((cat) => ({
    ...cat,
    icon: CURATED_CATEGORY_ICONS.find((c) => c.id === cat.id)!.icon,
  }));

  const handleItemClick = (id: string) => {
    if (id === "top_rated") onSortChange("highest");
    else if (id === "fastest") onSortChange("fastest");
    // Other IDs can be handled similarly if API supports them
  };

  const getActiveId = () => {
    if (selectedSort === "highest") return "top_rated";
    if (selectedSort === "fastest") return "fastest";
    return null;
  };

  const activeId = getActiveId();
  return (
    <section className="mb-8">
      <h3 className="text-lg font-bold text-gray-900 mb-4">{t("title")}</h3>
      <div className="flex gap-12 md:gap-6 overflow-x-auto pb-2 pl-4.5 sm:pl-0 scrollbar-hide">
        {CURATED_CATEGORIES.map((cat) => {
          const isActive = activeId === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => handleItemClick(cat.id)}
              className="flex flex-col items-center gap-2 min-w-[100px] group"
            >
              <div
                className={`w-34 h-31 rounded-2xl flex items-center justify-center transition-all ${
                  isActive
                    ? "bg-[#346853] shadow-md shadow-[#346853]/10"
                    : "bg-gray-100 group-hover:bg-[#E8F5F0]"
                }`}
              >
                <cat.icon
                  className={`w-6 h-6 transition-colors ${
                    isActive
                      ? "text-white"
                      : "text-gray-500 group-hover:text-[#346853]"
                  }`}
                />
              </div>
              <span
                className={`text-[11px] font-bold transition-colors whitespace-nowrap ${
                  isActive
                    ? "text-[#346853]"
                    : "text-gray-600 group-hover:text-[#346853]"
                }`}
              >
                {cat.label}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
};
