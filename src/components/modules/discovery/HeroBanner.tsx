import React from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const HeroBanner = () => {
  return (
    <div className="relative w-full h-[300px] md:h-[400px] rounded-[30px] overflow-hidden bg-black text-white">
      {/* Background Image Placeholder - In real app, use next/image or background-image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-70"
        style={{ backgroundImage: "url('/images/hero-food.jpg')" }} // Placeholder path
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent" />

      <div className="relative z-10 h-full flex flex-col justify-center px-8 md:px-16 max-w-2xl space-y-4">
        <span className="bg-[#346853] text-[#E8F4F1] text-xs font-bold px-3 py-1 rounded-full w-fit">
          SEASONAL SPECIAL
        </span>
        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
          Savor the Flavors <br /> of Summer
        </h1>
        <p className="text-gray-300 text-sm md:text-base max-w-md">
          Get up to 40% off on all pizza and pasta selections this weekend only.
        </p>
        <Button className="bg-[#346853] hover:bg-[#2a5443] text-white rounded-full px-6 w-fit font-bold">
          Order Now <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      {/* Carousel Dots Placeholder */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
        <div className="w-6 h-1 bg-white rounded-full" />
        <div className="w-1.5 h-1 bg-white/50 rounded-full" />
        <div className="w-1.5 h-1 bg-white/50 rounded-full" />
      </div>
    </div>
  );
};

export default HeroBanner;
