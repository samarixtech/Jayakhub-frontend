"use client";
import { Search } from "lucide-react";

const HeroBanner = () => {
  return (
    <div className="relative w-full h-[180px] md:h-[220px] overflow-hidden bg-black text-white">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1627461985459-51600559fffe?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
        }}
      />
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center gap-5 px-4">
        <h1 className="text-2xl md:text-3xl font-bold text-white text-center">
          Food delivery and more
        </h1>

        {/* Search Bar */}
        <div className="w-full max-w-[540px] flex items-center bg-white rounded-full shadow-lg overflow-hidden px-3 md:px-4 py-1 md:py-0">
          <Search className="w-4 h-4 md:w-5 md:h-5 text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder="Search for restaurants, cuisines..."
            className="flex-1 h-10 md:h-12 px-2 md:px-3 text-sm text-gray-700 placeholder:text-gray-400 outline-none bg-transparent"
          />
          <button className="bg-[#346853] hover:bg-[#2a5443] text-white text-xs md:text-sm font-semibold px-4 py-2 md:px-5 md:py-2 rounded-full transition-colors shrink-0">
            Search
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
