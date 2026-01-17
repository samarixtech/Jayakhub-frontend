'use client';

import React from 'react';
import {
  FaTruck, FaStore, FaUser, FaHeadset, FaBolt, FaShieldAlt, FaCheckCircle,
  FaSmileBeam, FaQuoteRight
} from 'react-icons/fa';
import { MdOutlineTrackChanges, MdOutlineLoyalty } from 'react-icons/md';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';


// =====================================================
// Reusable Card
// =====================================================
interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay?: number;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ icon, title, description, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.6 }}
    className="relative bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl 
    hover:-translate-y-3 transition-all duration-500 group overflow-hidden"
  >
    <motion.div whileHover={{ rotate: 5, scale: 1.05 }} className="text-6xl text-[#0B5D4E] mb-5">
      {icon}
    </motion.div>

    <h3 className="text-2xl font-extrabold text-gray-900 mb-3">{title}</h3>
    <p className="text-gray-700">{description}</p>
  </motion.div>
);


// =====================================================
// Motion Variants
// =====================================================
const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.6 },
  }),
};


// =====================================================
// Main Component
// =====================================================
const ServicesPage: React.FC = () => {

  const t = useTranslations("services");

  // CORE SERVICES
  const coreServices: ServiceCardProps[] = [
    { icon: <FaUser />, title: t("core.customer_journey.title"), description: t("core.customer_journey.desc") },
    { icon: <MdOutlineTrackChanges />, title: t("core.tracking.title"), description: t("core.tracking.desc") },
    { icon: <FaStore />, title: t("core.restaurant_dashboard.title"), description: t("core.restaurant_dashboard.desc") },
    { icon: <FaTruck />, title: t("core.ai_dispatch.title"), description: t("core.ai_dispatch.desc") },
    { icon: <MdOutlineLoyalty />, title: t("core.loyalty.title"), description: t("core.loyalty.desc") },
    { icon: <FaHeadset />, title: t("core.support.title"), description: t("core.support.desc") },
  ];

  // DIFFERENTIATORS
  const differentiators: ServiceCardProps[] = [
    { icon: <FaBolt />, title: t("why_us.fast_api.title"), description: t("why_us.fast_api.desc") },
    { icon: <FaCheckCircle />, title: t("why_us.uptime.title"), description: t("why_us.uptime.desc") },
    { icon: <FaShieldAlt />, title: t("why_us.security.title"), description: t("why_us.security.desc") },
  ];

  // TESTIMONIALS
  const testimonials = [
    { q: t("testimonials.t1.quote"), n: t("testimonials.t1.name"), j: t("testimonials.t1.job") },
    { q: t("testimonials.t2.quote"), n: t("testimonials.t2.name"), j: t("testimonials.t2.job") },
    { q: t("testimonials.t3.quote"), n: t("testimonials.t3.name"), j: t("testimonials.t3.job") },
  ];

  // PRICING
  const pricingPlans = [
    { name: t("pricing.starter.name"), price: "Free", features: t.raw("pricing.starter.features") },
    { name: t("pricing.pro.name"), price: "$49/mo", features: t.raw("pricing.pro.features"), popular: t("pricing.pro.popular") },
    { name: t("pricing.enterprise.name"), price: "Custom", features: t.raw("pricing.enterprise.features") },
  ];


  return (
    <div className="text-gray-900 overflow-hidden">

      {/* HERO */}
      <section className="relative py-20 text-center bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1536329639134-ade172b2fea0')" }}>
        <div className="absolute inset-0 bg-black/30" />

        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <h1 className="text-6xl font-bold text-white">
            {t("hero.title_part1")} <span className="text-yellow-300">{t("hero.title_highlight")}</span> {t("hero.title_part2")}
          </h1>

          <p className="text-white/80 mt-4 text-xl">{t("hero.subtitle")}</p>

          <button className="mt-8 bg-[#0B5D4E] text-white px-10 py-3 rounded-full text-lg">
            {t("hero.cta")}
          </button>
        </div>
      </section>


      {/* METRICS */}
      <section className="py-20 bg-[#E8F4F1] text-center">
        <div className="grid grid-cols-2 md:grid-cols-4 max-w-6xl mx-auto gap-10">
          <div><FaUser className="text-4xl text-yellow-600 mx-auto" /><h3 className="text-3xl font-bold">200K+</h3><p>{t("metrics.active_users")}</p></div>
          <div><FaTruck className="text-4xl text-yellow-600 mx-auto" /><h3 className="text-3xl font-bold">120K+</h3><p>{t("metrics.deliveries")}</p></div>
          <div><FaStore className="text-4xl text-yellow-600 mx-auto" /><h3 className="text-3xl font-bold">9K+</h3><p>{t("metrics.partners")}</p></div>
          <div><FaSmileBeam className="text-4xl text-yellow-600 mx-auto" /><h3 className="text-3xl font-bold">4.9★</h3><p>{t("metrics.rating")}</p></div>
        </div>
      </section>


      {/* CORE SERVICES */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-[#0B5D4E] font-semibold uppercase">{t("core.section_tag")}</p>
          <h2 className="text-5xl font-extrabold">{t("core.section_title")}</h2>
          <p className="text-gray-600 mt-4">{t("core.section_desc")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {coreServices.map((s, i) => (
            <ServiceCard key={i} {...s} delay={i * 0.1} />
          ))}
        </div>
      </section>


      {/* DIFFERENTIATORS */}
      <section className="py-24 bg-[#0B5D4E] text-white">
        <div className="text-center mb-16">
          <p className="uppercase">{t("why_us.tag")}</p>
          <h2 className="text-4xl font-bold">{t("why_us.title")}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 max-w-6xl mx-auto gap-10 px-6">
          {differentiators.map((d, i) => (
            <ServiceCard key={i} {...d} delay={i * 0.15} />
          ))}
        </div>
      </section>


      {/* PRICING */}
      <section className="py-24 bg-[#E8F4F1]">
        <div className="text-center mb-16">
          <p className="text-[#0B5D4E] uppercase">{t("pricing.tag")}</p>
          <h2 className="text-4xl font-extrabold">{t("pricing.title")}</h2>
          <p className="text-gray-600 mt-4">{t("pricing.desc")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto px-6">
          {pricingPlans.map((p, i) => (
            <div key={i} className="rounded-3xl p-10 bg-white shadow-xl text-center">
              {p.popular && (
                <span className="bg-yellow-500 text-black px-3 py-1 rounded-full text-sm">
                  {p.popular}
                </span>
              )}

              <h3 className="text-3xl font-bold mt-4">{p.name}</h3>
              <p className="text-5xl font-extrabold mt-4">{p.price}</p>

              <ul className="mt-6 space-y-3">
                {p.features.map((f: string, j: number) => (
                  <li key={j} className="flex justify-center gap-2">
                    <FaCheckCircle className="text-green-600" />
                    {f}
                  </li>
                ))}
              </ul>

              <button className="mt-6 bg-yellow-600 text-white px-8 py-3 rounded-full">
                {t("pricing.choose_plan")}
              </button>
            </div>
          ))}
        </div>
      </section>


      {/* TESTIMONIALS */}
      <section className="py-24">
        <div className="text-center mb-16">
          <p className="text-yellow-600 uppercase">{t("testimonials.tag")}</p>
          <h2 className="text-4xl font-bold">{t("testimonials.title")}</h2>
          <p className="text-gray-600 mt-4">{t("testimonials.desc")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 max-w-6xl mx-auto gap-10 px-6">
          {testimonials.map((ts, i) => (
            <motion.div key={i} className="bg-white p-10 rounded-3xl shadow-xl">
              <FaQuoteRight className="text-[#0B5D4E] text-2xl mb-4" />
              <p className="text-lg italic mb-6">“{ts.q}”</p>
              <h4 className="font-bold">{ts.n}</h4>
              <p className="text-[#0B5D4E] text-sm">{ts.j}</p>

              <div className="flex justify-center mt-3 text-yellow-600">
                {[...Array(5)].map((_, k) => <FaSmileBeam key={k} className="text-xl" />)}
              </div>
            </motion.div>
          ))}
        </div>
      </section>


      {/* CTA */}
      <section className="py-20 text-center bg-[#E8F4F1]">
        <h2 className="text-4xl font-bold mb-4">{t("cta.title")}</h2>
        <p className="text-gray-700 mb-8">{t("cta.desc")}</p>

        <button className="bg-[#0B5D4E] text-white px-10 py-3 rounded-full text-lg">
          {t("cta.button")}
        </button>
      </section>

    </div>
  );
};

export default ServicesPage;
