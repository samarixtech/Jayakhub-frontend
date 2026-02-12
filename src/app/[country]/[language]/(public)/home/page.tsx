"use client";

import Banner from "@/app/banner/page";
import Hero from "@/components/modules/public-website/home/Hero";
import HowItWorks from "@/components/modules/public-website/home/HowItWorks";
import Restaurants from "@/components/modules/public-website/home/Restaurants";
import Dishes from "@/components/modules/public-website/home/Dishes";
import Download from "@/components/modules/public-website/home/Download";
import Partnership from "@/components/modules/public-website/home/Partnership";

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
      <Partnership />
      <AIChatWidget />
    </div>
  );
}
