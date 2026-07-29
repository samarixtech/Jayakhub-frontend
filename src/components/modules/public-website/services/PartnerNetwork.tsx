"use client";

import {
  Info,
  UtensilsCrossed,
  Store,
  ShoppingBag,
  Bike,
  Package,
  Car,
  Building2,
  HeartHandshake,
} from "lucide-react";
import { useTranslations } from "next-intl";

export default function PartnerNetwork() {
  const t = useTranslations("Services.partner_network");

  const roles = [
    { icon: UtensilsCrossed, key: "restaurants", open: true },
    { icon: Store, key: "grocery", open: false },
    { icon: ShoppingBag, key: "shoppers", open: false },
    { icon: Bike, key: "delivery_drivers", open: false },
    { icon: Package, key: "pickup_delivery", open: false },
    { icon: Car, key: "taxi_drivers", open: false },
    { icon: Building2, key: "companies_fleets", open: false },
    { icon: HeartHandshake, key: "other_partners", open: false },
  ] as const;

  return (
    <section className="pt-12 sm:pt-24 pb-6 sm:pb-10 px-4 sm:px-6 lg:px-8 bg-[#FAFAFA]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block bg-primary/10 text-primary text-sm font-semibold px-4 py-2 rounded-full mb-6">
            {t("badge")}
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            {t("title")}
          </h2>
          <p className="text-[#64748B] max-w-2xl mx-auto">{t("subtitle")}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {roles.map((role) => (
            <div
              key={role.key}
              className="bg-white rounded-3xl p-8 shadow-sm text-center flex flex-col items-center"
            >
              <div className="w-12 h-12 mb-4 rounded-xl bg-primary/10 flex items-center justify-center">
                <role.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-bold text-foreground mb-4 leading-snug">
                {t(`items.${role.key}`)}
              </h3>
              <span
                className={`inline-block px-4 py-1 rounded-full text-xs font-bold ${
                  role.open
                    ? "bg-primary text-white"
                    : "bg-[#F59E0B] text-foreground"
                }`}
              >
                {role.open ? t("registration_open") : t("coming_soon")}
              </span>
            </div>
          ))}
        </div>

        <div className="flex items-start justify-center gap-2 max-w-3xl mx-auto mt-10 text-center text-sm text-[#64748B] leading-relaxed">
          <Info className="w-4 h-4 text-[#3B82F6] shrink-0 mt-0.5" />
          <span>{t("footnote")}</span>
        </div>
      </div>
    </section>
  );
}
