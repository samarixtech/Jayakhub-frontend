"use client";

import { useRef, useEffect, useState } from "react";
import {
  Newspaper,
  Download,
  ExternalLink,
  Mail,
  Calendar,
  ArrowRight,
  ArrowLeft,
  Radio,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import PublicHeroSection from "@/components/common/public-website/publicHeroSection";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";

const RTL_LOCALES = ["ar"];

const statKeys = ["founded", "partners", "orders", "cities"] as const;
const releaseKeys = ["r1", "r2", "r3", "r4", "r5", "r6"] as const;
const mediaKeys = ["m1", "m2", "m3", "m4", "m5", "m6"] as const;
const awardKeys = ["a1", "a2", "a3", "a4", "a5", "a6"] as const;
const mediaKitFeatures = ["f1", "f2", "f3", "f4", "f5"] as const;

const categoryColors: Record<string, string> = {
  Funding: "bg-emerald-100 text-emerald-700",
  Expansion: "bg-blue-100 text-blue-700",
  Product: "bg-purple-100 text-purple-700",
  Milestone: "bg-amber-100 text-amber-700",
  Partnership: "bg-orange-100 text-orange-700",
  Community: "bg-rose-100 text-rose-700",
  تمويل: "bg-emerald-100 text-emerald-700",
  توسع: "bg-blue-100 text-blue-700",
  منتج: "bg-purple-100 text-purple-700",
  إنجاز: "bg-amber-100 text-amber-700",
  شراكة: "bg-orange-100 text-orange-700",
  مجتمع: "bg-rose-100 text-rose-700",
};

export default function PressPage() {
  const t = useTranslations("Press");
  const locale = useLocale();
  const isRtl = RTL_LOCALES.includes(locale);
  const Arrow = isRtl ? ArrowLeft : ArrowRight;
  const [visibleSections, setVisibleSections] = useState<Record<string, boolean>>({});
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.target.id) {
            setVisibleSections((prev) => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );
    Object.values(sectionRefs.current).forEach((el) => {
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const setRef = (id: string) => (el: HTMLElement | null) => {
    sectionRefs.current[id] = el;
  };

  return (
    <div className="bg-white">
      {/* HERO */}
      <PublicHeroSection
        badge={t("hero.badge")}
        title_p1={t("hero.title_p1")}
        title_highlight={t("hero.title_highlight")}
      />

      {/* STATS */}
      <section
        id="stats"
        ref={setRef("stats")}
        className="py-16 px-4 sm:px-6 lg:px-8 border-b border-gray-100"
      >
        <div className="max-w-6xl mx-auto">
          <div
            className={`grid grid-cols-2 lg:grid-cols-4 gap-8 text-center transition-all duration-700 ${
              visibleSections.stats ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            {statKeys.map((key) => (
              <div key={key}>
                <div className="text-4xl sm:text-5xl font-bold text-primary mb-2">
                  {t(`stats.${key}.value`)}
                </div>
                <div className="text-[#64748B] text-sm">{t(`stats.${key}.label`)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRESS RELEASES */}
      <section
        id="releases"
        ref={setRef("releases")}
        className="py-20 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-4">
            <div>
              <span className="inline-block bg-primary/10 text-primary text-sm font-semibold px-4 py-2 rounded-full mb-4">
                {t("releases.badge")}
              </span>
              <h2 className="text-4xl font-bold text-foreground">{t("releases.title")}</h2>
            </div>
            <Button
              asChild
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-white"
            >
              <Link href="/blogs">
                <Newspaper className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
                {t("releases.all_releases")}
              </Link>
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {releaseKeys.map((key, index) => {
              const category = t(`releases.items.${key}.category`);
              return (
                <article
                  key={key}
                  className={`group bg-white border border-gray-100 rounded-2xl p-6 hover:border-primary/30 hover:shadow-lg transition-all duration-500 ${
                    visibleSections.releases ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  }`}
                  style={{ transitionDelay: `${index * 80}ms` }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full ${
                        categoryColors[category] ?? "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {category}
                    </span>
                    <span className="text-xs text-[#64748B] flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {t(`releases.items.${key}.date`)}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-3 group-hover:text-primary transition-colors leading-snug">
                    {t(`releases.items.${key}.title`)}
                  </h3>
                  <p className="text-sm text-[#64748B] leading-relaxed mb-4">
                    {t(`releases.items.${key}.excerpt`)}
                  </p>
                  <a
                    href="#"
                    className="inline-flex items-center gap-1 text-sm text-primary font-semibold hover:gap-2 transition-all"
                  >
                    {t("releases.read_more")}
                    <Arrow className="w-4 h-4" />
                  </a>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* FEATURED IN */}
      <section
        id="media"
        ref={setRef("media")}
        className="py-20 px-4 sm:px-6 lg:px-8 bg-[#FAFAFA]"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block bg-primary/10 text-primary text-sm font-semibold px-4 py-2 rounded-full mb-6">
              {t("media.badge")}
            </span>
            <h2 className="text-4xl font-bold text-foreground">{t("media.title")}</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {mediaKeys.map((key, index) => (
              <div
                key={key}
                className={`bg-white border border-gray-100 rounded-2xl p-6 flex items-center gap-4 hover:border-primary/30 hover:shadow-md transition-all duration-500 group ${
                  visibleSections.media ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${index * 80}ms` }}
              >
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Radio className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="font-bold text-foreground group-hover:text-primary transition-colors">
                    {t(`media.items.${key}.name`)}
                  </div>
                  <div className="text-sm text-[#64748B]">{t(`media.items.${key}.desc`)}</div>
                </div>
                <ExternalLink className="w-4 h-4 text-[#64748B] ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AWARDS */}
      <section
        id="awards"
        ref={setRef("awards")}
        className="py-20 px-4 sm:px-6 lg:px-8 bg-primary relative overflow-hidden"
      >
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/5 rounded-full blur-[150px]" />
        </div>
        <div className="max-w-6xl mx-auto relative">
          <div className="text-center mb-12">
            <span className="inline-block bg-white/10 text-white/90 text-sm font-semibold px-4 py-2 rounded-full mb-6 border border-white/10">
              {t("awards.badge")}
            </span>
            <h2 className="text-4xl font-bold text-white">{t("awards.title")}</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {awardKeys.map((key, index) => (
              <div
                key={key}
                className={`bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-5 flex gap-4 items-start transition-all duration-700 ${
                  visibleSections.awards ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${index * 80}ms` }}
              >
                <Award className="w-6 h-6 text-[#FE8C34] flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-white text-sm">{t(`awards.items.${key}.award`)}</div>
                  <div className="text-white/50 text-xs mt-1">{t(`awards.items.${key}.body`)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MEDIA KIT & PRESS CONTACT */}
      <section
        id="contact"
        ref={setRef("contact")}
        className="py-20 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Media Kit */}
            <div
              className={`bg-[#FAFAFA] rounded-3xl p-8 transition-all duration-700 ${
                visibleSections.contact ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
              }`}
            >
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                <Download className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">{t("media_kit.title")}</h3>
              <p className="text-[#64748B] mb-6 leading-relaxed">{t("media_kit.desc")}</p>
              <ul className="space-y-2 text-sm text-[#64748B] mb-8">
                {mediaKitFeatures.map((fk) => (
                  <li key={fk} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                    {t(`media_kit.features.${fk}`)}
                  </li>
                ))}
              </ul>
              <Button asChild className="bg-primary text-white hover:bg-primary/90">
                <Link href="/contact">
                  <Download className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
                  {t("media_kit.download_btn")}
                </Link>
              </Button>
            </div>

            {/* Press Contact */}
            <div
              className={`bg-primary rounded-3xl p-8 text-white transition-all duration-700 ${
                visibleSections.contact ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
              }`}
            >
              <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
                <Mail className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">{t("press_contact.title")}</h3>
              <p className="text-white/70 mb-6 leading-relaxed">{t("press_contact.desc")}</p>
              <div className="space-y-4 mb-8">
                <div className="bg-white/10 rounded-xl p-4">
                  <div className="text-xs text-white/50 mb-1">
                    {t("press_contact.inquiries_label")}
                  </div>
                  <div className="font-semibold">{t("press_contact.inquiries_email")}</div>
                </div>
                <div className="bg-white/10 rounded-xl p-4">
                  <div className="text-xs text-white/50 mb-1">
                    {t("press_contact.contact_name_label")}
                  </div>
                  <div className="font-semibold">{t("press_contact.contact_name")}</div>
                  <div className="text-white/60 text-sm">{t("press_contact.contact_email")}</div>
                </div>
              </div>
              <Button asChild className="bg-white text-primary hover:bg-white/90 w-full">
                <Link href="mailto:press@jayakhub.com">
                  <Mail className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
                  {t("press_contact.contact_btn")}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
