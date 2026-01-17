"use client";
import { useEffect, useRef } from "react";
import {
  Briefcase,
  Compass,
  Users,
  Lightbulb,
  HeartHandshake,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import { useTranslations } from "next-intl";

const SectionHeading = ({ title, subtitle, color = "text-gray-700" }: any) => (
  <div className="text-center mb-16">
    <h2 className={`text-4xl md:text-5xl font-extrabold ${color} mb-4`}>
      {title}
    </h2>
    <p className="text-xl text-gray-500 max-w-2xl mx-auto">{subtitle}</p>
  </div>
);

const SplitCultureCard = ({
  icon: Icon,
  title,
  description,
  color,
  image,
  buttonText = "Learn More",
}: any) => (
  <div className="bg-[#E8F4F1] rounded-3xl border-2 border-[#FFF9EE] p-6 md:p-10 h-full w-full md:w-280 shrink-0">
    <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center h-full">
      {/* Left Side: Content */}
      <div className="space-y-4 max-h-112 overflow-hidden flex flex-col justify-between">
        <div>
          <div className="flex items-start space-x-3 mb-4">
            <Icon className={`w-10 h-10 ${color} shrink-0 mt-1`} />
            <h3 className="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight">
              {title}
            </h3>
          </div>
          <p className="text-lg text-gray-600 leading-relaxed line-clamp-5">
            {description}
          </p>
        </div>
        <button
          className={`mt-6 px-7 py-3 text-base font-bold rounded-xl text-[#E8F4F1] transition-all duration-300 ${color.replace(
            "text-",
            "bg-"
          )} hover:bg-opacity-80 shadow-lg`}
        >
          {buttonText}
        </button>
      </div>

      {/* Right Side: Image */}
      <div className="rounded-2xl overflow-hidden shadow-xl h-64 md:h-96 relative">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-[1.05]"
        />
      </div>
    </div>
  </div>
);

// Card Slider Container Component

const CardSliderContainer = ({ children }: any) => {
  // FIX 1: Specify the ref type as HTMLDivElement
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let scrollInterval: any;

    const getScrollAmount = () => {
      const card = container.querySelector(".flex-shrink-0");
      if (!card) return 0;

      const cardElement = card as HTMLElement;

      return cardElement.offsetWidth + 32;
    };

    const startScroll = () => {
      scrollInterval = setInterval(() => {
        const cardWidth = getScrollAmount();
        if (cardWidth === 0) return;

        const nextScrollLeft = container.scrollLeft + cardWidth;

        // Check for loop condition (end of content)
        if (
          nextScrollLeft >
          container.scrollWidth - container.clientWidth + 1
        ) {
          // reset to the beginning
          container.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          // Scroll one card width
          container.scrollBy({ left: cardWidth, behavior: "smooth" });
        }
      }, 2000); // Scroll every 2 seconds
    };

    const stopScroll = () => clearInterval(scrollInterval);

    startScroll();
    container.addEventListener("mouseenter", stopScroll);
    container.addEventListener("mouseleave", startScroll);

    return () => {
      stopScroll();
      container.removeEventListener("mouseenter", stopScroll);
      container.removeEventListener("mouseleave", startScroll);
    };
  }, []);

  return (
    <div className="max-w-full overflow-hidden">
      <div
        ref={containerRef}
        className="overflow-x-scroll scrollbar-hide scroll-smooth py-4 -my-4"
      >
        <div className="inline-flex gap-8 px-4 sm:px-6 lg:px-8 xl:justify-center xl:w-full">
          {children}
        </div>
        <style jsx>{`
          /* Custom scrollbar hide (No change) */
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none; /* IE and Edge */
            scrollbar-width: none; /* Firefox */
          }
        `}</style>
      </div>
    </div>
  );
};

const AboutPage = () => {
  const t = useTranslations("About");

  // Color Palette
  const primaryyellow = "#0B5D4E";
  const softPrimaryText = `text-[${primaryyellow}]`;
  const softAccent = `bg-[${"#61a5c2"}]`; // tertiaryyellow
  const softAccentText = `text-[${"#0B5D4E"}]`; // primaryyellow
  const softNeutralBg = "bg-gray-50";
  const softSectionBg = "bg-[#E8F4F1]";
  const statGradient = "from-yellow-400 to-yellow-500";

  // Data for About Page Sections
  const coreValues = [
    {
      icon: Lightbulb,
      title: t("value_innovation_title"),
      description: t("value_innovation_desc"),
      color: "text-[#0B5D4E]",
    },
    {
      icon: HeartHandshake,
      title: t("value_partnership_title"),
      description: t("value_partnership_desc"),
      color: "text-yellow-500",
    },
    {
      icon: Briefcase,
      title: t("value_excellence_title"),
      description: t("value_excellence_desc"),
      color: softPrimaryText,
    },
    {
      icon: Compass,
      title: t("value_global_title"),
      description: t("value_global_desc"),
      color: "text-indigo-400",
    },
  ];

  // Data for Slider Cards
  const splitCultureCards = [
    {
      icon: Users,
      title: t("slider_1_title"),
      description: t("slider_1_desc"),
      color: "text-[#0B5D4E]",
      image:
        "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=600&auto=format&fit=crop",
      buttonText: t("slider_1_button"),
    },
    {
      icon: TrendingUp,
      title: t("slider_2_title"),
      description: t("slider_2_desc"),
      color: "text-yellow-600",
      image:
        "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=600&auto=format&fit=crop",
      buttonText: t("slider_2_button"),
    },
    {
      icon: Lightbulb,
      title: t("slider_3_title"),
      description: t("slider_3_desc"),
      color: softPrimaryText,
      image:
        "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=600&auto=format&fit=crop",
      buttonText: t("slider_3_button"),
    },
    {
      icon: HeartHandshake,
      title: t("slider_4_title"),
      description: t("slider_4_desc"),
      color: softPrimaryText,
      image:
        "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=600&auto=format&fit=crop",
      buttonText: t("slider_4_button"),
    },
    // Duplicating the first card to ensure seamless loop visual continuity (using t() for content)
    {
      icon: Users,
      title: t("slider_1_title"),
      description: t("slider_1_desc"),
      color: softPrimaryText,
      image:
        "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=600&auto=format&fit=crop",
      buttonText: t("slider_1_button"),
    },
  ];

  return (
    <div className={`min-h-screen ${softNeutralBg}`}>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Image and Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1762652847337-d0bb9764308b?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw1fHx8ZW58MHx8fHx8&auto=format&fit=crop&q=60&w=1600')",
          }}
        ></div>

        {/* Dark Overlay for readability */}
        <div className="absolute inset-0 bg-linear-to-b from-black/40 via-black/20 to-black/20 z-10"></div>

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12 md:py-13 z-20 text-center text-white">
          <p className="text-lg font-semibold text-yellow-400 mb-3 uppercase tracking-widest animate-fade-in-up">
            {t("hero_tagline")}
          </p>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight animate-fade-in-up">
            {t("hero_title_p1")}
            <span className={`text-yellow-500 ml-2 inline-block`}>
              {t("hero_title_p2")}
            </span>
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl mb-12 text-white/90 max-w-3xl mx-auto animate-fade-in-up animation-delay-200">
            {t("hero_subtitle")}
          </p>

          {/* CTA Button */}
          <button
            className={`group px-10 py-4 bg-gradient-to-r from-yellow-500 to-green-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-500 flex items-center justify-center space-x-3 mx-auto animate-fade-in-up animation-delay-400`}
          >
            <span>{t("hero_cta")}</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
          </button>
        </div>
      </section>

      {/* About Story Section */}
 <section className={`py-20 ${softSectionBg}`}>
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="grid md:grid-cols-2 gap-10 items-center">
      {/* Image */}
      <div className="rounded-2xl overflow-hidden shadow-2xl">
        <div
          className="w-full h-96 sm:h-[28rem] md:h-96 bg-cover bg-center transition-transform duration-500 hover:scale-105"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1762652847337-d0bb9764308b?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw1fHx8ZW58MHx8fHx8&auto=format&fit=crop&q=60&w=600')",
          }}
        ></div>
      </div>

      {/* Text Content */}
      <div className="space-y-6">
        <h2 className="text-4xl sm:text-5xl md:text-5xl font-extrabold leading-tight text-green-500">
          {t("story_title")}
        </h2>

        <p className="text-lg text-black">
          {t("story_p1")}
        </p>

        <p className="text-lg font-medium border-l-4 border-yellow-400 pl-4 text-yellow-400 italic">
          {t("story_quote")}
        </p>

        <p className="text-lg  text-black">
          {t("story_p2")}
        </p>
      </div>
    </div>
  </div>
</section>


      {/* Core Values/Features Section */}
      <section className={`py-20 ${softNeutralBg}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title={t("values_heading")}
            subtitle={t("values_subheading")}
            color="text-gray-800"
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {coreValues.map((value, index) => (
              <div
                key={index}
                className="group bg-[#E8F4F1] p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-[#FFF9EE] hover:border-yellow-300 hover:scale-[1.02]"
              >
                <div className="mb-6 transform group-hover:scale-110 group-hover:rotate-1 transition-all duration-300">
                  <value.icon className={`w-12 h-12 ${value.color}`} />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-500 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Join Our Team Section */}
      <section className={`py-20 ${softSectionBg}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title={t("careers_heading")}
            subtitle={t("careers_subheading")}
            color="text-gray-800"
          />
        </div>

        <div className="relative">
          <CardSliderContainer>
            {splitCultureCards.map((card, index) => (
              <div key={index} className="w-full md:w-280 shrink-0">
                <SplitCultureCard {...card} />
              </div>
            ))}
          </CardSliderContainer>
        </div>
      </section>

      {/* Join The Team CTA (Image on Right, Description on Left) */}
      <section className={`py-20 ${softNeutralBg}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Text Content (Left) */}
            <div className="space-y-6">
              <p
                className={`text-lg font-semibold ${softPrimaryText} uppercase tracking-wider`}
              >
                {t("cta_tagline")}
              </p>
              <h2 className="text-5xl font-extrabold text-gray-900 leading-tight">
                {t("cta_title")}
              </h2>
              <p className="text-xl text-gray-600 max-w-lg">
                {t("cta_subtitle")}{" "}
              </p>
              {/* CTA Button */}
              <button
                className={`group px-8 py-4 text-[#E8F4F1] font-bold rounded-xl bg-[${primaryyellow}] transition-all duration-300 shadow-xl hover:shadow-2xl hover:bg-[#013f70] flex items-center justify-center space-x-2 text-lg w-max`}
              >
                <span>{t("cta_button")}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Image Content (Right) */}
            <div className="rounded-2xl overflow-hidden shadow-2xl transform hover:shadow-inner transition-shadow duration-500">
              <div
                className="w-full h-96 bg-cover bg-center"
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=600&auto=format&fit=crop')",
                }}
              >
                {/* Subtle dark overlay */}
                <div className="p-4 bg-[#2C2C2C]/15 h-full flex items-end justify-start">
                  <p className="text-4xl font-bold text-[#E8F4F1]/95 drop-shadow-lg backdrop-blur-sm p-3 rounded-lg border-2 border-[#E8F4F1]/30">
                    {t("cta_image_label")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

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
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        .animation-delay-400 {
          animation-delay: 0.4s;
        }
      `}</style>
    </div>
  );
};

export default AboutPage;
