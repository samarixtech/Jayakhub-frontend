"use client";

import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, Check } from "lucide-react";
import { setCookie, getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import ReactCountryFlag from "react-country-flag";

// Shared Country Type that includes currencySymbol
interface Country {
  code: string;
  name: string;
  flag: string;
  currencySymbol: string; // Added currencySymbol to match the updated type
}

interface CountrySelectorProps {
  countries: Country[];
  selectedCountry: Country | null;
  onSelectCountry: (country: Country) => void;
}

const CountrySelector: React.FC<CountrySelectorProps> = ({
  countries,
  selectedCountry,
  onSelectCountry,
}) => {
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const desktopCountryRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        desktopCountryRef.current &&
        !desktopCountryRef.current.contains(event.target as Node)
      ) {
        setIsCountryDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Filter countries based on search query
  const filteredCountries = countries.filter(
    (country) =>
      country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      country.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCountrySelect = (country: Country) => {
    onSelectCountry(country);

    setCookie("NEXT_COUNTRY", country.code, { maxAge: 60 * 60 * 24 * 30, path: "/" });
    setCookie("NEXT_CURRENCY", country.currencySymbol, { maxAge: 60 * 60 * 24 * 30, path: "/" });

    setIsCountryDropdownOpen(false);
  };

  return (
    <div ref={desktopCountryRef} className="relative">
      <button
        onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#FFF9EE]  text-[#2C2C2C]  hover:bg-[#0B5D4E] hover:text-white transition-all shadow-sm"
      >
        <span className="flex items-center justify-center shrink-0 w-[30px] h-[30px]">
          {selectedCountry ? (
            <ReactCountryFlag
              countryCode={selectedCountry.code.toUpperCase()}
              svg
              style={{
                width: "30px",
                height: "30px",
                objectFit: "cover",
                display: "block",
                borderRadius: "50%",
              }}
              aria-label={selectedCountry.name}
              title={selectedCountry.name}
            />
          ) : (
            "🌐"
          )}
        </span>
        <span className="font-semibold">{selectedCountry?.code.toUpperCase()}</span>
        <ChevronDown
          size={16}
          className={`text-[#0B5D4E] transition-transform duration-200 ${isCountryDropdownOpen ? "rotate-180" : ""
            }`}
        />
      </button>

      {isCountryDropdownOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-[#E8F4F1] border border-[#0B5D4E] rounded-lg shadow-xl py-2 max-h-64 overflow-y-auto z-50 animate-fade-in">
          {/* Search Input */}
          <div className="px-3 py-2">
            <input
              type="text"
              placeholder="Search country..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 border border-yellow-200 rounded-md text-sm mb-2"
            />
          </div>

          {/* Filtered Countries List */}
          {filteredCountries.length > 0 ? (
            filteredCountries.map((country) => (
              <button
                key={country.code}
                onClick={() => handleCountrySelect(country)}
                className={`w-full flex items-center justify-between px-3 py-2 hover:bg-[#0B5D4E] transition ${selectedCountry?.code === country.code
                  ? "bg-[#0B5D4E] text-white font-semibold"
                  : "hover:bg-[#0B5D4E] hover:text-white"
                  }`}
              >
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center shrink-0 w-[30px] h-[30px]">
                    <ReactCountryFlag
                      countryCode={country.code.toUpperCase()}
                      svg
                      style={{
                        width: "30px",
                        height: "30px",
                        objectFit: "cover",
                        display: "block",
                        borderRadius: "50%",
                      }}
                      title={country.name}
                    />
                  </span>
                  <span className="text-sm">{country.name}</span>
                </div>
                {selectedCountry?.code === country.code && (
                  <Check size={16} className="text-[#D5AF33]" />
                )}
              </button>
            ))
          ) : (
            <div className="text-center text-gray-500 py-2">No countries found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default CountrySelector;
