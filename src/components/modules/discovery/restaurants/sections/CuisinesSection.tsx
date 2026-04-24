import React from "react";
import Image from "next/image";

import { CuisinesSectionProps } from "@/components/modules/discovery/discovery.types";

export const CuisinesSection: React.FC<CuisinesSectionProps> = ({
  isCuisinesLoading,
  cuisineTypes,
  activeFilters,
  onCuisineClick,
}) => {
  return (
    <section className="mb-8">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Cuisines</h3>
      <div className="flex gap-12 md:gap-6 overflow-x-auto pb-2 pl-3 sm:pl-0 scrollbar-hide">
        {isCuisinesLoading
          ? // Skeleton Loading for Cuisines
            Array.from({ length: 8 }).map((_, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center gap-2 min-w-[70px] animate-pulse"
              >
                <div className="w-24 h-24 rounded-full bg-gray-200" />
                <div className="w-12 h-3 rounded bg-gray-200" />
              </div>
            ))
          : (cuisineTypes || []).map((cat: any, index: number) => {
              const isActive = activeFilters.includes(cat.name);
              return (
                <button
                  key={index}
                  onClick={() => onCuisineClick(cat.name)}
                  className="flex flex-col items-center gap-2 min-w-[70px] group"
                >
                  <div
                    className={`w-23 h-23 rounded-full overflow-hidden border transition-all shadow-sm ${
                      isActive
                        ? "border-[#346853] ring-2 ring-[#346853]/20"
                        : "border-gray-100 group-hover:border-[#346853]"
                    }`}
                  >
                    <Image
                      width={250}
                      height={250}
                      src={cat.image}
                      alt={cat.name}
                      className={`w-full h-full object-cover transition-transform duration-300 ${
                        isActive ? "scale-105" : "group-hover:scale-110"
                      }`}
                    />
                  </div>
                  <span
                    className={`text-[11px] font-bold transition-colors whitespace-nowrap ${
                      isActive
                        ? "text-[#346853]"
                        : "text-gray-700 group-hover:text-[#346853]"
                    }`}
                  >
                    {cat.name}
                  </span>
                </button>
              );
            })}
      </div>
    </section>
  );
};
