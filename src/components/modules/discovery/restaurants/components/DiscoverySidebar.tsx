import React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

// ==================== SIDEBAR DATA ====================
const SORT_OPTIONS = [
  { id: "recommended", label: "Recommended" },
  { id: "fastest", label: "Fastest Delivery" },
  { id: "highest", label: "Highest Rated" },
];

const QUICK_FILTERS = [
  { id: "free_delivery", label: "Free Delivery" },
  { id: "offers", label: "Offers" },
  { id: "online_payment", label: "Online Payment" },
];

const PRICE_LEVELS = ["$", "$$", "$$$"];

const VISIBLE_CUISINES = 5;

import {
  CuisineType,
  DiscoverySidebarProps,
} from "@/components/modules/discovery/discovery.types";

const DiscoverySidebar: React.FC<DiscoverySidebarProps> = ({
  selectedSort,
  onSortChange,
  activeFilters,
  onFilterToggle,
  selectedPrice,
  onPriceToggle,
  showAllCuisines,
  onToggleCuisines,
  onResetFilters,
  cuisineTypes,
  className = "",
}) => {
  const cuisines = Array.isArray(cuisineTypes) ? cuisineTypes : [];
  const visibleCuisines = showAllCuisines
    ? cuisines
    : cuisines.slice(0, VISIBLE_CUISINES);

  return (
    <div className={`space-y-7 ${className}`}>
      {/* Sort By */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
            Sort By
          </h4>
          <button
            onClick={onResetFilters}
            className="text-[11px] font-bold text-gray-400 hover:underline uppercase tracking-wider"
          >
            Reset Filters
          </button>
        </div>
        <div className="space-y-3">
          {SORT_OPTIONS.map((opt) => (
            <label
              key={opt.id}
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => onSortChange(opt.id)}
            >
              <span
                className={`w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center transition-all ${
                  selectedSort === opt.id
                    ? "border-[#346853]"
                    : "border-gray-300 group-hover:border-gray-400"
                }`}
              >
                {selectedSort === opt.id && (
                  <span className="w-2.5 h-2.5 rounded-full bg-[#346853]" />
                )}
              </span>
              <span
                className={`text-[13px] ${
                  selectedSort === opt.id
                    ? "text-gray-900 font-medium"
                    : "text-gray-600"
                }`}
              >
                {opt.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Quick Filters */}
      <div>
        <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-4">
          Quick Filters
        </h4>
        <div className="flex flex-wrap gap-2">
          {QUICK_FILTERS.map((filter) => (
            <button
              key={filter.id}
              onClick={() => onFilterToggle(filter.id)}
              className={`px-3 py-1.5 rounded-full text-[12px] font-medium border transition-all ${
                activeFilters.includes(filter.id)
                  ? "bg-[#346853] text-white border-[#346853]"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-4">
          Price Range
        </h4>
        <div className="flex gap-0 border border-gray-200 rounded-lg overflow-hidden">
          {PRICE_LEVELS.map((price) => (
            <button
              key={price}
              onClick={() => onPriceToggle(price)}
              className={`flex-1 h-9 text-sm font-bold transition-all ${
                selectedPrice === price
                  ? "bg-[#346853] text-white"
                  : "bg-white text-gray-500 hover:bg-gray-50"
              }`}
            >
              {price}
            </button>
          ))}
        </div>
      </div>

      {/* Cuisines */}
      <div>
        <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-4">
          Cuisines
        </h4>
        <div className="space-y-3">
          {visibleCuisines.map((cuisine) => (
            <label
              key={cuisine.name}
              className="flex items-center justify-between w-full cursor-pointer group"
              onClick={() => onFilterToggle(cuisine.name)}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`w-[18px] h-[18px] rounded border-2 flex items-center justify-center transition-all ${
                    activeFilters.includes(cuisine.name)
                      ? "border-[#346853] bg-[#346853]"
                      : "border-gray-300 group-hover:border-gray-400"
                  }`}
                >
                  {activeFilters.includes(cuisine.name) && (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-3 h-3 text-white"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </span>
                <span
                  className={`text-[13px] transition-colors ${
                    activeFilters.includes(cuisine.name)
                      ? "text-gray-900 font-medium"
                      : "text-gray-700 group-hover:text-gray-900"
                  }`}
                >
                  {cuisine.name}
                </span>
              </div>
            </label>
          ))}
        </div>
        {cuisines.length > VISIBLE_CUISINES && (
          <button
            onClick={onToggleCuisines}
            className="text-[#346853] text-[13px] font-medium mt-4 hover:underline flex items-center gap-1"
          >
            {showAllCuisines ? (
              <>
                Show less <ChevronUp className="w-3.5 h-3.5" />
              </>
            ) : (
              <>
                View more <ChevronDown className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default DiscoverySidebar;
