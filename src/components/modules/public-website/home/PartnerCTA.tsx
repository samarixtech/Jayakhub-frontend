"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

export default function PartnerCTA() {
  const t = useTranslations("PartnerPage");

  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-brand-orange to-gold-deep text-center">
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
        {t("cta.title")}
      </h2>
      <p className="text-white/90 text-base sm:text-lg mb-8 max-w-2xl mx-auto">
        {t("cta.subtitle")}
      </p>
      <Link
        href="/partners"
        className="inline-block bg-white text-brand-orange hover:bg-white/90 font-bold px-8 py-4 rounded-full transition-all hover:scale-105 shadow-lg"
      >
        {t("cta.button")}
      </Link>
    </section>
  );
}
