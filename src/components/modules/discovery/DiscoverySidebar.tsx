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
  { id: "cuisines", label: "Cuisines" },
];

const PRICE_LEVELS = ["$", "$$", "$$$"];

const CUISINE_LIST = [
  { name: "American", count: 124 },
  { name: "Burgers", count: 85 },
  { name: "Chinese", count: 62 },
  { name: "Japanese", count: 45 },
  { name: "Desserts", count: 38 },
  { name: "Italian", count: 33 },
  { name: "Mexican", count: 28 },
  { name: "Indian", count: 25 },
];

const VISIBLE_CUISINES = 5;

interface DiscoverySidebarProps {
  selectedSort: string;
  onSortChange: (sort: string) => void;
  activeFilters: string[];
  onFilterToggle: (filterId: string) => void;
  selectedPrice: string | null;
  onPriceToggle: (price: string) => void;
  showAllCuisines: boolean;
  onToggleCuisines: () => void;
  className?: string; // Allow passing extra classes if needed
}

const DiscoverySidebar: React.FC<DiscoverySidebarProps> = ({
  selectedSort,
  onSortChange,
  activeFilters,
  onFilterToggle,
  selectedPrice,
  onPriceToggle,
  showAllCuisines,
  onToggleCuisines,
  className = "",
}) => {
  const visibleCuisines = showAllCuisines
    ? CUISINE_LIST
    : CUISINE_LIST.slice(0, VISIBLE_CUISINES);

  return (
    <div className={`space-y-7 ${className}`}>
      {/* Sort By */}
      <div>
        <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-4">
          Sort By
        </h4>
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
            >
              <div className="flex items-center gap-3">
                <span className="w-[18px] h-[18px] rounded border-2 border-gray-300 group-hover:border-gray-400 flex items-center justify-center transition-all" />
                <span className="text-[13px] text-gray-700 group-hover:text-gray-900 transition-colors">
                  {cuisine.name}
                </span>
              </div>
              <span className="text-[12px] text-gray-400 font-medium">
                {cuisine.count}
              </span>
            </label>
          ))}
        </div>
        {CUISINE_LIST.length > VISIBLE_CUISINES && (
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
