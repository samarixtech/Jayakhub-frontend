"use client";

import { useState, useEffect, useRef } from "react";
import {
  ArrowRight,
  ArrowLeft,
  Smartphone,
  MapPin,
  LayoutDashboard,
  Brain,
  Gift,
  Headphones,
  Zap,
  Shield,
  Server,
  Check,
  Quote,
} from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { useCurrency } from "@/hooks/useCurrency";
import Link from "next/link";
import PublicHeroSection from "@/components/common/public-website/publicHeroSection";
import type { ApiPlan } from "@/app/actions/public/plans";

type Props = {
  plans?: ApiPlan[];
};

function formatPrice(price: string): string {
  const num = parseFloat(price);
  if (isNaN(num)) return price;
  return num.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

export default function Services({ plans = [] }: Props) {
  const t = useTranslations("Services");
  const locale = useLocale();
  const Arrow = locale === "ar" ? ArrowLeft : ArrowRight;
  const { symbol: currencySymbol } = useCurrency();
  const [isVisible, setIsVisible] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);
  const [activePlanIndex, setActivePlanIndex] = useState(0);
  const statsRef = useRef<HTMLDivElement>(null);
  const plansScrollRef = useRef<HTMLDivElement>(null);

  const handlePlansScroll = () => {
    const el = plansScrollRef.current;
    if (!el) return;
    const cardWidth = el.scrollWidth / plans.length;
    setActivePlanIndex(Math.round(el.scrollLeft / cardWidth));
  };

  const scrollToIndex = (i: number) => {
    const el = plansScrollRef.current;
    if (!el) return;
    const cardWidth = el.scrollWidth / plans.length;
    el.scrollTo({ left: i * cardWidth, behavior: "smooth" });
  };

  const platformFeatures = [
    {
      icon: Smartphone,
      title: t("platform.features.seamless_journey.title"),
      description: t("platform.features.seamless_journey.desc"),
    },
    {
      icon: MapPin,
      title: t("platform.features.live_tracking.title"),
      description: t("platform.features.live_tracking.desc"),
    },
    {
      icon: LayoutDashboard,
      title: t("platform.features.smart_dashboard.title"),
      description: t("platform.features.smart_dashboard.desc"),
    },
    {
      icon: Brain,
      title: t("platform.features.ai_dispatch.title"),
      description: t("platform.features.ai_dispatch.desc"),
    },
    {
      icon: Gift,
      title: t("platform.features.loyalty.title"),
      description: t("platform.features.loyalty.desc"),
    },
    {
      icon: Headphones,
      title: t("platform.features.support.title"),
      description: t("platform.features.support.desc"),
    },
  ];

  const whyChooseUs = [
    {
      icon: Zap,
      title: t("why_choose.items.fast_apis.title"),
      description: t("why_choose.items.fast_apis.desc"),
    },
    {
      icon: Server,
      title: t("why_choose.items.uptime.title"),
      description: t("why_choose.items.uptime.desc"),
    },
    {
      icon: Shield,
      title: t("why_choose.items.secure.title"),
      description: t("why_choose.items.secure.desc"),
    },
  ];

  const apiPlans = plans.map((plan) => ({
    id: plan.id,
    name: plan.name,
    price: formatPrice(plan.monthlyPrice),
    period: `/ ${plan.billingCycle}`,
    billingCycle: plan.billingCycle,
    features: plan.keywords,
    popular: plan.planType === "premium",
    freeTrialDays: plan.freeTrialDays,
    numericPrice: !isNaN(parseFloat(plan.monthlyPrice)),
  }));

  const staticPlansRaw = t.raw("pricing.plans") as Record<string, { name: string; price: string; period: string; features: Record<string, string> }>;
  const fallbackPlans = Object.entries(staticPlansRaw).map(([id, plan]) => {
    const rawPrice = plan.price.replace(/[$€£¥₹]/g, "").trim();
    const isNumeric = rawPrice !== "Free" && rawPrice !== "Custom" && !isNaN(Number(rawPrice));
    return {
      id,
      name: plan.name,
      price: isNumeric ? rawPrice : plan.price,
      period: plan.period || "/mo",
      billingCycle: "monthly",
      features: Object.values(plan.features),
      popular: id === "pro",
      freeTrialDays: null as number | null,
      numericPrice: isNumeric,
    };
  });

  const pricingPlans = apiPlans.length > 0 ? apiPlans : fallbackPlans;

  const testimonials = [
    {
      quote: t("testimonials.items.t1.quote"),
      name: t("testimonials.items.t1.name"),
      role: t("testimonials.items.t1.role"),
    },
    {
      quote: t("testimonials.items.t2.quote"),
      name: t("testimonials.items.t2.name"),
      role: t("testimonials.items.t2.role"),
    },
    {
      quote: t("testimonials.items.t3.quote"),
      name: t("testimonials.items.t3.name"),
      role: t("testimonials.items.t3.role"),
    },
  ];

  useEffect(() => {
    setIsVisible(true);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setStatsVisible(true);
      },
      { threshold: 0.3 },
    );

    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="bg-white">
      {/* ===== HERO SECTION ===== */}
      <PublicHeroSection
        badge={t("hero.badge")}
        title_p1={t("hero.title_p1")}
        title_highlight={t("hero.title_highlight")}
      />

      {/* ===== STATS ===== */}
      <section ref={statsRef} className="py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {[
              { value: "200K", label: t("stats.users") },
              { value: "120K", label: t("stats.deliveries") },
              { value: "9K", label: t("stats.partners") },
              { value: "4.9", label: t("stats.rating") },
            ].map((stat, index) => (
              <div
                key={stat.label}
                className={`text-center transition-all duration-700 ${statsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="text-4xl sm:text-5xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-[#64748B]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PLATFORM FEATURES ===== */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#FAFAFA]">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mb-16">
            <span className="inline-block bg-primary/10 text-primary text-sm font-semibold px-4 py-2 rounded-full mb-6">
              {t("platform.badge")}
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
              {t("platform.title")}
            </h2>
            <p className="text-lg text-[#64748B]">{t("platform.desc")}</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {platformFeatures.map((feature) => (
              <div
                key={feature.title}
                className="bg-white rounded-2xl p-6 border border-[#E2E8F0] hover:shadow-lg hover:border-primary/20 transition-all"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-[#64748B] text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== WHY CHOOSE US ===== */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block bg-accent-yellow/20 text-primary text-sm font-semibold px-4 py-2 rounded-full mb-6">
              {t("why_choose.badge")}
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground">
              {t("why_choose.title")}
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {whyChooseUs.map((item) => (
              <div key={item.title} className="text-center">
                <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">
                  {item.title}
                </h3>
                <p className="text-[#64748B]">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PRICING ===== */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-primary">
        <div className="max-w-screen-xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block bg-white/10 text-white/80 text-sm font-semibold px-4 py-2 rounded-full mb-6 border border-white/10">
              {t("pricing.badge")}
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              {t("pricing.title")}
            </h2>
            <p className="text-white/60 mx-auto whitespace-nowrap">
              {t("pricing.desc")}
            </p>
          </div>

          {pricingPlans.length === 0 ? (
            <p className="text-center text-white/50 py-8">
              {t("pricing.no_plans") || "No plans available at the moment."}
            </p>
          ) : (
            <>
              <div
                ref={plansScrollRef}
                onScroll={handlePlansScroll}
                className="flex gap-5 overflow-x-auto pb-4 no-scrollbar snap-x snap-mandatory pr-8"
              >
                {pricingPlans.map((plan, idx) => {
                  const isLight = idx % 2 === 0;
                  return (
                    <div
                      key={plan.id}
                      className={`relative flex-none w-[calc(100%-8px)] sm:w-[calc(50%-10px)] lg:w-[calc(30%-14px)] snap-start flex flex-col rounded-2xl p-9 transition-transform duration-300 hover:-translate-y-1 ${isLight
                          ? "bg-white shadow-[0_20px_60px_rgba(0,0,0,0.2)]"
                          : "bg-white/[0.07] border border-white/15"
                        }`}
                    >
                      {/* badges */}
                      <div className="flex flex-wrap gap-2 mb-5 min-h-[26px]">
                        {plan.popular && (
                          <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-3 py-1 rounded-full tracking-wide ${isLight ? "bg-primary text-white" : "bg-white/20 text-white"}`}>
                            ★ {t("pricing.most_popular")}
                          </span>
                        )}
                        {plan.freeTrialDays && (
                          <span className={`inline-flex items-center text-[11px] font-semibold px-3 py-1 rounded-full ${isLight ? "bg-primary/10 text-primary" : "bg-emerald-400/20 text-emerald-300 border border-emerald-400/30"}`}>
                            {plan.freeTrialDays} days free
                          </span>
                        )}
                      </div>

                      {/* billing cycle label */}
                      <p className={`text-xs font-semibold uppercase tracking-widest mb-1 ${isLight ? "text-primary/60" : "text-white/40"}`}>
                        {plan.billingCycle ?? "plan"}
                      </p>

                      {/* plan name */}
                      <h3 className={`text-3xl font-bold mb-5 capitalize leading-tight ${isLight ? "text-foreground" : "text-white"}`}>
                        {plan.name}
                      </h3>

                      {/* price */}
                      <div className={`flex items-end gap-1 mb-6 pb-6 border-b ${isLight ? "border-gray-100" : "border-white/10"}`}>
                        {plan.numericPrice && (
                          <span className={`text-2xl font-bold self-start mt-2 ${isLight ? "text-primary" : "text-white"}`}>
                            {currencySymbol}
                          </span>
                        )}
                        <span className={`text-6xl font-extrabold leading-none ${isLight ? "text-primary" : "text-white"}`}>
                          {plan.price}
                        </span>
                        <span className={`text-sm font-medium mb-1 ${isLight ? "text-[#94A3B8]" : "text-white/50"}`}>
                          {plan.period}
                        </span>
                      </div>

                      {/* features */}
                      <ul className="space-y-3 mb-8 flex-1">
                        {plan.features.map((feature) => (
                          <li key={feature} className="flex items-center gap-3">
                            <span className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${isLight ? "bg-primary/10" : "bg-white/10"}`}>
                              <Check className={`w-3 h-3 ${isLight ? "text-primary" : "text-white"}`} />
                            </span>
                            <span className={`text-base capitalize ${isLight ? "text-[#475569]" : "text-white/70"}`}>
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>

                      {/* cta */}
                      <Link
                        href="/contact"
                        className={`w-full py-4 rounded-xl font-semibold text-base flex justify-center items-center gap-2 transition-all mt-auto ${isLight
                            ? "bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20"
                            : "bg-white/10 text-white hover:bg-white/20 border border-white/20"
                          }`}
                      >
                        {t("pricing.button")}
                        <Arrow className="w-4 h-4" />
                      </Link>
                    </div>
                  );
                })}
              </div>

              {/* single progress bar */}
              {pricingPlans.length > 1 && (
                <div className="flex justify-center mt-6">
                  <div className="w-24 h-1.5 bg-white/20 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-white rounded-full transition-all duration-300"
                      style={{ width: `${((activePlanIndex + 1) / pricingPlans.length) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#FAFAFA]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block bg-primary/10 text-primary text-sm font-semibold px-4 py-2 rounded-full mb-6">
              {t("testimonials.badge")}
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
              {t("testimonials.title")}
            </h2>
            <p className="text-[#64748B]">{t("testimonials.desc")}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.name}
                className="bg-white rounded-3xl p-8 shadow-sm"
              >
                <Quote className="w-10 h-10 text-primary/20 mb-4" />
                <p className="text-[#64748B] mb-6 leading-relaxed">
                  "{testimonial.quote}"
                </p>
                <div>
                  <div className="font-bold text-foreground">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-[#64748B]">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-primary rounded-3xl p-12 md:p-16 text-center relative overflow-hidden">
            <div className="absolute inset-0">
              <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/5 rounded-full blur-[100px]" />
              <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-accent-yellow/10 rounded-full blur-[80px]" />
            </div>

            <div className="relative">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
                {t.rich("cta.title", {
                  br: () => <br />,
                })}
              </h2>
              <p className="text-white/60 max-w-xl mx-auto mb-10 text-lg">
                {t("cta.desc")}
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-white text-primary px-8 py-4 rounded-full font-semibold text-sm hover:bg-white/90 transition-all hover:gap-3"
              >
                {t("cta.button")}
                <Arrow className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
