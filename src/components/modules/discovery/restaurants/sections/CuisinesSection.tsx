import React from "react";
import Image from "next/image";
import { Utensils } from "lucide-react";
import { useTranslations } from "next-intl";

import { CuisinesSectionProps } from "@/components/modules/discovery/discovery.types";

const isValidImageSrc = (src?: string) =>
  !!src &&
  (src.startsWith("http://") ||
    src.startsWith("https://") ||
    src.startsWith("/"));

export const CuisinesSection: React.FC<CuisinesSectionProps> = ({
  isCuisinesLoading,
  cuisineTypes,
  activeFilters,
  onCuisineClick,
}) => {
  const t = useTranslations("Discovery.cuisinesSection");
  return (
    <section className="mb-4">
      <h3 className="text-lg font-bold text-gray-900 mb-4">{t("title")}</h3>
      <div className="flex gap-2 md:gap-6 overflow-x-auto pb-2 pl-3 sm:pl-0 scrollbar-hide">
        {isCuisinesLoading
          ? // Skeleton Loading for Cuisines
            Array.from({ length: 8 }).map((_, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center gap-2 min-w-[70px] animate-pulse"
              >
                <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-gray-200" />
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
                    className={`w-16 h-16 md:w-23 md:h-23 rounded-full overflow-hidden border transition-all shadow-sm ${
                      isActive
                        ? "border-primary ring-2 ring-primary/20"
                        : "border-gray-100 group-hover:border-primary"
                    }`}
                  >
                    {isValidImageSrc(cat.image) ? (
                      <Image
                        width={250}
                        height={250}
                        src={cat.image}
                        alt={cat.name}
                        className={`w-full h-full object-cover transition-transform duration-300 ${
                          isActive ? "scale-105" : "group-hover:scale-110"
                        }`}
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <Utensils className="w-5 h-5 md:w-8 md:h-8 text-gray-300" />
                      </div>
                    )}
                  </div>
                  <span
                    className={`text-[11px] font-bold transition-colors whitespace-nowrap ${
                      isActive
                        ? "text-primary"
                        : "text-gray-700 group-hover:text-primary"
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
