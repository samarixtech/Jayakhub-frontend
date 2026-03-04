"use client";

import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, Check } from "lucide-react";
import { setCookie, getCookie } from "cookies-next";
import { useRouter, useParams } from "next/navigation";
import ReactCountryFlag from "react-country-flag";
import { getNames, getCode } from "country-list";
import emojiFlags from "emoji-flags";
import { countryCurrencyMap } from "@/lib/utils/country";

interface Country {
  code: string;
  name: string;
  flag: string;
  currencySymbol: string;
}

const getDefaultCountryData = (code: string): Country => {
  const countryName = getNames().find((name) => getCode(name) === code) || code;
  const flag = emojiFlags.countryCode(code)?.emoji || "🌐";
  const currencySymbol = countryCurrencyMap[code] || "$";
  return { code, name: countryName, flag, currencySymbol };
};

const fetchIPBasedDefaults = async (): Promise<{ ipCountry: string }> => {
  await new Promise((resolve) => setTimeout(resolve, 100));
  const defaultCountry = (getCookie("NEXT_COUNTRY") as string) || "US";
  return { ipCountry: defaultCountry };
};

interface CountrySwitcherProps {
  variant?: "default" | "navbar";
}

const CountrySwitcher: React.FC<CountrySwitcherProps> = ({
  variant = "default",
}) => {
  const router = useRouter();
  const params = useParams();

  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const desktopCountryRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const initialize = async () => {
      const { ipCountry } = await fetchIPBasedDefaults();
      const initialCountryCode = (
        (params?.country as string) ||
        (getCookie("NEXT_COUNTRY") as string) ||
        ipCountry
      ).toUpperCase();

      const allCountries: Country[] = getNames()
        .map((name) => {
          const code = getCode(name) as string;
          return getDefaultCountryData(code);
        })
        .filter((c) => c.code.length === 2);

      setCountries(allCountries);

      const initialCountry =
        allCountries.find(
          (c) => c.code.toLowerCase() === initialCountryCode.toLowerCase(),
        ) ||
        getDefaultCountryData(initialCountryCode) ||
        allCountries[0];

      setSelectedCountry(initialCountry);

      if (!getCookie("NEXT_COUNTRY")) {
        setCookie("NEXT_COUNTRY", initialCountry.code, {
          maxAge: 60 * 60 * 24 * 30,
          path: "/",
        });
        setCookie("NEXT_CURRENCY", initialCountry.currencySymbol, {
          maxAge: 60 * 60 * 24 * 30,
          path: "/",
        });
      }
    };

    initialize();
  }, [params?.country]);

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

  const filteredCountries = countries.filter(
    (country) =>
      country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      country.code.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setCookie("NEXT_COUNTRY", country.code, {
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });
    setCookie("NEXT_CURRENCY", country.currencySymbol, {
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });
    setIsCountryDropdownOpen(false);

    // Redirect globally to new country namespace
    const locale = params?.locale || "en";
    const newPath = `/${country.code.toLowerCase()}/${locale}/restaurants`;
    router.replace(newPath);
  };

  const isNavbar = variant === "navbar";

  if (!selectedCountry) return null;

  return (
    <div
      ref={desktopCountryRef}
      className={`relative ${isNavbar ? "flex w-full" : ""}`}
    >
      <button
        onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
        className={
          isNavbar
            ? "flex w-full md:w-auto items-center justify-between gap-2 px-3 py-3 md:py-2 rounded-xl bg-[#E8F4F1]/10 md:bg-[#FFF9EE] text-[#E8F4F1] md:text-[#2C2C2C] hover:bg-[#E8F4F1]/20 md:hover:bg-[#0B5D4E] md:hover:text-white transition-all md:shadow-sm"
            : "flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-all"
        }
      >
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center shrink-0 w-[30px] h-[30px] overflow-hidden">
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
          </span>
          {isNavbar ? (
            <span className="font-semibold md:hidden text-sm">
              {selectedCountry.name}
            </span>
          ) : null}
          <span
            className={
              isNavbar ? "font-semibold hidden md:block" : "font-semibold"
            }
          >
            {selectedCountry.code.toUpperCase()}
          </span>
        </div>
        <ChevronDown
          size={isNavbar ? 16 : 14}
          className={`${
            isNavbar ? "text-[#E8F4F1] md:text-[#0B5D4E]" : "text-gray-500"
          } transition-transform duration-200 ${
            isCountryDropdownOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isCountryDropdownOpen && (
        <div
          className={`absolute ${
            isNavbar
              ? "left-0 mt-14 md:mt-2 md:left-auto md:right-0 z-[60]"
              : "right-0 top-12 z-50"
          } w-full md:w-64 ${
            isNavbar
              ? "bg-[#E8F4F1] text-black border border-[#0B5D4E] shadow-xl"
              : "bg-white border rounded-lg shadow-xl"
          } rounded-lg py-2 max-h-64 overflow-y-auto animate-fade-in`}
        >
          {/* Search Input */}
          <div className="px-3 py-2 sticky top-0 bg-inherit z-10">
            <input
              type="text"
              placeholder="Search country..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 border border-[#0B5D4E]/30 rounded-md text-sm mb-2 text-black bg-white"
            />
          </div>

          {/* Filtered Countries List */}
          {filteredCountries.length > 0 ? (
            filteredCountries.map((country) => (
              <button
                key={country.code}
                onClick={() => handleCountrySelect(country)}
                className={`w-full flex items-center justify-between px-3 py-2 hover:bg-[#0B5D4E] hover:text-white transition ${
                  selectedCountry.code === country.code
                    ? "bg-[#0B5D4E] text-white font-semibold"
                    : "text-black"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center shrink-0 w-[30px] h-[30px] overflow-hidden">
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
                {selectedCountry.code === country.code && (
                  <Check size={16} className="text-[#D5AF33]" />
                )}
              </button>
            ))
          ) : (
            <div className="text-center text-gray-500 py-2">
              No countries found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CountrySwitcher;
