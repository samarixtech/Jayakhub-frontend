import { Search } from "lucide-react";

export const SupportSearchBanner = () => {
  return (
    <div className="w-full rounded-2xl bg-gradient-to-r from-[#219e74] to-[#39cd96] px-8 py-12 mb-6 text-center text-white relative flex flex-col items-center justify-center shadow-sm overflow-hidden">
      <div className="absolute top-0 right-0 w-[400px] h-full bg-white/5 transform -skew-x-[35deg] origin-top translate-x-32" />
      <div className="absolute top-0 right-0 w-[250px] h-[250px] bg-[#39cd96] rounded-full blur-3xl translate-x-1/3 -translate-y-1/3 opacity-80" />

      <h2 className="text-[22px] md:text-[24px] font-bold mb-2 relative z-10 tracking-wide text-white">
        How can we help you today?
      </h2>
      <p className="text-white/80 text-[13px] mb-6 relative z-10 font-medium">
        Search for articles, FAQs, or browse our knowledge base.
      </p>
      <div className="w-full max-w-[500px] relative z-10">
        <Search
          className="w-[18px] h-[18px] absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          strokeWidth={2}
        />
        <input
          type="text"
          placeholder="e.g. How to change opening hours.."
          className="w-full h-11 pl-12 pr-4 rounded-full bg-white text-[13px] text-gray-800 placeholder:text-gray-400 border-0 outline-none shadow-sm focus:ring-2 focus:ring-white/40"
        />
      </div>
    </div>
  );
};
