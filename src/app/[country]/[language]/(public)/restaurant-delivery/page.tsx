"use client";

import { Hero } from "@/components/modules/public-website/restaurant-delivery/Hero";
import { Mission } from "@/components/modules/public-website/restaurant-delivery/Mission";
import { Calculator } from "@/components/modules/public-website/restaurant-delivery/Calculator";
import { QuickLinks } from "@/components/modules/public-website/restaurant-delivery/QuickLinks";
import { CompareTable } from "@/components/modules/public-website/restaurant-delivery/CompareTable";
import { Pricing } from "@/components/modules/public-website/restaurant-delivery/Pricing";
import { Programs } from "@/components/modules/public-website/restaurant-delivery/Programs";
import { HowItWorks } from "@/components/modules/public-website/restaurant-delivery/HowItWorks";
import { Features } from "@/components/modules/public-website/restaurant-delivery/Features";

export default function RestaurantDeliveryPage() {
  return (
    <div className="min-h-screen bg-[#F2F2ED] text-[#1a1a1a] font-sans selection:bg-[#FF6B35]/20">
      <Hero />
      <Mission />
      <QuickLinks />
      <Calculator />
      <CompareTable />
      <Pricing />
      <Programs />
      <HowItWorks />
      <Features />
    </div>
  );
}
