"use client";

import { useRef, useEffect, useState } from "react";
import {
  Building2,
  Users,
  BarChart3,
  Clock,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Star,
  Headphones,
  CreditCard,
  Shield,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import PublicHeroSection from "@/components/common/public-website/publicHeroSection";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";

const RTL_LOCALES = ["ar"];

const featureKeys = [
  "team_ordering",
  "spending",
  "billing",
  "scheduled",
  "account_manager",
  "priority",
] as const;
const featureIcons = [Users, BarChart3, CreditCard, Clock, Headphones, Shield];

const stepKeys = ["signup", "add_team", "order", "pay"] as const;

const planKeys = ["starter", "business", "enterprise"] as const;

const testimonialKeys = ["t1", "t2", "t3"] as const;

export default function BusinessPage() {
  const t = useTranslations("Business");
  const locale = useLocale();
  const isRtl = RTL_LOCALES.includes(locale);
  const Arrow = isRtl ? ArrowLeft : ArrowRight;
  const Chevron = isRtl ? ChevronLeft : ChevronRight;
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

  const planFeatureCounts: Record<string, string[]> = {
    starter: ["f1", "f2", "f3", "f4"],
    business: ["f1", "f2", "f3", "f4", "f5", "f6"],
    enterprise: ["f1", "f2", "f3", "f4", "f5", "f6"],
  };

  return (
    <div className="bg-white">
      {/* HERO */}
      <PublicHeroSection
        badge={t("hero.badge")}
        title_p1={t("hero.title_p1")}
        title_highlight={t("hero.title_highlight")}
      />

      {/* INTRO */}
      <section
        id="intro"
        ref={setRef("intro")}
        className="py-20 px-4 sm:px-6 lg:px-8"
      >
        <div
          className={`max-w-4xl mx-auto text-center transition-all duration-700 ${
            visibleSections.intro ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <span className="inline-block bg-primary/10 text-primary text-sm font-semibold px-4 py-2 rounded-full mb-6">
            {t("intro.badge")}
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6 leading-tight">
            {t("intro.title_p1")}{" "}
            <span className="text-primary">{t("intro.title_highlight")}</span>
          </h2>
          <p className="text-lg text-[#64748B] leading-relaxed">{t("intro.desc")}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-white px-8">
              <Link href="/contact">
                {t("intro.get_started")}
                <Arrow className="w-4 h-4 ml-2 rtl:ml-0 rtl:mr-2" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-white px-8"
            >
              <Link href="/contact">
                {t("intro.talk_to_sales")}
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section
        id="features"
        ref={setRef("features")}
        className="py-20 px-4 sm:px-6 lg:px-8 bg-[#FAFAFA]"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-block bg-primary/10 text-primary text-sm font-semibold px-4 py-2 rounded-full mb-6">
              {t("features.badge")}
            </span>
            <h2 className="text-4xl font-bold text-foreground">{t("features.title")}</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featureKeys.map((key, index) => {
              const Icon = featureIcons[index];
              return (
                <div
                  key={key}
                  className={`bg-white rounded-2xl p-6 border border-gray-100 hover:border-primary/30 hover:shadow-lg transition-all duration-500 ${
                    visibleSections.features ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  }`}
                  style={{ transitionDelay: `${index * 80}ms` }}
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">
                    {t(`features.items.${key}.title`)}
                  </h3>
                  <p className="text-[#64748B] text-sm leading-relaxed">
                    {t(`features.items.${key}.desc`)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section
        id="how"
        ref={setRef("how")}
        className="py-20 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-block bg-primary/10 text-primary text-sm font-semibold px-4 py-2 rounded-full mb-6">
              {t("how_it_works.badge")}
            </span>
            <h2 className="text-4xl font-bold text-foreground">{t("how_it_works.title")}</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {stepKeys.map((key, index) => (
              <div
                key={key}
                className={`text-center transition-all duration-700 ${
                  visibleSections.how ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="text-5xl font-bold text-primary/20 mb-4">
                  {String(index + 1).padStart(2, "0")}
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">
                  {t(`how_it_works.steps.${key}.title`)}
                </h3>
                <p className="text-[#64748B] text-sm leading-relaxed">
                  {t(`how_it_works.steps.${key}.desc`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section
        id="pricing"
        ref={setRef("pricing")}
        className="py-20 px-4 sm:px-6 lg:px-8 bg-[#FAFAFA]"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-block bg-primary/10 text-primary text-sm font-semibold px-4 py-2 rounded-full mb-6">
              {t("pricing.badge")}
            </span>
            <h2 className="text-4xl font-bold text-foreground">{t("pricing.title")}</h2>
            <p className="text-[#64748B] mt-4">{t("pricing.subtitle")}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 items-start">
            {planKeys.map((plan, index) => {
              const highlighted = plan === "business";
              return (
                <div
                  key={plan}
                  className={`rounded-3xl p-8 transition-all duration-700 ${
                    highlighted
                      ? "bg-primary text-white shadow-2xl scale-105"
                      : "bg-white border border-gray-100"
                  } ${
                    visibleSections.pricing ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="mb-6">
                    <span
                      className={`text-sm font-semibold px-3 py-1 rounded-full ${
                        highlighted ? "bg-white/10 text-white/90" : "bg-primary/10 text-primary"
                      }`}
                    >
                      {t(`pricing.plans.${plan}.name`)}
                    </span>
                  </div>
                  <div className="flex items-end gap-1 mb-2">
                    <span
                      className={`text-5xl font-bold ${highlighted ? "text-white" : "text-foreground"}`}
                    >
                      {t(`pricing.plans.${plan}.price`)}
                    </span>
                    <span className={`mb-2 ${highlighted ? "text-white/60" : "text-[#64748B]"}`}>
                      {t(`pricing.plans.${plan}.period`)}
                    </span>
                  </div>
                  <p className={`text-sm mb-6 ${highlighted ? "text-white/70" : "text-[#64748B]"}`}>
                    {t(`pricing.plans.${plan}.desc`)}
                  </p>
                  <ul className="space-y-3 mb-8">
                    {planFeatureCounts[plan].map((fk) => (
                      <li key={fk} className="flex items-center gap-2 text-sm">
                        <CheckCircle
                          className={`w-4 h-4 flex-shrink-0 ${highlighted ? "text-white/80" : "text-primary"}`}
                        />
                        <span className={highlighted ? "text-white/80" : "text-[#64748B]"}>
                          {t(`pricing.plans.${plan}.features.${fk}`)}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    asChild
                    className={`w-full ${
                      highlighted
                        ? "bg-white text-primary hover:bg-white/90"
                        : "bg-primary text-white hover:bg-primary/90"
                    }`}
                  >
                    <Link href="/contact">
                      {t(`pricing.plans.${plan}.cta`)}
                      <Chevron className="w-4 h-4 ml-1 rtl:ml-0 rtl:mr-1" />
                    </Link>
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section
        id="testimonials"
        ref={setRef("testimonials")}
        className="py-20 px-4 sm:px-6 lg:px-8 bg-primary relative overflow-hidden"
      >
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/5 rounded-full blur-[150px]" />
        </div>
        <div className="max-w-6xl mx-auto relative">
          <div className="text-center mb-14">
            <span className="inline-block bg-white/10 text-white/90 text-sm font-semibold px-4 py-2 rounded-full mb-6 border border-white/10">
              {t("testimonials.badge")}
            </span>
            <h2 className="text-4xl font-bold text-white">{t("testimonials.title")}</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonialKeys.map((key, index) => (
              <div
                key={key}
                className={`bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-6 transition-all duration-700 ${
                  visibleSections.testimonials ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-[#FE8C34] fill-[#FE8C34]" />
                  ))}
                </div>
                <p className="text-white/80 text-sm leading-relaxed mb-6">
                  &ldquo;{t(`testimonials.items.${key}.quote`)}&rdquo;
                </p>
                <div>
                  <div className="font-bold text-white text-sm">
                    {t(`testimonials.items.${key}.name`)}
                  </div>
                  <div className="text-white/50 text-xs">
                    {t(`testimonials.items.${key}.role`)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <Building2 className="w-14 h-14 text-primary mx-auto mb-6" />
          <h2 className="text-4xl font-bold text-foreground mb-4">{t("cta.title")}</h2>
          <p className="text-[#64748B] text-lg mb-8">{t("cta.desc")}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-white px-8">
              <Link href="/contact">
                {t("cta.create_account")}
                <Arrow className="w-4 h-4 ml-2 rtl:ml-0 rtl:mr-2" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-white px-8"
            >
              <Link href="/contact">
                {t("cta.schedule_demo")}
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
