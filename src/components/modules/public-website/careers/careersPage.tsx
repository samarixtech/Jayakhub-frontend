"use client";

import { useState, useRef, useEffect } from "react";
import {
  Briefcase,
  MapPin,
  Clock,
  ArrowRight,
  ArrowLeft,
  ChevronDown,
  Star,
  Users,
  Zap,
  Heart,
  Globe,
  Coffee,
  Shield,
  TrendingUp,
  Laptop,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import PublicHeroSection from "@/components/common/public-website/publicHeroSection";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";

const RTL_LOCALES = ["ar"];

const departmentKeys = ["all", "engineering", "operations", "marketing", "design", "finance"] as const;

const openingKeys = ["job1", "job2", "job3", "job4", "job5", "job6", "job7", "job8"] as const;

const valueKeys = ["move_fast", "people_first", "raise_bar", "think_local"] as const;
const valueIcons = [Zap, Users, Star, Globe];

const benefitKeys = ["grow", "flexible", "health", "meals", "equipment", "learning"] as const;
const benefitIcons = [TrendingUp, Globe, Heart, Coffee, Laptop, Shield];

export default function CareersPage() {
  const t = useTranslations("Careers");
  const locale = useLocale();
  const isRtl = RTL_LOCALES.includes(locale);
  const Arrow = isRtl ? ArrowLeft : ArrowRight;
  const [activeFilter, setActiveFilter] = useState("all");
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
      { threshold: 0.15 }
    );
    Object.values(sectionRefs.current).forEach((el) => {
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const setRef = (id: string) => (el: HTMLElement | null) => {
    sectionRefs.current[id] = el;
  };

  const filtered =
    activeFilter === "all"
      ? openingKeys
      : openingKeys.filter((key) => {
        const dept = t(`roles.openings.${key}.department`);
        const label = t(`roles.departments.${activeFilter}`);
        return dept === label;
      });

  return (
    <div className="bg-white">
      {/* HERO */}
      <PublicHeroSection
        badge={t("hero.badge")}
        title_p1={t("hero.title_p1")}
        title_highlight={t("hero.title_highlight")}
      />

      {/* MISSION */}
      <section
        id="mission"
        ref={setRef("mission")}
        className="py-20 px-4 sm:px-6 lg:px-8"
      >
        <div
          className={`max-w-4xl mx-auto text-center transition-all duration-700 ${visibleSections.mission ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
        >
          <span className="inline-block bg-primary/10 text-primary text-sm font-semibold px-4 py-2 rounded-full mb-6">
            {t("mission.badge")}
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6 leading-tight">
            {t("mission.title_p1")}{" "}
            <span className="text-primary">{t("mission.title_highlight")}</span>
          </h2>
          <p className="text-lg text-[#64748B] leading-relaxed">{t("mission.desc")}</p>
        </div>
      </section>

      {/* VALUES */}
      <section
        id="values"
        ref={setRef("values")}
        className="py-20 px-4 sm:px-6 lg:px-8 bg-[#FAFAFA]"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-block bg-primary/10 text-primary text-sm font-semibold px-4 py-2 rounded-full mb-6">
              {t("values.badge")}
            </span>
            <h2 className="text-4xl font-bold text-foreground">{t("values.title")}</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {valueKeys.map((key, index) => {
              const Icon = valueIcons[index];
              return (
                <div
                  key={key}
                  className={`transition-all duration-700 ${visibleSections.values ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                    }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">
                    {t(`values.items.${key}.title`)}
                  </h3>
                  <p className="text-[#64748B] text-sm leading-relaxed">
                    {t(`values.items.${key}.desc`)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* OPEN ROLES */}
      <section
        id="roles"
        ref={setRef("roles")}
        className="py-20 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block bg-primary/10 text-primary text-sm font-semibold px-4 py-2 rounded-full mb-6">
              {t("roles.badge")}
            </span>
            <h2 className="text-4xl font-bold text-foreground">{t("roles.title")}</h2>
          </div>

          {/* Department filter */}
          <div className="flex flex-wrap gap-3 justify-center mb-10">
            {departmentKeys.map((dept) => (
              <button
                key={dept}
                onClick={() => setActiveFilter(dept)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${activeFilter === dept
                    ? "bg-primary text-white shadow-md"
                    : "bg-white border border-gray-200 text-[#64748B] hover:border-primary hover:text-primary"
                  }`}
              >
                {t(`roles.departments.${dept}`)}
              </button>
            ))}
          </div>

          {/* Job cards */}
          <div className="space-y-4">
            {filtered.map((key, index) => (
              <div
                key={key}
                className={`group bg-white border border-gray-100 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-primary/30 hover:shadow-md transition-all duration-300 ${visibleSections.roles ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                  }`}
                style={{ transitionDelay: `${index * 60}ms` }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Briefcase className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                      {t(`roles.openings.${key}.title`)}
                    </h3>
                    <p className="text-sm text-[#64748B] mt-1 mb-2">
                      {t(`roles.openings.${key}.description`)}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-[#64748B]">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {t(`roles.openings.${key}.location`)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {t(`roles.openings.${key}.type`)}
                      </span>
                      <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                        {t(`roles.openings.${key}.department`)}
                      </span>
                    </div>
                  </div>
                </div>
                <Button
                  asChild
                  variant="outline"
                  className="shrink-0 border-primary text-primary hover:bg-primary hover:text-white transition-all"
                >
                  <Link href="/contact">
                    {t("roles.apply_btn")}
                    <Arrow className="w-4 h-4 ml-1 rtl:ml-0 rtl:mr-1" />
                  </Link>
                </Button>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16 text-[#64748B]">
              {t("roles.no_openings")}
            </div>
          )}
        </div>
      </section>

      {/* BENEFITS */}
      <section
        id="benefits"
        ref={setRef("benefits")}
        className="py-20 px-4 sm:px-6 lg:px-8 bg-primary relative overflow-hidden"
      >
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/5 rounded-full blur-[150px]" />
        </div>
        <div className="max-w-6xl mx-auto relative">
          <div className="text-center mb-14">
            <span className="inline-block bg-white/10 text-white/90 text-sm font-semibold px-4 py-2 rounded-full mb-6 border border-white/10">
              {t("benefits.badge")}
            </span>
            <h2 className="text-4xl font-bold text-white">{t("benefits.title")}</h2>
            <p className="text-white/60 mt-4 max-w-xl mx-auto">{t("benefits.desc")}</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefitKeys.map((key, index) => {
              const Icon = benefitIcons[index];
              return (
                <div
                  key={key}
                  className={`bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/15 transition-all duration-700 ${visibleSections.benefits ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                    }`}
                  style={{ transitionDelay: `${index * 80}ms` }}
                >
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">
                    {t(`benefits.items.${key}.title`)}
                  </h3>
                  <p className="text-white/60 text-sm leading-relaxed">
                    {t(`benefits.items.${key}.desc`)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#FAFAFA]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-foreground mb-4">{t("cta.title")}</h2>
          <p className="text-[#64748B] text-lg mb-8">{t("cta.desc")}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-white px-8">
              <Link href="/contact">
                {t("cta.open_application")}
                <Arrow className="w-4 h-4 ml-2 rtl:ml-0 rtl:mr-2" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-white px-8"
            >
              <Link href="/about-us">
                {t("cta.learn_more")}
                <ChevronDown className="w-4 h-4 ml-1 rtl:ml-0 rtl:mr-1" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
