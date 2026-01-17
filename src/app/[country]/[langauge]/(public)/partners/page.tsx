"use client";
import { useState, useRef } from "react";
import {
  TrendingUp,
  Shield,
  Globe,
  Users,
  Star,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Truck,
} from "lucide-react";
import { useTranslations } from "next-intl";

const Partners = () => {
  const t = useTranslations("Partners");
  const softPrimaryText = "text-[#0B5D4E]";
  const softAccent = "bg-[#61a5c2]";
  const softAccentText = "text-[#0B5D4E]";
  const softNeutralBg = "bg-gray-50";
  const softSectionBg = "bg-[#E8F4F1]";

  const [activeFilter, setActiveFilter] = useState("filter_all");
  const carouselRef = useRef(null);

  // Partner categories
  const filters = [
    "filter_all",
    "filter_restaurants",
    "filter_delivery",
    "filter_technology",
    "filter_retail",
  ];

  const benefits = [
    {
      icon: TrendingUp,
      title: t("benefit1_title"),
      description: t("benefit1_description"),
      color: "text-[#0B5D4E]",
    },
    {
      icon: Shield,
      title: t("benefit2_title"),
      description: t("benefit2_description"),
      color: "text-yellow-500",
    },
    {
      icon: Globe,
      title: t("benefit3_title"),
      description: t("benefit3_description"),
      color: softPrimaryText,
    },
    {
      icon: Users,
      title: t("benefit4_title"),
      description: t("benefit4_description"),
      color: "text-indigo-400",
    },
  ];

  // Partners data
  const partners = t.raw("partners_list") as any[];

  // Filter partners based on active filter key
  const filteredPartners =
    activeFilter === "filter_all"
      ? partners
      : partners.filter((p: any) => p.category_key === activeFilter);

  // Carousel scroll functions
  const scrollLeft = () => {
    if (carouselRef.current) {
      (carouselRef.current as HTMLElement).scrollBy({
        left: -400,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      (carouselRef.current as HTMLElement).scrollBy({
        left: 400,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className={`${softNeutralBg}`}>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Image and Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&auto=format&fit=crop')",
          }}
        ></div>
        <div className="absolute inset-0 bg-[#2C2C2C]/50 z-10"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-10 z-20 text-center text-[#E8F4F1]">
          <p className="text-lg font-semibold text-yellow-300 mb-3 uppercase tracking-wider animate-fade-in-up">
            {t("hero_tagline")}
          </p>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in-up">
            {t("hero_title_p1")}
            <span className="block bg-linear-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent">
              {t("hero_title_p2")}
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-10 text-[#E8F4F1]/90 max-w-3xl mx-auto animate-fade-in-up animation-delay-200">
            {t("hero_subtitle")}
          </p>
          {/* CTA Button */}
          <button
            className={`group px-8 py-4 ${softAccent} ${softAccentText} font-semibold rounded-xl hover:bg-[#89c2d9] transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 flex items-center justify-center space-x-2 mx-auto w-max animate-fade-in-up animation-delay-400`}
          >
            <span>{t("hero_cta")}</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* Why Partner With Us Section */}
      <section className={`py-20 ${softSectionBg}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section 1 - Image Left, Content Right */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-25">
            {/* Image */}
            <div className="rounded-3xl overflow-hidden shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&auto=format&fit=crop"
                alt="Account management"
                className="w-full h-80 object-cover"
              />
            </div>

            {/* Content */}
            <div className="space-y-5 ml-10">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                {t("section1_title")}
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                {t("section1_subtitle")}
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <button className="px-6 py-3 bg-[#0B5D4E] text-[#E8F4F1] font-semibold rounded-lg hover:bg-[#003256] transition-all duration-300 cursor-pointer">
                  {t("section1_cta1")}
                </button>
                <button className="px-6 py-3 bg-[#E8F4F1] text-gray-800 font-semibold rounded-lg border-2 border-[#FFF9EE] hover:bg-[#FFF9EE] transition-all duration-300 cursor-pointer">
                  {t("section1_cta2")}
                </button>
              </div>
            </div>
          </div>

          {/* Section 2 - Content Left, Image Right */}
          <div className="grid lg:grid-cols-2 gap-12 items-center my-24">
            {/* Content */}
            <div className="space-y-5 lg:order-1 ml-10">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                {t("section2_title")}
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                {t("section2_subtitle")}
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <button className="px-6 py-3 bg-[#0B5D4E] text-[#E8F4F1] font-semibold rounded-lg hover:bg-[#003256] transition-all duration-300 cursor-pointer">
                  {t("section2_cta1")}
                </button>
                <button className="px-6 py-3 bg-[#E8F4F1] text-gray-800 font-semibold rounded-lg border-2 border-[#FFF9EE] hover:bg-[#FFF9EE] transition-all duration-300 cursor-pointer">
                  {t("section2_cta2")}
                </button>
              </div>
            </div>

            {/* Image */}
            <div className="rounded-3xl overflow-hidden shadow-lg lg:order-2">
              <img
                src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=600&auto=format&fit=crop"
                alt="Flexible delivery"
                className="w-full h-80 object-cover"
              />
            </div>
          </div>

          {/* Section 3 - Image Left, Content Right */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Image */}
            <div className="rounded-3xl overflow-hidden shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&auto=format&fit=crop"
                alt="Business growth"
                className="w-full h-80 object-cover"
              />
            </div>

            {/* Content */}
            <div className="space-y-5 ml-10">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                {t("section3_title")}
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                {t("section3_subtitle")}
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <button className="px-6 py-3 bg-[#0B5D4E] text-[#E8F4F1] font-semibold rounded-lg hover:bg-[#003256] transition-all duration-300 cursor-pointer">
                  {t("section3_cta1")}
                </button>
                <button className="px-6 py-3 bg-[#E8F4F1] text-gray-800 font-semibold rounded-lg border-2 border-[#FFF9EE] hover:bg-[#FFF9EE] transition-all duration-300  cursor-pointer">
                  {t("section3_cta2")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className={`py-20 ${softNeutralBg}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
              {t("benefits_heading")}
            </h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">
              {t("benefits_subheading")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="group bg-[#E8F4F1] p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-[#FFF9EE] hover:border-yellow-300 hover:scale-[1.02]"
              >
                <div className="mb-6 transform group-hover:scale-110 group-hover:rotate-1 transition-all duration-300">
                  <benefit.icon className={`w-12 h-12 ${benefit.color}`} />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  {benefit.title}
                </h3>
                <p className="text-gray-500 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filter-Based Carousel Section */}
      <section className={`py-20 ${softSectionBg}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
              {t("network_heading")}
            </h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-8">
              {t("network_subheading")}
            </p>

            {/* Filter Buttons */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {filters.map((filterKey) => (
                <button
                  key={filterKey}
                  onClick={() => setActiveFilter(filterKey)}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    activeFilter === filterKey
                      ? "bg-[#0B5D4E] text-[#E8F4F1] shadow-lg scale-105"
                      : "bg-[#FFF9EE] text-gray-700 hover:bg-[#FFF9EE]"
                  }`}
                >
                  {t(filterKey)}
                </button>
              ))}
            </div>
          </div>

          {/* Carousel */}
          <div className="relative">
            {/* Navigation Buttons */}
            <button
              onClick={scrollLeft}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-[#E8F4F1] p-3 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 hidden md:block"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-6 h-6 text-gray-700" />
            </button>
            <button
              onClick={scrollRight}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-[#E8F4F1] p-3 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 hidden md:block"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-6 h-6 text-gray-700" />
            </button>

            {/* Carousel Container */}
            <div
              ref={carouselRef}
              className="overflow-x-auto scrollbar-hide scroll-smooth pb-4"
            >
              <div className="flex gap-6 px-2">
                {filteredPartners.map((partner: any) => (
                  <div
                    key={partner.id}
                    className="shrink-0 w-80 bg-[#E8F4F1] rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group border border-[#FFF9EE] hover:border-yellow-300 hover:scale-[1.02]"
                  >
                    {/* Partner Image */}
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={partner.image}
                        alt={partner.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-4 right-4 bg-[#E8F4F1] px-3 py-1 rounded-full text-sm font-semibold text-gray-700">
                        {t(partner.category_key)}
                      </div>
                    </div>

                    {/* Partner Info */}
                    <div className="p-6">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="text-4xl">{partner.logo}</div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {partner.name}
                        </h3>
                      </div>
                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {partner.description}
                      </p>

                      {/* Stats */}
                      <div className="flex items-center justify-between pt-4 border-t border-[#FFF9EE]">
                        <div className="flex items-center space-x-1">
                          <Truck className="w-4 h-4 text-gray-500" />
                          <span className="text-sm font-semibold text-gray-700">
                            {partner.stats.orders}
                          </span>
                          <span className="text-sm text-gray-500">
                            {t("card_stat_orders")}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          <span className="text-sm font-semibold text-gray-700">
                            {partner.stats.rating}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Gradient Overlay */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-linear-to-r from-[#E8F4F1] to-transparent z-10 hidden md:block" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-linear-to-l from-[#E8F4F1] to-transparent z-10 hidden md:block" />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`py-20 ${softNeutralBg}`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
            {t("cta_heading")}
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            {t("cta_subheading")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="px-8 py-4 bg-[#0B5D4E] text-[#E8F4F1] font-bold rounded-xl transition-all duration-300 shadow-xl hover:shadow-2xl hover:bg-[#013f70] flex items-center space-x-2">
              <span>{t("cta_button1")}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button className="px-8 py-4 bg-[#E8F4F1] text-gray-800 font-bold rounded-xl border-2 border-[#FFF9EE] hover:border-gray-300 transition-all duration-300 shadow-lg hover:shadow-xl">
              {t("cta_button2")}
            </button>
          </div>
        </div>
      </section>

      {/* Animations */}
      <style jsx>{`
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
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        .animation-delay-400 {
          animation-delay: 0.4s;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default Partners;
