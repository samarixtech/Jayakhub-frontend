"use client";
import { useState } from "react";
import { SearchIcon, Filter, RotateCcw, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";

// SUB-COMPONENTS
const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="py-6 border-b border-slate-100 last:border-none">
    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
      {title}
    </h3>
    <div className="space-y-3">{children}</div>
  </div>
);

const FilterItem = ({ label, checked, onChange }: any) => (
  <label className="flex items-center justify-between cursor-pointer group py-1">
    <span
      className={`text-sm transition-colors ${
        checked
          ? "text-slate-900 font-medium"
          : "text-slate-600 group-hover:text-slate-900"
      }`}
    >
      {label}
    </span>
    <div className="relative flex items-center">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="peer h-5 w-5 appearance-none rounded border border-slate-300 checked:bg-[#0B5D4E] checked:border-[#0B5D4E] transition-all cursor-pointer"
      />
      <svg
        className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none left-0.5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="4"
      >
        <path d="M5 13l4 4L19 7" />
      </svg>
    </div>
  </label>
);

const Pill = ({ active, children, onClick }: any) => (
  <button
    onClick={onClick}
    className={`
      px-4 py-2 rounded-lg text-xs font-medium transition-all duration-200
      ${
        active
          ? "bg-[#0B5D4E] text-white shadow-sm ring-2 ring-[#0B5D4E] ring-offset-1"
          : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200"
      }
    `}
  >
    {children}
  </button>
);

const CustomSlider = ({ value, setValue, max, step, unit = "" }: any) => (
  <div className="pt-2 px-1">
    <input
      type="range"
      min="0"
      max={max}
      step={step}
      value={value}
      onChange={(e) => setValue(Number(e.target.value))}
      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0B5D4E]"
    />
    <div className="flex justify-between mt-2 text-[11px] font-bold text-slate-500">
      <span>0{unit}</span>
      <span className="text-[#0B5D4E] bg-[#0B5D4E]/10 px-2 py-0.5 rounded">
        {value}
        {unit}
      </span>
      <span>
        {max}
        {unit}
      </span>
    </div>
  </div>
);

// MAIN COMPONENT

const SidebarFilters = () => {
  const t = useTranslations();
  const [isOpen, setIsOpen] = useState(false);
  const [sortBy, setSortBy] = useState("relevance");
  const [quickFilters, setQuickFilters] = useState<string[]>([]);
  const [offers, setOffers] = useState<string[]>([]);
  const [cuisineSearch, setCuisineSearch] = useState("");
  const [cuisines, setCuisines] = useState<string[]>([]);
  // const [price, setPrice] = useState("medium");
  const [rating, setRating] = useState(4);
  const [deliveryTime, setDeliveryTime] = useState("any");
  const [distance, setDistance] = useState(5);

  const allCuisines = [
    "American",
    "Biryani",
    "BBQ",
    "Beverages",
    "Chinese",
    "Pizza",
    "Broast",
    "Fast Food",
    "Desserts",
    "Burgers",
  ];
  const quickOptions = [
    "trending",
    "popular",
    "topRated",
    "new",
    "nearby",
    "halal",
  ];
  const offerOptions = ["freeDelivery", "deals", "voucherAccepted"];

  const resetAll = () => {
    setSortBy("relevance");
    setQuickFilters([]);
    setOffers([]);
    setCuisines([]);
    setRating(4);
    setDistance(5);
  };

  const SidebarContent = (
    <div className="flex flex-col h-full bg-white">
      {/* HEADER */}
      <div className="px-6 py-5 flex items-center justify-between border-b border-slate-100">
        <div>
          <h2 className="text-lg font-bold text-slate-900 leading-none">
            {t("filters.title")}
          </h2>
          <p className="text-[11px] text-slate-400 mt-1 uppercase tracking-tighter">
            Adjust your preferences
          </p>
        </div>
        <button
          onClick={resetAll}
          className="p-2 text-slate-400 hover:text-[#0B5D4E] transition-colors rounded-full hover:bg-slate-50"
          title="Reset All"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* SCROLLABLE AREA */}
      <div className="flex-1 overflow-y-auto px-6 py-2 ">
        {/* SORT BY */}
        <Section title={t("sortBy.title")}>
          <div className="grid grid-cols-1 gap-2">
            {["relevance", "fastest", "topRated", "nearest"].map((key) => (
              <button
                key={key}
                onClick={() => setSortBy(key)}
                className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                  sortBy === key
                    ? "border-[#0B5D4E] bg-[#0B5D4E]/5 text-[#0B5D4E]"
                    : "border-slate-100 hover:border-slate-200 text-slate-600"
                }`}
              >
                <span className="text-sm font-medium">
                  {t(`sortBy.${key}`)}
                </span>
                {sortBy === key && (
                  <div className="w-2 h-2 rounded-full bg-[#0B5D4E]" />
                )}
              </button>
            ))}
          </div>
        </Section>

        {/* QUICK FILTERS */}
        <Section title={t("quickFilters.title")}>
          <div className="flex flex-wrap gap-2">
            {quickOptions.map((key) => (
              <Pill
                key={key}
                active={quickFilters.includes(key)}
                onClick={() =>
                  setQuickFilters((prev) =>
                    prev.includes(key)
                      ? prev.filter((x) => x !== key)
                      : [...prev, key]
                  )
                }
              >
                {t(`quickFilters.${key}`)}
              </Pill>
            ))}
          </div>
        </Section>

        {/* OFFERS */}
        <Section title={t("offers.title")}>
          {offerOptions.map((key) => (
            <FilterItem
              key={key}
              label={t(`offers.${key}`)}
              checked={offers.includes(key)}
              onChange={() =>
                setOffers((prev) =>
                  prev.includes(key)
                    ? prev.filter((x) => x !== key)
                    : [...prev, key]
                )
              }
            />
          ))}
        </Section>

        {/* RATING SLIDER */}
        <Section title={t("rating.title")}>
          <CustomSlider
            value={rating}
            setValue={setRating}
            max={5}
            step={0.1}
            unit="★"
          />
        </Section>

        {/* DELIVERY TIME */}
        <Section title={t("deliveryTime.title")}>
          <div className="flex gap-2 flex-wrap">
            {["any", "15_30", "30_45"].map((key) => (
              <button
                key={key}
                onClick={() => setDeliveryTime(key)}
                className={`flex-1 py-2 px-3 rounded-lg border text-[11px] font-bold transition-all ${
                  deliveryTime === key
                    ? "bg-slate-900 text-white border-slate-900"
                    : "bg-white text-slate-500 border-slate-200"
                }`}
              >
                {t(`deliveryTime.${key}`)}
              </button>
            ))}
          </div>
        </Section>

        {/* DISTANCE SLIDER */}
        <Section title={t("distance.title")}>
          <CustomSlider
            value={distance}
            setValue={setDistance}
            max={20}
            step={1}
            unit="km"
          />
        </Section>

        {/* CUISINES (SEARCHABLE) */}
        <Section title={t("cuisines.title")}>
          <div className="relative mb-3">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border-none rounded-xl focus:ring-1 focus:ring-[#0B5D4E] transition-all"
              placeholder={t("cuisines.searchPlaceholder")}
              value={cuisineSearch}
              onChange={(e) => setCuisineSearch(e.target.value)}
            />
          </div>
          <div className="space-y-1 max-h-40 overflow-y-auto pr-2">
            {allCuisines
              .filter((c) =>
                c.toLowerCase().includes(cuisineSearch.toLowerCase())
              )
              .map((c) => (
                <FilterItem
                  key={c}
                  label={c}
                  checked={cuisines.includes(c)}
                  onChange={() =>
                    setCuisines((prev) =>
                      prev.includes(c)
                        ? prev.filter((x) => x !== c)
                        : [...prev, c]
                    )
                  }
                />
              ))}
          </div>
        </Section>
      </div>

      {/* FOOTER */}
      <div className="p-6 bg-white border-t border-slate-100">
        <button
          onClick={() => setIsOpen(false)}
          className="w-full py-4 bg-[#0B5D4E] hover:bg-[#08483C] text-white rounded-2xl font-bold text-sm shadow-lg shadow-[#0B5D4E]/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
        >
          {t("filters.apply")}
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed right-6 bottom-6 z-50 p-4 bg-[#0B5D4E] text-white rounded-full shadow-2xl lg:hidden active:scale-90 transition-transform"
      >
        <Filter className="w-6 h-6" />
      </button>

      <aside className="hidden lg:block w-72 h-[calc(100vh-140px)] sticky top-32">
        <div className="rounded-2xl border border-slate-100 shadow-sm h-full overflow-hidden bg-white">
          {SidebarContent}
        </div>
      </aside>

      {/* MOBILE DRAWER */}
      <div
        className={`fixed inset-0 z-100 lg:hidden transition-all duration-500 ${
          isOpen ? "visible" : "invisible"
        }`}
      >
        <div
          onClick={() => setIsOpen(false)}
          className={`absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-500 ${
            isOpen ? "opacity-100" : "opacity-0"
          }`}
        />
        <div
          className={`absolute left-0 top-0 h-full w-[300px] bg-white transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {SidebarContent}
        </div>
      </div>
    </>
  );
};

export default SidebarFilters;
