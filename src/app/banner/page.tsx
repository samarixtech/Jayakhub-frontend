"use client";

import {
  Globe,
  Shield,
  Zap,
  Users,
  TrendingUp,
  Award,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import ScrollCards from "@/components/ScrollCards";
import { useTranslations } from "next-intl";
// import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import { easeOut } from "framer-motion";

const SectionHeading = ({ title, subtitle, color = "text-gray-800" }: any) => (
  <div className="text-center mb-16">
    <h2
      className={`text-4xl md:text-5xl font-extrabold ${color} mb-4 leading-tight`}
    >
      {title}
    </h2>
    <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
      {subtitle}
    </p>
    {/* Optional subtle underline */}
    <div className="mt-4 w-24 h-1 mx-auto bg-yellow-500 rounded-full opacity-80"></div>
  </div>
);

const TrustCardSoft = ({ icon: Icon, iconColor, title, subtitle }: any) => (
  <motion.div
    className="bg-white/50 backdrop-blur-md p-8 rounded-3xl text-center shadow-lg hover:shadow-2xl border border-white/30 transform transition-all duration-500 hover:-translate-y-3 relative"
    whileHover={{ scale: 1.05 }}
  >
    <div
      className={`w-20 h-20 mx-auto mb-4 flex items-center justify-center rounded-full bg-gray-200/20 shadow-inner ${iconColor} text-opacity-80 transition-all duration-300`}
    >
      <Icon className="w-10 h-10" />
    </div>
    <h3 className="text-2xl font-semibold text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-600 leading-relaxed text-sm">{subtitle}</p>
  </motion.div>
);

const Page = () => {
  const t = useTranslations("Home");
  const statGradient = "from-yellow-400 via-green-400 to-teal-400";

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: (i: number = 0) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.2, duration: 0.8, ease: easeOut },
    }),
  };

  const primaryyellow = "#0B5D4E"; // Dark yellow for main accent (Primary)
  const secondaryyellow = "#B6932F "; // Mid yellow for features/stats (Secondary)
  const tertiaryyellow = "#B6932F "; // Light yellow for lighter accents/hovers
  const neutralBg = "bg-gray-50"; // Light Gray/Off-[#E8F4F1] for background
  const sectionBg = "bg-[#E8F4F1]"; // Pure [#E8F4F1] for clean separation

  const softAccent = `bg-[${tertiaryyellow}]`; // Accent button background
  const softAccentText = `text-[${primaryyellow}]`; // Accent button text
  const softNeutralBg = neutralBg;
  const softSectionBg = sectionBg;
  const benefitCheckColor = "text-yellow-300";

  const features = [
    {
      icon: <Globe className={`w-12 h-12 text-[${secondaryyellow}]`} />,
      titleKey: "feature_global_title",
      descriptionKey: "feature_global_desc",
    },
    {
      icon: <Zap className={`w-12 h-12 text-[${secondaryyellow}]`} />,
      titleKey: "feature_fast_title",
      descriptionKey: "feature_fast_desc",
    },
    {
      icon: <Shield className={`w-12 h-12 text-[${secondaryyellow}]`} />,
      titleKey: "feature_secure_title",
      descriptionKey: "feature_secure_desc",
    },
    {
      icon: <Users className={`w-12 h-12 text-[${secondaryyellow}]`} />,
      titleKey: "feature_network_title",
      descriptionKey: "feature_network_desc",
    },
  ];

  const benefitKeys = [
    "benefit_1",
    "benefit_2",
    "benefit_3",
    "benefit_4",
    "benefit_5",
    "benefit_6",
  ];

  return (
    <>
      {/* <Navbar /> */}
      <div className={`min-h-screen ${softNeutralBg}`}>
        {/* Hero Section */}
        <section className="relative overflow-hidden h-screen md:h-[95vh]">
          {/* Background Image with parallax effect */}
          <motion.div
            className="absolute inset-0 bg-cover bg-center z-0"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=1600&q=80')",
            }}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5 }}
          ></motion.div>

          {/* Soft overlay layers */}
          <div className="absolute inset-0 bg-[#2C2C2C]/30 z-10"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,...')] opacity-40 z-20"></div>

          {/* Content */}
          <div className="relative z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 md:py-40 text-center flex flex-col items-center justify-center text-[#E8F4F1]">
            <motion.h1
              className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight"
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              custom={0}
            >
              {t("hero_title_p1")}
              <span
                className={`block bg-gradient-to-r ${statGradient} bg-clip-text text-transparent`}
              >
                {t("hero_title_p2")}
              </span>
            </motion.h1>

            <motion.p
              className="text-lg md:text-2xl mb-10 max-w-3xl"
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              custom={1}
            >
              {t("hero_subtitle")}
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              custom={2}
            >
              {/* Primary Button */}
              <button className="group px-8 py-4 font-semibold rounded-xl bg-[#B6932F] transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 flex items-center justify-center space-x-2">
                <span>{t("hero_cta_explore")}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Secondary Button */}
              <button className="px-8 py-4 bg-transparent border-2 border-[#E8F4F1] text-[#E8F4F1] font-semibold rounded-xl hover:bg-[#E8F4F1]/10 transition-all duration-300 backdrop-blur-sm">
                {t("hero_cta_demo")}
              </button>
            </motion.div>
          </div>

          {/* Wave Divider */}
          <div className="absolute bottom-0 left-0 right-0 z-20">
            <svg
              viewBox="0 0 1440 120"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-[80px] md:h-[120px]"
            >
              <path
                d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
                fill="rgb(249, 250, 251)"
              />
            </svg>
          </div>
        </section>
        <ScrollCards />
        <section className={`py-10 ${softSectionBg}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              title={t("features_heading")}
              subtitle={t("features_subheading")}
              color="text-gray-800"
            />

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="group bg-white/50 backdrop-blur-md p-8 rounded-3xl shadow-lg border border-white/30 hover:shadow-2xl transition-all duration-500 hover:-translate-y-3"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="p-2 mb-6 text-yellow-500 w-12 h-12 flex items-center justify-center bg-yellow-100/50 rounded-full shadow-inner group-hover:bg-yellow-200/50 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>

                  <h3 className="text-xl font-bold text-gray-800 mb-3 transition-colors duration-300 group-hover:text-yellow-600">
                    {t(feature.titleKey)}
                  </h3>

                  <p className="text-gray-600 leading-relaxed text-sm">
                    {t(feature.descriptionKey)}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section: Dark yellow Gradient */}
        <section className="relative py-16 bg-gradient-to-br from-[#E8F4F1] to-[#F1FAF7] text-black overflow-hidden">
          {/* Background Decorative Overlay */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,...')] opacity-20 mix-blend-soft-light pointer-events-none"></div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Left: Heading & Button */}
              <div>
                <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-gray-900">
                  {t("benefits_heading")}
                </h2>
                <p className="text-xl text-yellow-600 mb-8">
                  {t("benefits_subheading")}
                </p>

                <button className="group px-8 py-4 font-semibold rounded-2xl bg-[#0B5D4E] text-white shadow-lg hover:shadow-2xl transition-all duration-300 flex items-center space-x-2">
                  <span>{t("benefits_cta_learn")}</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </div>

              {/* Right: Benefits List */}
              <div className="space-y-5">
                {benefitKeys.map((key, index) => (
                  <motion.div
                    key={index}
                    className="flex items-start space-x-4 p-4 rounded-2xl bg-white/30 backdrop-blur-md shadow-inner hover:bg-white/40 transition-all duration-300"
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      delay: index * 0.1,
                      type: "spring",
                      stiffness: 100,
                    }}
                  >
                    <CheckCircle
                      className={`w-6 h-6 ${benefitCheckColor} flex-shrink-0 mt-1`}
                    />
                    <span className="text-lg font-medium text-gray-800">
                      {t(key)}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Trust Indicators */}
        <section className={`py-20 ${softNeutralBg}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              title={t("trust_heading")}
              subtitle={t("trust_subheading")}
              color="text-gray-800"
            />

            <div className="grid md:grid-cols-3 gap-8 mt-12">
              {/* Trust Card 1 */}
              <TrustCardSoft
                icon={Award}
                iconColor="text-yellow-400"
                title={t("trust_card_1_title")}
                subtitle={t("trust_card_1_subtitle")}
                className="bg-white/50 backdrop-blur-md rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
              />

              {/* Trust Card 2 */}
              <TrustCardSoft
                icon={TrendingUp}
                iconColor="text-[#0B5D4E]"
                title={t("trust_card_2_title")}
                subtitle={t("trust_card_2_subtitle")}
                className="bg-white/50 backdrop-blur-md rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
              />

              {/* Trust Card 3 */}
              <TrustCardSoft
                icon={Shield}
                iconColor="text-yellow-400"
                title={t("trust_card_3_title")}
                subtitle={t("trust_card_3_subtitle")}
                className="bg-white/50 backdrop-blur-md rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
              />
            </div>
          </div>
        </section>

        <section className={`py-10 ${softSectionBg}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Text Content */}
              <div className="space-y-6">
                <h2 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight">
                  {t("corporate_heading")}
                </h2>

                <p className="text-xl md:text-2xl text-gray-600 max-w-lg leading-relaxed">
                  {t("corporate_subtitle")}
                </p>

                {/* CTA Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className={`group px-8 py-4 text-white font-bold rounded-2xl bg-[#0B5D4E] shadow-lg hover:shadow-2xl transition-all duration-300 flex items-center justify-center space-x-2 text-lg w-max`}
                >
                  <span>{t("corporate_cta")}</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </motion.button>
              </div>

              {/* Image Content */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <div
                  className="w-full h-60 md:h-[22rem] bg-cover bg-center relative group"
                  style={{
                    backgroundImage:
                      "url('https://plus.unsplash.com/premium_photo-1744871980466-8689987b2865?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDN8eEh4WVRNSExnT2N8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=60&w=600')",
                  }}
                >
                  {/* Soft overlay with text */}
                  <div className="absolute inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center transition-all duration-500 group-hover:bg-black/30">
                    <p className="text-4xl md:text-5xl font-bold text-white/90 drop-shadow-lg p-4 rounded-lg bg-white/10">
                      {t("corporate_image_label")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Style block (No change) */}
        <style jsx>{`
          /* ... CSS Animations (No Change) ... */
          @keyframes fade-in-up {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          @keyframes slide-in-right {
            from {
              opacity: 0;
              transform: translateX(20px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          .animate-fade-in-up {
            animation: fade-in-up 0.8s ease-out forwards;
          }
          .animate-slide-in-right {
            animation: slide-in-right 0.6s ease-out forwards;
            opacity: 0;
          }
          .animation-delay-200 {
            animation-delay: 0.2s;
          }
          .animation-delay-400 {
            animation-delay: 0.4s;
          }
        `}</style>
      </div>
    </>
  );
};

export default Page;
