// import { useState, useEffect, useRef } from "react";
// import {
//   ArrowRight,
//   TrendingUp,
//   Users,
//   BarChart3,
//   Clock,
//   HeadphonesIcon,
//   Check,
//   Quote,
//   LayoutDashboard,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { useTranslations } from "next-intl";
// import Image from "next/image";
// import Link from "next/link";

// import growImg from "../../../../../public/grow.png";
// import restaurantOwnerImg from "../../../../../public/restaurant-owner.png";
// import gourmetImg from "../../../../../public/gourmet.jpg";
// import baghdadBitesImg from "../../../../../public/baghdad-bites.jpg";
// import mixedGrillImg from "../../../../../public/mixed-grill.jpg";
// import partnerImage2Img from "../../../../../public/partner-image2.jpg";

// export default function Partners() {
//   const t = useTranslations("Partners");
//   const [isVisible, setIsVisible] = useState(false);

//   const stats = [
//     { value: "5,000+", label: t("stats.partners") },
//     { value: "30%", label: t("stats.revenue") },
//     { value: "1M+", label: t("stats.orders") },
//     { value: "4.8★", label: t("stats.rating") },
//   ];

//   const benefits = [
//     {
//       icon: TrendingUp,
//       title: t("benefits.items.revenue.title"),
//       description: t("benefits.items.revenue.desc"),
//     },
//     {
//       icon: Users,
//       title: t("benefits.items.reach.title"),
//       description: t("benefits.items.reach.desc"),
//     },
//     {
//       icon: LayoutDashboard,
//       title: t("benefits.items.dashboard.title"),
//       description: t("benefits.items.dashboard.desc"),
//     },
//     {
//       icon: BarChart3,
//       title: t("benefits.items.analytics.title"),
//       description: t("benefits.items.analytics.desc"),
//     },
//     {
//       icon: Clock,
//       title: t("benefits.items.hours.title"),
//       description: t("benefits.items.hours.desc"),
//     },
//     {
//       icon: HeadphonesIcon,
//       title: t("benefits.items.support.title"),
//       description: t("benefits.items.support.desc"),
//     },
//   ];

//   const howItWorks = [
//     {
//       step: 1,
//       title: t("how_it_works.steps.signup.title"),
//       desc: t("how_it_works.steps.signup.desc"),
//       img: gourmetImg,
//     },
//     {
//       step: 2,
//       title: t("how_it_works.steps.approve.title"),
//       desc: t("how_it_works.steps.approve.desc"),
//       img: baghdadBitesImg,
//     },
//     {
//       step: 3,
//       title: t("how_it_works.steps.menu.title"),
//       desc: t("how_it_works.steps.menu.desc"),
//       img: mixedGrillImg,
//     },
//     {
//       step: 4,
//       title: t("how_it_works.steps.orders.title"),
//       desc: t("how_it_works.steps.orders.desc"),
//       img: partnerImage2Img,
//     },
//   ];

//   const testimonials = [
//     {
//       quote: t("testimonials.items.t1.quote"),
//       name: "Ahmed Hassan",
//       role: t("testimonials.items.t1.role"),
//       avatar: "AH",
//     },
//     {
//       quote: t("testimonials.items.t2.quote"),
//       name: "Sara Al-Mousa",
//       role: t("testimonials.items.t2.role"),
//       avatar: "SM",
//     },
//     {
//       quote: t("testimonials.items.t3.quote"),
//       name: "Omar Khalil",
//       role: t("testimonials.items.t3.role"),
//       avatar: "OK",
//     },
//   ];
//   const [statsVisible, setStatsVisible] = useState(false);
//   const statsRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     setIsVisible(true);

//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         if (entry.isIntersecting) {
//           setStatsVisible(true);
//           observer.disconnect();
//         }
//       },
//       { threshold: 0.1 },
//     );

//     if (statsRef.current) {
//       observer.observe(statsRef.current);
//     }

//     return () => observer.disconnect();
//   }, []);

//   return (
//     <div className="bg-white min-h-screen">
//       {/* ===== HERO SECTION ===== */}
//       <section className="bg-[#0B5D4E] pt-32 pb-48 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
//         {/* Background Pattern */}
//         <div className="absolute inset-0 pointer-events-none">
//           <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-white/5 rounded-full blur-[120px]" />
//           <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-[#F5A623]/10 rounded-full blur-[100px]" />
//         </div>

//         <div className="max-w-7xl mx-auto relative z-10">
//           <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
//             {/* Left Content */}
//             <div
//               className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
//             >
//               <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/10 rounded-full px-5 py-2 text-sm font-semibold text-white mb-8">
//                 <span className="uppercase tracking-wider text-xs">
//                   {t("hero.badge")}
//                 </span>
//               </div>

//               <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.1] mb-8 tracking-tight">
//                 {t("hero.title_line1")} <br /> {t("hero.title_line2")} <br />
//                 <span className="text-[#FE8C34] relative inline-block">
//                   {t("hero.title_highlight")}
//                   <svg
//                     className="absolute w-full h-3 -bottom-1 left-0 text-[#FE8C34]"
//                     viewBox="0 0 200 9"
//                     fill="none"
//                     xmlns="http://www.w3.org/2000/svg"
//                   >
//                     <path
//                       d="M2.00025 6.99997C25.7954 3.73711 96.0963 -1.2294 197.906 5.64571"
//                       stroke="currentColor"
//                       strokeWidth="3"
//                       strokeLinecap="round"
//                     />
//                   </svg>
//                 </span>
//               </h1>

//               <div className="flex flex-col sm:flex-row gap-4 mb-10">
//                 <Link
//                   href="/contact"
//                   className="bg-white text-[#0B5D4E] hover:bg-white/90 h-14 px-8 rounded-full text-lg font-bold transition-transform hover:scale-105 flex items-center justify-center"
//                 >
//                   {t("hero.buttons.partner")}
//                   <ArrowRight className="ml-2 w-5 h-5" />
//                 </Link>
//                 <Link
//                   href="/contact"
//                   className="border border-white/20 text-white hover:bg-white/10 h-14 px-8 rounded-full text-lg font-semibold bg-transparent flex items-center justify-center"
//                 >
//                   {t("hero.buttons.learn_more")}
//                 </Link>
//               </div>

//               <div className="flex flex-wrap gap-6 text-sm font-medium text-white/80">
//                 {['sales', 'marketing'].map((item) => (
//                   <div key={item} className="flex items-center gap-2">
//                     <Check className="w-5 h-5 text-[#F5A623]" />
//                     <span>{t(`hero.checks.${item}`)}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Right Image */}
//             <div
//               className={`relative hidden lg:block transition-all duration-1000 delay-300 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`}
//             >
//               <div className="relative z-10 rounded-[2.5rem] overflow-hidden border-[6px] border-white/10 shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500">
//                 <Image
//                   width={250}
//                   height={250}
//                   src={growImg}
//                   alt="Chef in kitchen"
//                   className="w-full h-auto object-cover scale-105"
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* ===== STATS BAR ===== */}
//       <div className="relative z-20 -mt-24 px-4 sm:px-6 lg:px-8 pointer-events-none">
//         <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-xl p-8 lg:p-10 pointer-events-auto">
//           <div
//             className="grid grid-cols-2 lg:grid-cols-4 gap-8 divide-x-0 md:divide-x divide-gray-100"
//             ref={statsRef}
//           >
//             {stats.map((stat, index) => (
//               <div
//                 key={stat.label}
//                 className={`text-center space-y-2 transition-all duration-700 ${statsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
//                 style={{ transitionDelay: `${index * 100}ms` }}
//               >
//                 <div className="text-4xl lg:text-5xl font-bold text-[#0B5D4E]">
//                   {stat.value}
//                 </div>
//                 <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">
//                   {stat.label}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* ===== DASHBOARD SHOWCASE SECTION ===== */}
//       <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-50 overflow-hidden">
//         <div className="max-w-7xl mx-auto">
//           <div className="grid lg:grid-cols-2 gap-16 items-center">
//             <div className="relative order-2 lg:order-1">
//               <div className="relative z-10 w-full rounded-2xl overflow-hidden shadow-2xl border-4 border-white max-w-lg mx-auto lg:max-w-none rotate-1 hover:rotate-0 transition-transform duration-500">
//                 <Image
//                   src={restaurantOwnerImg}
//                   width={200}
//                   height={200}
//                   alt="Restaurant Dashboard"
//                   className="w-full object-cover"
//                 />
//                 {/* Overlay Gradient */}
//                 <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-60" />
//                 <div className="absolute bottom-6 left-6 text-white">
//                   <div className="font-bold text-xl mb-1">
//                     {t("dashboard.image_overlay.title")}
//                   </div>
//                   <div className="text-sm opacity-80">
//                     {t("dashboard.image_overlay.subtitle")}
//                   </div>
//                 </div>
//               </div>
//               {/* Decorative Element */}
//               <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/10 rounded-full blur-2xl -z-10" />
//             </div>

//             <div className="order-1 lg:order-2">
//               <span className="text-primary font-bold uppercase tracking-wider text-sm mb-2 block">
//                 {t("dashboard.badge")}
//               </span>
//               <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6">
//                 {t("dashboard.title")}
//               </h2>
//               <p className="text-lg text-slate-600 mb-8 leading-relaxed">
//                 {t("dashboard.desc")}
//               </p>
//               <ul className="space-y-4">
//                 {['notifications', 'menu', 'reports', 'feedback'].map((item) => (
//                   <li
//                     key={item}
//                     className="flex items-center gap-3 text-slate-700 font-medium"
//                   >
//                     <div className="w-6 h-6 rounded-full bg-accent-orange/20 flex items-center justify-center shrink-0">
//                       <Check className="w-3.5 h-3.5 text-accent-orange" />
//                     </div>
//                     {t(`dashboard.features.${item}`)}
//                   </li>
//                 ))}
//               </ul>
//               <div className="mt-10">
//                 <Link href="/login">
//                   <Button className="bg-primary cursor-pointer text-white hover:bg-primary/80 h-12 px-8 rounded-xl shadow-lg">
//                     {t("dashboard.button")}
//                   </Button>
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* ===== BENEFITS ===== */}
//       <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#FAFAFA]">
//         <div className="max-w-6xl mx-auto">
//           <div className="max-w-2xl mb-16 mx-auto text-center">
//             <span className="inline-block bg-primary/10 text-primary text-sm font-semibold px-4 py-2 rounded-full mb-6">
//               {t("benefits.badge")}
//             </span>
//             <h2 className="text-4xl sm:text-5xl font-bold text-[#0f172a] mb-4 md:whitespace-nowrap">
//               {t("benefits.title_p1")}{" "}
//               <span className="text-primary">
//                 {t("benefits.title_highlight")}
//               </span>
//             </h2>
//             <p className="text-lg text-[#64748B]">{t("benefits.desc")}</p>
//           </div>

//           <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
//             {benefits.map((benefit) => (
//               <div
//                 key={benefit.title}
//                 className="bg-white rounded-2xl p-6 border border-[#E2E8F0] hover:shadow-lg hover:border-primary/20 transition-all group"
//               >
//                 <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
//                   <benefit.icon className="w-6 h-6 text-primary group-hover:text-white" />
//                 </div>
//                 <h3 className="text-lg font-bold text-slate-900 mb-2">
//                   {benefit.title}
//                 </h3>
//                 <p className="text-[#64748B] text-sm leading-relaxed">
//                   {benefit.description}
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* ===== HOW IT WORKS (Redesigned) ===== */}
//       <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
//         <div className="max-w-7xl mx-auto">
//           <div className="text-center mb-16">
//             <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
//               {t("how_it_works.title")}
//             </h2>
//             <p className="text-lg text-[#64748B]">{t("how_it_works.desc")}</p>
//           </div>

//           <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
//             {howItWorks.map((step, i) => (
//               <div
//                 key={i}
//                 className="bg-white rounded-4xl p-4 shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 group"
//               >
//                 <div className="aspect-square rounded-3xl overflow-hidden relative mb-6">
//                   <Image
//                     src={step.img}
//                     alt={step.title}
//                     className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
//                   />
//                   {/* Step Indicator */}
//                   <div className="absolute top-4 left-4 w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-lg">
//                     <span className="font-bold text-slate-900">{i + 1}</span>
//                   </div>
//                 </div>
//                 <div className="px-2 pb-2">
//                   <h3 className="text-xl font-bold text-slate-900 mb-2">
//                     {step.title}
//                   </h3>
//                   <p className="text-slate-500 text-sm leading-relaxed">
//                     {step.desc}
//                   </p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* ===== TESTIMONIALS ===== */}
//       <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#FAFAFA]">
//         <div className="max-w-6xl mx-auto">
//           <div className="text-center mb-16">
//             <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
//               {t("testimonials.title")}
//             </h2>
//           </div>

//           <div className="grid md:grid-cols-3 gap-8">
//             {testimonials.map((testimonial) => (
//               <div
//                 key={testimonial.name}
//                 className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-lg transition-shadow duration-300"
//               >
//                 <Quote className="w-10 h-10 text-primary/20 mb-4" />
//                 <p className="text-[#64748B] mb-6 leading-relaxed italic">
//                   "{testimonial.quote}"
//                 </p>
//                 <div className="flex items-center gap-3">
//                   <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">
//                     {testimonial.avatar}
//                   </div>
//                   <div>
//                     <div className="font-bold text-slate-900">
//                       {testimonial.name}
//                     </div>
//                     <div className="text-sm text-[#64748B]">
//                       {testimonial.role}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* ===== FINAL CTA ===== */}
//       <section className="py-12 px-4 sm:px-6 lg:px-8 bg-[#FAFAFA]">
//         <div className="max-w-6xl mx-auto">
//           <div className="bg-primary rounded-3xl p-12 md:p-16 text-center relative overflow-hidden">
//             <div className="absolute inset-0">
//               <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/5 rounded-full blur-[100px]" />
//               <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-accent-yellow/10 rounded-full blur-[80px]" />
//             </div>

//             <div className="relative z-10">
//               <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
//                 {t("cta.title_p1")} <br />
//                 <span className="text-accent-yellow">
//                   {t("cta.title_highlight")}
//                 </span>
//               </h2>
//               <p className="text-white/60 max-w-xl mx-auto mb-10 text-lg">
//                 {t("cta.desc")}
//               </p>
//               <div className="flex flex-col sm:flex-row gap-4 justify-center">
//                 <Link
//                   href="/contact"
//                   className="bg-white text-primary hover:bg-white/90 px-8 py-6 rounded-full font-semibold text-lg transition-all hover:scale-105 shadow-xl flex items-center justify-center"
//                 >
//                   {t("cta.apply")}
//                   <ArrowRight className="w-5 h-5 ml-2" />
//                 </Link>
//                 <Link
//                   href="/contact"
//                   className="bg-white/10 text-white hover:bg-white/20 px-8 py-6 rounded-full font-semibold text-lg transition-all border border-white/20 flex items-center justify-center"
//                 >
//                   {t("cta.contact")}
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }

"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";

const RTL_LOCALES = ["ar", "ur", "fa", "he"];

export default function Home() {
  const t = useTranslations('PartnerPage');
  const locale = useLocale();
  const dir = RTL_LOCALES.includes(locale) ? "rtl" : "ltr";

  const comparePlatforms = t.raw('compare.platforms') as { name: string; fee: string }[];
  const benefitItems = t.raw('benefits.items') as { icon: string; title: string; desc: string }[];
  const featureItems = t.raw('features.items') as { n: number; title: string; desc: string }[];
  const pricingPlans = t.raw('pricing.plans') as { tier: string; price: number; desc: string; features: string[]; featured?: boolean }[];

  return (
    <main dir={dir} className="text-[#1a1a1a] bg-white">
      {/* HERO */}
      <section className="bg-gradient-to-br from-[#fff8f0] to-white pt-[90px] pb-[80px] relative overflow-hidden">
        <div className="absolute -top-[120px] -right-[120px] w-[420px] h-[420px] rounded-full bg-[radial-gradient(circle,rgba(255,107,53,0.12),transparent_70%)] pointer-events-none" />
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
          }}
          className="max-w-[900px] mx-auto px-6 text-center relative z-10"
        >
          <motion.span
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
            }}
            className="inline-block bg-[#E8F5E9] text-[#2C5F2D] font-semibold text-[13px] py-[7px] px-4 rounded-[30px] mb-[22px]"
          >
            {t('hero.badge')}
          </motion.span>

          <motion.h1
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
            }}
            className="text-[54px] font-bold text-[#1B3A57] leading-[1.1] tracking-tight mb-5"
          >
            {t('hero.title_main')}<br />
            <span className="font-serif italic font-normal text-[#FF6B35]">{t('hero.title_highlight')}</span>
          </motion.h1>

          <motion.p
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
            }}
            className="text-[20px] text-[#6b6b6b] mb-[36px] max-w-[640px] mx-auto"
          >
            {t.rich('hero.description', { strong: (chunks) => <strong>{chunks}</strong> })}
          </motion.p>

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
            }}
          >
            <Link
              href="/contact"
              className="bg-[#FF6B35] text-white py-[17px] px-[44px] rounded-[30px] font-bold text-[17px] inline-block shadow-[0_8px_24px_rgba(255,107,53,0.32)] hover:bg-[#E5532A] transition-colors"
            >
              {t('hero.cta')}
            </Link>
          </motion.div>

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
            }}
            className="mt-[18px] text-[14px] text-[#6b6b6b]"
          >
            {t('hero.sub_text')}
          </motion.div>
        </motion.div>
      </section>

      {/* COMMISSION COMPARE STRIP
      <section className="bg-[#1B3A57] text-white py-[50px]">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
          }}
          className="max-w-[760px] mx-auto px-6 text-center"
        >
          <motion.h2
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
            }}
            className="text-[30px] font-bold tracking-tight mb-[26px]"
          >
            {t('compare.title')}
          </motion.h2>

          {comparePlatforms.map((row, i) => (
            <motion.div
              key={i}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
              }}
              className="flex flex-wrap items-center gap-x-3 gap-y-1 bg-white/5 rounded-xl px-[22px] py-4 mb-2.5 text-[16px] rtl:text-[14px]"
            >
              <span className="min-w-0 flex-1">{row.name}</span><span className="shrink-0 text-[#ff8a8a] font-bold">{row.fee}</span>
            </motion.div>
          ))}

          <motion.div
            variants={{
              hidden: { opacity: 0, scale: 0.95 },
              visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } }
            }}
            className="flex flex-wrap items-center gap-x-3 gap-y-1 bg-[#7ee7871f] border border-[#7ee78759] rounded-xl px-[22px] py-4 mb-2.5 text-[16px] rtl:text-[14px]"
          >
            <span className="min-w-0 flex-1"><strong>{t('compare.jayakub_name')}</strong></span><span className="shrink-0 text-[#7ee787] font-bold">{t('compare.jayakub_fee')}</span>
          </motion.div>

          <motion.p
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
            }}
            className="mt-5 opacity-80 text-[14px]"
          >
            {t('compare.description')}
          </motion.p>
          <motion.p
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
            }}
            className="mt-2.5 opacity-55 text-[11.5px]"
          >
            {t('compare.disclaimer')}
          </motion.p>
        </motion.div>
      </section> */}





      <section className="bg-[#1B3A57] text-white py-[50px]">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
          }}
          className="max-w-[760px] mx-auto px-6 text-center"
        >
          <motion.h2
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
            }}
            className="text-[30px] font-bold tracking-tight mb-[26px]"
          >
            {t('compare.title')}
          </motion.h2>

          {comparePlatforms.map((row, i) => (
            <motion.div
              key={i}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
              }}

              className="flex justify-between items-center bg-white/5 rounded-xl px-[32px] py-5 mb-2.5 text-[16px] rtl:text-[14px]"
            >
              <span className="min-w-0 text-left rtl:text-right font-medium">{row.name}</span>
              <span className="shrink-0 text-[#ff8a8a] font-bold text-right rtl:text-left">{row.fee}</span>
            </motion.div>
          ))}

          <motion.div
            variants={{
              hidden: { opacity: 0, scale: 0.95 },
              visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } }
            }}

            className="flex justify-between items-center bg-[#7ee7871f] border border-[#7ee78759] rounded-xl px-[32px] py-5 mb-2.5 text-[16px] rtl:text-[14px]"
          >
            <span className="min-w-0 text-left rtl:text-right"><strong>{t('compare.jayakub_name')}</strong></span>
            <span className="shrink-0 text-[#7ee787] font-bold text-right rtl:text-left">{t('compare.jayakub_fee')}</span>
          </motion.div>

          <motion.p
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
            }}
            className="mt-5 opacity-80 text-[14px]"
          >
            {t('compare.description')}
          </motion.p>
          <motion.p
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
            }}
            className="mt-2.5 opacity-55 text-[11.5px]"
          >
            {t('compare.disclaimer')}
          </motion.p>
        </motion.div>
      </section>




      {/* BENEFITS */}
      <section className="py-[80px] bg-[#F2F2ED]" id="benefits">
        <div className="max-w-[1180px] mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="text-center text-[38px] font-bold text-[#1B3A57] mb-[14px] tracking-tight"
          >
            {t.rich('benefits.title', { span: (chunks) => <span className="text-[#FF6B35]">{chunks}</span> })}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}
            className="text-center text-[17px] text-[#6b6b6b] max-w-[600px] mx-auto mb-[54px]"
          >
            {t('benefits.subtitle')}
          </motion.p>

          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
            }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {benefitItems.map((benefit, i) => (
              <motion.div
                key={i}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
                }}
                className="bg-white p-8 rounded-[18px] border border-[#e5e0d8] transition-transform duration-200 hover:-translate-y-1 hover:shadow-[0_14px_36px_rgba(27,58,87,0.1)]"
              >
                <div className="w-14 h-14 rounded-xl bg-[#E8F5E9] flex items-center justify-center text-[27px] mb-[18px]">
                  {benefit.icon}
                </div>
                <h3 className="text-[20px] font-bold text-[#1B3A57] mb-2.5 leading-tight">{benefit.title}</h3>
                <p className="text-[15px] text-[#6b6b6b]">{benefit.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-[80px] bg-white" id="features">
        <div className="max-w-[1180px] mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="text-center text-[38px] font-bold text-[#1B3A57] mb-[14px] tracking-tight"
          >
            {t.rich('features.title', { span: (chunks) => <span className="text-[#FF6B35]">{chunks}</span> })}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}
            className="text-center text-[17px] text-[#6b6b6b] max-w-[600px] mx-auto mb-[54px]"
          >
            {t('features.subtitle')}
          </motion.p>

          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
            }}
            className="max-w-[780px] mx-auto space-y-3.5"
          >
            {featureItems.map((feature, i) => (
              <motion.div
                key={i}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
                }}
                className="bg-white p-6 md:px-7 md:py-[22px] rounded-2xl border border-[#e5e0d8] flex items-start gap-5"
              >
                <div className="w-[46px] h-[46px] bg-gradient-to-br from-[#FF6B35] to-[#FDB833] rounded-full flex items-center justify-center text-white font-bold text-[18px] shrink-0 mt-1">
                  {feature.n}
                </div>
                <div className="min-w-0">
                  <h3 className="text-[17px] font-bold text-[#1B3A57] mb-1 leading-tight">{feature.title}</h3>
                  <p className="text-[14px] text-[#6b6b6b]">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* PRICING */}
      <section className="py-[80px] bg-[#FFF8F0]" id="pricing">
        <div className="max-w-[1180px] mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="text-center text-[38px] font-bold text-[#1B3A57] mb-[14px] tracking-tight"
          >
            {t.rich('pricing.title', { span: (chunks) => <span className="text-[#FF6B35]">{chunks}</span> })}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}
            className="text-center text-[17px] text-[#6b6b6b] max-w-[600px] mx-auto mb-[54px]"
          >
            {t('pricing.subtitle')}
          </motion.p>

          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
            }}
            className="grid grid-cols-1 md:grid-cols-3 gap-[22px] max-w-[980px] mx-auto"
          >
            {pricingPlans.map((plan, idx) => (
              <motion.div
                key={plan.tier}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
                  ...(plan.featured ? { hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } } } : {})
                }}
                className={`
                  rounded-[18px] p-8 relative flex flex-col
                  ${plan.featured
                    ? 'border-2 border-[#FF6B35] shadow-[0_14px_40px_rgba(255,107,53,0.16)]'
                    : 'border border-[#e5e0d8] hover:shadow-lg transition-shadow'
                  }
                  bg-white
                `}
              >
                {plan.featured && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#FF6B35] text-white text-[11px] font-bold px-3.5 py-1 rounded-full whitespace-nowrap">
                    {t('pricing.most_popular')}
                  </span>
                )}
                <div className="font-semibold text-[#6b6b6b] text-[14px] uppercase tracking-wider">{plan.tier}</div>
                <div className="text-[42px] font-bold text-[#1B3A57] mt-3.5 mb-1">
                  ${plan.price}<small className="text-[16px] text-[#6b6b6b] font-medium">/mo</small>
                </div>
                <div className="text-[14px] text-[#6b6b6b] min-h-[42px] mb-[18px]">{plan.desc}</div>
                <ul className="mb-[22px] space-y-1 flex-1">
                  {plan.features.map((li, i) => (
                    <li key={i} className="text-[14px] text-[#1a1a1a] py-[7px] ps-6 relative">
                      <span className="absolute start-0 text-[#2C5F2D] font-bold">✓</span> {li}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/contact"
                  className={`block text-center p-[13px] rounded-[30px] font-semibold text-[15px] ${plan.featured ? 'bg-[#FF6B35] text-white hover:bg-[#E5532A]' : 'bg-[#F2F2ED] text-[#1B3A57] hover:bg-[#e5e0d8]'} transition-colors`}
                >
                  {t('pricing.choose', { tier: plan.tier })}
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {/* Founding 100 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="max-w-[980px] mx-auto mt-6 bg-gradient-to-br from-[#1B3A57] to-[#2a5a85] text-white rounded-[18px] p-[30px] md:px-[34px] flex flex-col lg:flex-row items-center gap-5"
          >
            <div className="text-center lg:text-start flex-1 min-w-0">
              <h3 className="text-[24px] font-bold mb-1.5 leading-tight">{t('pricing.founding.badge')}</h3>
              <p className="text-[15px] opacity-85">{t('pricing.founding.desc')}</p>
            </div>
            <div className="text-center shrink-0">
              <div className="text-[34px] font-bold whitespace-nowrap">
                {t('pricing.founding.price')}
              </div>
              <div className="text-[12px] opacity-80 leading-tight max-w-[180px]">{t('pricing.founding.period')}</div>
            </div>
            <Link href="/contact" className="bg-[#FDB833] text-[#1B3A57] px-7 py-[13px] rounded-[30px] font-bold whitespace-nowrap hover:bg-white transition-colors shrink-0">
              {t('pricing.founding.cta')}
            </Link>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center mt-6 text-[14px] text-[#6b6b6b]"
          >
            {t.rich('pricing.setup_note', { strong: (chunks) => <strong>{chunks}</strong> })}
          </motion.p>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-[#2C5F2D] to-[#1f4520] py-[80px] text-center text-white">
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
          }}
          className="max-w-[1180px] mx-auto px-6"
        >
          <motion.h2
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
            }}
            className="text-[38px] font-bold mb-4 tracking-tight"
          >
            {t('cta.title')}
          </motion.h2>

          <motion.p
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
            }}
            className="text-[18px] mb-[34px] opacity-90 max-w-[600px] mx-auto"
          >
            {t('cta.subtitle')}
          </motion.p>

          <motion.div
            variants={{
              hidden: { opacity: 0, scale: 0.95 },
              visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
            }}
          >
            <Link
              href="/contact"
              className="bg-white text-[#2C5F2D] py-[17px] px-[46px] rounded-[30px] font-bold text-[17px] inline-block hover:bg-[#FDB833] hover:text-[#1B3A57] transition-colors shadow-lg"
            >
              {t('cta.button')}
            </Link>
          </motion.div>
        </motion.div>
      </section>

    </main>
  );
}