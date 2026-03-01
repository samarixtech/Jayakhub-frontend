"use client";
import { GlobalSearch } from "../../components/GlobalSearch";

const HeroBanner = () => {
  return (
    <div className="relative w-full h-[180px] md:h-[220px] bg-black text-white z-20">
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
        <GlobalSearch />
      </div>
    </div>
  );
};

export default HeroBanner;
