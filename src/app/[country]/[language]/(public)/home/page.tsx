"use client";

// import Banner from "@/app/banner/page";
import Hero from "@/components/modules/public-website/home/Hero";
import HowItWorks from "@/components/modules/public-website/home/HowItWorks";
import Restaurants from "@/components/modules/public-website/home/Restaurants";
import Dishes from "@/components/modules/public-website/home/Dishes";
import Download from "@/components/modules/public-website/home/Download";
import PlatformServices from "@/components/modules/public-website/home/PlatformServices";
import Partnership from "@/components/modules/public-website/home/Partners";
import PartnerCTA from "@/components/modules/public-website/home/PartnerCTA";

import AIChatWidget from "@/components/modules/public-website/ai-chat-widget/AIChatWidget";

export default function HomePage() {
  return (
    <div className="relative">
      {/* <Banner /> */}
      <Hero />
      <HowItWorks />
      <Restaurants />
      <Dishes />
      <Download />
      <PlatformServices />
      <Partnership />
      <PartnerCTA />
      <AIChatWidget />
    </div>
  );
}

