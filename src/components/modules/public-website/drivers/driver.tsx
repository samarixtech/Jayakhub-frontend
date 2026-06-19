"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import {
  ArrowRight,
  TrendingUp,
  Clock,
  Wallet,
  Headphones,
  Gift,
  Shield,
  Smartphone,
  Bike,
  User,
  ShieldAlert,
} from "lucide-react";

const RTL_LOCALES = ["ar", "ur", "fa", "he"];

export default function Driver() {
  const t = useTranslations('DriverPage');
  const locale = useLocale();
  const dir = RTL_LOCALES.includes(locale) ? "rtl" : "ltr";
  const isRtl = dir === "rtl";

  const stats = [
    { value: "1,500", label: t("stats.partners") },
    { value: "21.5K", label: t("stats.revenue") },
    { value: "500", label: t("stats.orders") },
    { value: "4.9", label: t("stats.rating") },
  ];

  const benefitsKeys = ['revenue', 'reach', 'dashboard', 'analytics', 'hours', 'support'];
  const benefitIcons = {
    revenue: TrendingUp,
    reach: Clock,
    dashboard: Wallet,
    analytics: Headphones,
    hours: Gift,
    support: Shield,
  };

  const stepsKeys = ['signup', 'approve', 'menu', 'orders'];
  const stepImages = [
    "/gourmet.jpg",
    "/mixed-grill.jpg",
    "/mobileApp.png",
    "/For-riders.png",
  ];

  const reqKeys = ['age', 'vehicle', 'phone', 'background'];
  const reqIcons = {
    age: User,
    vehicle: Bike,
    phone: Smartphone,
    background: ShieldAlert,
  };

  const testimonialKeys = ['t1', 't2', 't3'];
  const testimonialNames = ['Ahmed Hassan', 'Sara Al-Mousa', 'Omar Khalil'];
  const testimonialAvatars = ['AH', 'SM', 'OK'];

  return (
    <main dir={dir} className="text-[#1a1a1a] bg-white font-sans overflow-x-hidden">
      {/* HERO SECTION */}
      <section className="bg-[#0B5D4E] pt-28 pb-40 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background Decorative Circles */}
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-white/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-[#FE8C34]/10 rounded-full blur-[80px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-start"
            >
              <span className="inline-block bg-white/10 text-white font-semibold text-xs py-2 px-4 rounded-full tracking-wider uppercase mb-6">
                {t('hero.badge')}
              </span>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight mb-6">
                {t('hero.title_line1')} {t('hero.title_line2')}{" "}
                <span className="text-[#FE8C34] block sm:inline-block relative">
                  {t('hero.title_highlight')}
                  <svg
                    className={`absolute w-full h-3 -bottom-2 left-0 text-[#FE8C34] ${isRtl ? "scale-x-[-1]" : ""}`}
                    viewBox="0 0 200 9"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2.00025 6.99997C25.7954 3.73711 96.0963 -1.2294 197.906 5.64571"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </h1>

              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button
                  className="bg-[#FE8C34] hover:bg-[#e0751f] text-white py-4 px-8 rounded-full font-bold text-base transition-all hover:scale-105 shadow-lg flex items-center justify-center gap-2"
                >
                  {t('hero.buttons.partner')}
                  <ArrowRight className={`w-5 h-5 ${isRtl ? "rotate-180" : ""}`} />
                </button>
                <button
                  className="bg-white/10 hover:bg-white/25 border border-white/20 text-white py-4 px-8 rounded-full font-bold text-base transition-all flex items-center justify-center"
                >
                  {t('hero.buttons.learn_more')}
                </button>
              </div>
            </motion.div>

            {/* Right Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative aspect-[4/3] w-full rounded-[2rem] overflow-hidden border-[6px] border-white/10 shadow-2xl"
            >
              <Image
                src="/drive your way on to financial freedom.png"
                alt="Driver with pizza boxes"
                fill
                priority
                className="object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <section className="relative z-20 -mt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-xl border border-slate-100 p-8 lg:p-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center space-y-1">
                <div className="text-3xl lg:text-4xl font-extrabold text-[#0B5D4E]">
                  {stat.value}
                </div>
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFITS SECTION */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-50/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-4" dangerouslySetInnerHTML={{ __html: t.raw('benefits.title') }}></h2>
            <p className="text-slate-500 text-lg">{t('benefits.subtitle')}</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefitsKeys.map((key) => {
              const Icon = benefitIcons[key as keyof typeof benefitIcons];
              return (
                <div
                  key={key}
                  className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group"
                >
                  <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#0B5D4E] group-hover:text-white transition-colors text-[#0B5D4E]">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{t(`benefits.items.${key}.title`)}</h3>
                  <p className="text-slate-500 leading-relaxed text-sm">{t(`benefits.items.${key}.desc`)}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-4">{t('how_it_works.title')}</h2>
            <p className="text-slate-500 text-lg">{t('how_it_works.subtitle')}</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {stepsKeys.map((key, i) => (
              <div key={key} className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 group">
                <div className="aspect-square rounded-2xl overflow-hidden relative mb-6">
                  <Image
                    src={stepImages[i]}
                    alt={t(`how_it_works.steps.${key}.title`)}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 w-10 h-10 bg-white/95 backdrop-blur rounded-full flex items-center justify-center shadow-md font-bold text-[#0B5D4E]">
                    {i + 1}
                  </div>
                </div>
                <div className="px-2 pb-2">
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{t(`how_it_works.steps.${key}.title`)}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{t(`how_it_works.steps.${key}.desc`)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REQUIREMENTS SECTION */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="bg-[#0B5D4E] rounded-3xl p-8 md:p-12 text-white relative overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-white/5 rounded-full blur-[80px] pointer-events-none" />

            <div className="relative z-10 grid lg:grid-cols-12 gap-10 items-center">
              {/* Info columns */}
              <div className="lg:col-span-5 space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold leading-tight">{t('requirements.title')}</h2>
                <p className="text-emerald-100/80 leading-relaxed text-sm md:text-base">{t('requirements.subtitle')}</p>
                <div className="pt-4">
                  <button
                    className="bg-white hover:bg-emerald-50 text-[#0B5D4E] font-bold px-8 py-3.5 rounded-full inline-flex items-center justify-center transition-all hover:scale-105 text-sm"
                  >
                    {t('cta.button')}
                  </button>
                </div>
              </div>

              {/* Requirement Cards grid */}
              <div className="lg:col-span-7 grid sm:grid-cols-2 gap-6">
                {reqKeys.map((key) => {
                  const Icon = reqIcons[key as keyof typeof reqIcons];
                  return (
                    <div key={key} className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:bg-white/15 transition-colors">
                      <div className="w-10 h-10 bg-white/15 rounded-lg flex items-center justify-center mb-4 text-[#FE8C34]">
                        <Icon className="w-5 h-5" />
                      </div>
                      <h3 className="text-lg font-bold mb-1.5">{t(`requirements.items.${key}.title`)}</h3>
                      <p className="text-emerald-100/70 text-sm leading-relaxed">{t(`requirements.items.${key}.desc`)}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-50/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-4">{t('testimonials.title')}</h2>
            <p className="text-slate-500 text-lg">{t('testimonials.subtitle')}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonialKeys.map((key, i) => (
              <div key={key} className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="text-[#FE8C34] text-5xl font-serif leading-none mb-4">“</div>
                  <p className="text-slate-600 italic text-base leading-relaxed mb-8">
                    {t(`testimonials.items.${key}.quote`)}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-[#0B5D4E] font-bold text-sm shrink-0 border border-emerald-100">
                    {testimonialAvatars[i]}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{testimonialNames[i]}</h4>
                    <p className="text-xs text-slate-400 font-medium">{t(`testimonials.items.${key}.role`)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BOTTOM CTA SECTION */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="bg-[#0B5D4E] rounded-3xl p-12 text-center relative overflow-hidden shadow-xl">
            <div className="absolute inset-0">
              <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/5 rounded-full blur-[100px] pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#FE8C34]/10 rounded-full blur-[80px] pointer-events-none" />
            </div>

            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
              <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">{t('cta.title')}</h2>
              <p className="text-emerald-100/80 text-lg max-w-lg mx-auto">{t('cta.subtitle')}</p>
              <div className="pt-4">
                <button
                  className="bg-white hover:bg-emerald-50 text-[#0B5D4E] font-bold px-8 py-4 rounded-full inline-flex items-center justify-center transition-all hover:scale-105 shadow-lg text-base"
                >
                  {t('cta.button')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
