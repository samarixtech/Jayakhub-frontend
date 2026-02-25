import { useState, useEffect, useRef } from "react";
import {
  ArrowRight,
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
import { useTranslations } from "next-intl";
import Link from "next/link";

export default function Services() {
  const t = useTranslations("Services");
  const [isVisible, setIsVisible] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

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

  const pricingPlans = [
    {
      name: t("pricing.plans.starter.name"),
      price: t("pricing.plans.starter.price"),
      period: t("pricing.plans.starter.period"),
      features: [
        t("pricing.plans.starter.features.f1"),
        t("pricing.plans.starter.features.f2"),
        t("pricing.plans.starter.features.f3"),
      ],
      popular: false,
    },
    {
      name: t("pricing.plans.pro.name"),
      price: t("pricing.plans.pro.price"),
      period: t("pricing.plans.pro.period"),
      features: [
        t("pricing.plans.pro.features.f1"),
        t("pricing.plans.pro.features.f2"),
        t("pricing.plans.pro.features.f3"),
      ],
      popular: true,
    },
    {
      name: t("pricing.plans.enterprise.name"),
      price: t("pricing.plans.enterprise.price"),
      period: t("pricing.plans.enterprise.period"),
      features: [
        t("pricing.plans.enterprise.features.f1"),
        t("pricing.plans.enterprise.features.f2"),
        t("pricing.plans.enterprise.features.f3"),
      ],
      popular: false,
    },
  ];

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
      <section className="bg-primary pt-20 pb-34 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent-yellow/10 rounded-full blur-[100px]" />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        <div className="max-w-5xl mx-auto text-center relative">
          <span className="inline-block bg-white/10 text-white/90 text-sm font-semibold px-4 py-2 rounded-full mb-8 border border-white/10">
            {t("hero.badge")}
          </span>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight mb-8 flex flex-col items-center">
            <span>{t("hero.title_p1")}</span>
            <span className="text-[#fe8c34] relative mt-2 md:mt-0">
              {t("hero.title_highlight")}
              {/* Custom Underline Curve */}
              <svg
                viewBox="0 0 300 20"
                fill="none"
                className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[110%] h-auto text-[#fe8c34]"
              >
                <path
                  d="M10 15C100 5 200 5 290 15"
                  stroke="currentColor"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 100"
            fill="none"
            className="w-full"
            preserveAspectRatio="none"
          >
            <path
              d="M0 100L60 90C120 80 240 60 360 50C480 40 600 40 720 45C840 50 960 60 1080 65C1200 70 1320 70 1380 70L1440 70V100H0Z"
              fill="white"
            />
          </svg>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section ref={statsRef} className="py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {[
              { value: "200K+", label: t("stats.users") },
              { value: "120K+", label: t("stats.deliveries") },
              { value: "9K+", label: t("stats.partners") },
              { value: "4.9★", label: t("stats.rating") },
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
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block bg-white/10 text-white/80 text-sm font-semibold px-4 py-2 rounded-full mb-6 border border-white/10">
              {t("pricing.badge")}
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              {t("pricing.title")}
            </h2>
            <p className="text-white/60 max-w-xl mx-auto">
              {t("pricing.desc")}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {pricingPlans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-3xl p-8 ${
                  plan.popular
                    ? "bg-white shadow-2xl scale-105"
                    : "bg-white/10 backdrop-blur-sm border border-white/10"
                }`}
              >
                {plan.popular && (
                  <span className="inline-block bg-accent-yellow text-primary text-xs font-bold px-3 py-1 rounded-full mb-4">
                    {t("pricing.most_popular")}
                  </span>
                )}
                <h3
                  className={`text-xl font-bold mb-2 ${plan.popular ? "text-foreground" : "text-white"}`}
                >
                  {plan.name}
                </h3>
                <div
                  className={`text-4xl font-bold mb-6 ${plan.popular ? "text-primary" : "text-white"}`}
                >
                  {plan.price}
                  <span
                    className={`text-lg font-normal ${plan.popular ? "text-[#64748B]" : "text-white/60"}`}
                  >
                    {plan.period}
                  </span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className={`flex items-center gap-3 ${plan.popular ? "text-[#64748B]" : "text-white/70"}`}
                    >
                      <Check
                        className={`w-5 h-5 ${plan.popular ? "text-primary" : "text-accent-yellow"}`}
                      />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/contact"
                  className={`w-full py-6 rounded-full font-semibold flex justify-center items-center ${
                    plan.popular
                      ? "bg-primary text-white hover:bg-primary/90"
                      : "bg-white/20 text-white hover:bg-white/30"
                  }`}
                >
                  {t("pricing.button")}
                </Link>
              </div>
            ))}
          </div>
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
                className="inline-flex items-center gap-2 bg-white text-primary px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/90 transition-all hover:gap-3"
              >
                {t("cta.button")}
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
