"use client";
import { useTranslations } from "next-intl";

interface ReviewFilterPillsProps {
  filter: string;
  onFilterChange: (filter: string) => void;
}

const ReviewFilterPills: React.FC<ReviewFilterPillsProps> = ({
  filter,
  onFilterChange,
}) => {
  const t = useTranslations("RestaurantDashboard.Reviews.filters");
  const getPillClass = (activeName: string) => {
    return filter === activeName
      ? "bg-[#357252] text-white px-5 py-2 rounded-full text-[12px] font-bold whitespace-nowrap transition-colors"
      : "bg-white border text-gray-700 hover:bg-gray-50 border-gray-200 px-5 py-2 rounded-full text-[12px] font-bold whitespace-nowrap transition-colors";
  };

  return (
    <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
      <button
        onClick={() => onFilterChange("All")}
        className={getPillClass("All")}
      >
        {t("allReviews")}
      </button>
      <button
        onClick={() => onFilterChange("Unreplied")}
        className={getPillClass("Unreplied")}
      >
        {t("unreplied")}
      </button>
      <button
        onClick={() => onFilterChange("5 Stars")}
        className={getPillClass("5 Stars")}
      >
        {t("stars5")}
      </button>
      <button
        onClick={() => onFilterChange("Critical")}
        className={getPillClass("Critical") + " flex items-center gap-1"}
      >
        {t("critical")} <span className="text-[10px]">▼</span>
      </button>
    </div>
  );
};

export default ReviewFilterPills;
