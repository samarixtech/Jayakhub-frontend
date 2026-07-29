"use client";

import { useEffect, useRef, useState } from "react";
import {
  Info,
  UtensilsCrossed,
  ShoppingCart,
  ClipboardList,
  PackageCheck,
  Car,
} from "lucide-react";
import { useTranslations } from "next-intl";

export default function PlatformServices() {
  const t = useTranslations("Home.platform_services");
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const services = [
    { icon: UtensilsCrossed, key: "restaurant_delivery", available: true },
    { icon: ShoppingCart, key: "grocery_delivery", available: false },
    { icon: ClipboardList, key: "shopping_list", available: false },
    { icon: PackageCheck, key: "pickup_dropoff", available: false },
    { icon: Car, key: "request_car", available: false },
  ] as const;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-8 bg-[#FAF8F5] px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-6xl mx-auto text-center">
        <span className="text-[#A16207] font-bold text-sm mb-2 block tracking-wide">
          {t("badge")}
        </span>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0F2942] mb-3 tracking-tight">
          {t("title")}
        </h2>
        <p className="text-[#64748B] text-sm sm:text-base max-w-2xl mx-auto mb-10 md:mb-14 leading-relaxed">
          {t("subtitle")}
        </p>

        <div
          className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-5 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {services.map((service) => (
            <div
              key={service.key}
              className={`bg-white rounded-2xl p-5 md:p-6 flex flex-col items-center justify-between text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-md min-h-[200px] ${
                service.available
                  ? "border-2 border-[#EAB308] shadow-sm"
                  : "border border-[#E2E8F0]"
              }`}
            >
              <div className="w-12 h-12 mb-4 rounded-xl bg-primary/10 flex items-center justify-center">
                <service.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-bold text-[#0F2942] text-sm sm:text-base mb-4 leading-snug">
                {t(`items.${service.key}`)}
              </h3>
              <span
                className={`inline-block px-4 py-1 rounded-full text-xs font-bold ${
                  service.available
                    ? "bg-[#1E6535] text-white"
                    : "bg-[#F59E0B] text-[#0F2942]"
                }`}
              >
                {service.available ? t("available") : t("coming_soon")}
              </span>
            </div>
          ))}
        </div>

        <div className="flex items-start justify-center gap-2 max-w-3xl mx-auto mt-8 md:mt-12 text-center text-xs sm:text-sm text-[#64748B] leading-relaxed">
          <Info className="w-4 h-4 text-[#3B82F6] shrink-0 mt-0.5" />
          <span>{t("footnote")}</span>
        </div>
      </div>
    </section>
  );
}
