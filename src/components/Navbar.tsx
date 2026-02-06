"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { Check, ChevronDown, Globe, Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getNames, getCode } from "country-list";
import emojiFlags from "emoji-flags";
import { useTranslations, useLocale } from "next-intl";
import { useRouter, usePathname, useParams } from "next/navigation";
import { setCookie, getCookie } from "cookies-next";
import { countryCurrencyMap } from "@/app/utils/country";
import CountrySelector from "./ui/CountrySelector";
import ReactCountryFlag from "react-country-flag";
import image from "./../../public/ArbicLogo (2).png";
import image2 from "./../../public/EngLogo (2).png";
import LocalizedLink from "./navigation/LocalizedLink";

interface Language {
  code: string;
  name: string;
  flag: string;
  countryCode: string;
  dir: "ltr" | "rtl";
}

interface Country {
  code: string;
  name: string;
  flag: string;
  currencySymbol: string;
}

const languages: Language[] = [
  { code: "en", name: "English", flag: "🇺🇸", countryCode: "US", dir: "ltr" },
  { code: "ar", name: "العربية", flag: "🇮🇶", countryCode: "IQ", dir: "rtl" },
];

const getDefaultCountryData = (code: string): Country => {
  const countryName = getNames().find((name) => getCode(name) === code) || code;
  const flag = emojiFlags.countryCode(code)?.emoji || "🌐";
  const currencySymbol = countryCurrencyMap[code] || "$";
  return { code, name: countryName, flag, currencySymbol };
};

const fetchIPBasedDefaults = async (): Promise<{
  ipCountry: string;
  ipLocale: string;
}> => {
  await new Promise((resolve) => setTimeout(resolve, 100));

  const defaultCountry = (getCookie("NEXT_COUNTRY") as string) || "US";
  const defaultLocale = (getCookie("NEXT_LOCALE") as string) || "en";
  console.log(defaultCountry, "defaultCountry");
  console.log(defaultLocale, "defaultLocale");

  return { ipCountry: defaultCountry, ipLocale: defaultLocale };
};

const Navbar: React.FC = () => {
  const t = useTranslations("Navbar");
  const localeFromNext = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  const [currentLocaleState, setCurrentLocaleState] = useState(
    localeFromNext || "en"
  );
  const [activeLangState, setActiveLangState] = useState(
    languages.find((l) => l.code === localeFromNext) || languages[0]
  );

  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [countries, setCountries] = useState<Country[]>([]);
  const [isDesktopLangOpen, setIsDesktopLangOpen] = useState(false);
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isMobileLangDropdownOpen, setIsMobileLangDropdownOpen] =
    useState(false);

  const desktopLangRef = useRef<HTMLDivElement | null>(null);
  const desktopCountryRef = useRef<HTMLDivElement | null>(null);

  const handleCloseMobileMenu = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      setIsMobileMenuOpen(false);
      setIsClosing(false);
      setIsMobileLangDropdownOpen(false);
    }, 300);
  }, []);

  const getNewPath = useCallback(
    (newCountryCode: string, newLangCode: string, subPath = "") => {
      const pathSegments = pathname.split("/").filter(Boolean);

      const remainingSegments =
        pathSegments.length >= 2 &&
          languages.some((l) => l.code === pathSegments[1].toLowerCase())
          ? pathSegments.slice(2)
          : pathSegments;

      const fullPath = [
        // newCountryCode.toLowerCase(),
        // newLangCode.toLowerCase(),
        ...remainingSegments,
        subPath,
      ]
        .filter(Boolean)
        .join("/");

      return "/" + fullPath;
    },
    [pathname]
  );

  const handleCountrySelect = useCallback(
    (country: Country) => {
      setSelectedCountry(country);
      setIsCountryDropdownOpen(false);
      setCookie("NEXT_COUNTRY", country.code, {
        maxAge: 60 * 60 * 24 * 30,
        path: "/",
      });
      setCookie("NEXT_CURRENCY", country.currencySymbol, {
        maxAge: 60 * 60 * 24 * 30,
        path: "/",
      });
      const newPath = `/${country.code.toLowerCase()}/${currentLocaleState.toLowerCase()}/restaurants`;
      router.replace(newPath);

      // 4. Close mobile menu if open
      if (isMobileMenuOpen) {
        handleCloseMobileMenu();
      }
      // handleNavigationChange(country.code, currentLocaleState);
    },
    [
      currentLocaleState,
      getNewPath,
      router,
      isMobileMenuOpen,
      handleCloseMobileMenu,
    ]
  );

  const changeLanguage = useCallback(
    (newLocale: string) => {
      const newLang =
        languages.find((l) => l.code === newLocale) || languages[0];

      setCurrentLocaleState(newLocale);
      setActiveLangState(newLang);
      setIsDesktopLangOpen(false);
      setIsMobileLangDropdownOpen(false);

      setCookie("NEXT_LOCALE", newLocale, {
        maxAge: 60 * 60 * 24 * 30,
        path: "/",
      });

      document.documentElement.lang = newLang.code;
      document.documentElement.dir = newLang.dir;

      if (typeof window !== "undefined") {
        sessionStorage.setItem("locale", newLocale);
        router.refresh();
      }

      if (selectedCountry) {
        const newPath = getNewPath(selectedCountry.code, newLocale);
        router.refresh();
      } else {
        router.refresh();
      }

      if (isMobileMenuOpen) {
        handleCloseMobileMenu();
      }
    },
    [
      selectedCountry,
      getNewPath,
      router,
      isMobileMenuOpen,
      handleCloseMobileMenu,
      languages,
      activeLangState,
    ]
  );

  useEffect(() => {
    const initialize = async () => {
      const { ipCountry, ipLocale } = await fetchIPBasedDefaults();
      const initialCountryCode = (
        (params?.country as string) ||
        (getCookie("NEXT_COUNTRY") as string) ||
        ipCountry
      ).toUpperCase();
      const initialLocale = (
        (params?.locale as string) ||
        (getCookie("NEXT_LOCALE") as string) ||
        ipLocale
      ).toLowerCase();
      const allCountries: Country[] = getNames()
        .map((name) => {
          const code = getCode(name) as string;
          return getDefaultCountryData(code);
        })
        .filter((c) => c.code.length === 2);

      setCountries(allCountries);
      const initialCountry =
        allCountries.find(
          (c) => c.code.toLowerCase() === initialCountryCode.toLowerCase()
        ) ||
        getDefaultCountryData(initialCountryCode) ||
        allCountries[0];
      setSelectedCountry(initialCountry);
      const lang =
        languages.find((l) => l.code === initialLocale) || languages[0];
      setCurrentLocaleState(lang.code);
      setActiveLangState(lang);
      if (!getCookie("NEXT_COUNTRY")) {
        setCookie("NEXT_COUNTRY", initialCountry.code, {
          maxAge: 60 * 60 * 24 * 30,
          path: "/",
        });
      }
      if (!getCookie("NEXT_LOCALE")) {
        setCookie("NEXT_LOCALE", lang.code, {
          maxAge: 60 * 60 * 24 * 30,
          path: "/",
        });
      }
    };

    initialize();
    console.log(params?.locale, "params?.locale");
  }, [params?.country, params?.locale]);
  useEffect(() => {
    document.documentElement.lang = activeLangState.code;
    document.documentElement.dir = activeLangState.dir;
  }, [activeLangState]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (desktopLangRef.current && !desktopLangRef.current.contains(target))
        setIsDesktopLangOpen(false);
      if (
        desktopCountryRef.current &&
        !desktopCountryRef.current.contains(target)
      )
        setIsCountryDropdownOpen(false);
      if (
        isMobileLangDropdownOpen &&
        !(event.target as HTMLElement).closest("#mobile-lang")
      )
        setIsMobileLangDropdownOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isDesktopLangOpen, isCountryDropdownOpen, isMobileLangDropdownOpen]);

  // --- Nav Items ---
  const navItems = [
    { label: t("home"), to: "/home" },
    { label: t("about"), to: "/about" },
    { label: t("services"), to: "/services" },
    { label: t("contact"), to: "/contact" },
    { label: t("newsroom"), to: "/blogs" },
    { label: t("partners"), to: "/partners" },
  ];

  if (!selectedCountry) {
    return (
      <nav className="bg-[#0B5D4E] h-20 flex items-center justify-center"></nav>
    );
  }
  const isArabic = activeLangState.code === "ar";

  return (
    <nav className="bg-[#0B5D4E] shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto  lg:px-6">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <LocalizedLink href="/home">
            <Image
              src={isArabic ? image : image2}
              alt="Logo"
              width={270}
            />
          </LocalizedLink>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.to}
                href={item.to}
                className="text-[#E8F4F1] hover:text-[#B6932F] font-medium transition-colors duration-200"
              >
                {item.label}
              </Link>
            ))}

            <div className="flex items-center gap-3">
              <div ref={desktopLangRef} className="relative">
                <button
                  onClick={() => setIsDesktopLangOpen(!isDesktopLangOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#FFF9EE]  text-[#2C2C2C]  hover:bg-[#0B5D4E] hover:text-white  transition-all shadow-sm"
                >
                  <span className="flex items-center justify-center shrink-0 w-[30px] h-[30px]">
                    <ReactCountryFlag
                      countryCode={activeLangState.countryCode.toUpperCase()}
                      svg
                      style={{
                        width: "30px",
                        height: "30px",
                        objectFit: "cover",
                        display: "block",
                        borderRadius: "50%",
                      }}
                      title={activeLangState.name}
                    />
                  </span>
                  <span className="font-semibold">
                    {activeLangState.name}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`text-[#0B5D4E] transition-transform duration-200 ${isDesktopLangOpen ? "rotate-180" : ""
                      }`}
                  />
                </button>

                {isDesktopLangOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-[#E8F4F1] border border-[#0B5D4E] rounded-lg shadow-xl z-50 overflow-hidden animate-fade-in">
                    {languages.map((lng) => (
                      <button
                        key={lng.code}
                        onClick={() => changeLanguage(lng.code)}
                        className={`w-full flex items-center justify-between px-3 py-2 text-sm transition-colors ${activeLangState.code === lng.code
                          ? "bg-[#0B5D4E] text-white font-semibold"
                          : "hover:bg-[#0B5D4E] hover:text-white "
                          }`}
                      >
                        <div className="flex items-center gap-2">
                          <ReactCountryFlag
                            countryCode={lng.countryCode.toUpperCase()}
                            svg
                            style={{
                              width: "30px",
                              height: "30px",
                              objectFit: "cover",
                              display: "block",
                              borderRadius: "50%",
                            }}
                            title={lng.name}
                          />
                          <span className="text-sm font-medium">
                            {lng.name}
                          </span>
                        </div>
                        {activeLangState.code === lng.code && (
                          <Check size={16} className="text-[#D5AF33]" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Desktop Country */}
              <div className="flex items-center gap-6">
                <CountrySelector
                  countries={countries}
                  selectedCountry={selectedCountry}
                  onSelectCountry={handleCountrySelect}
                />
              </div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="text-[#E8F4F1] hover:text-[#B6932F] p-2"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className={`fixed inset-0 bg-[#2C2C2C]/50 z-40 ${isClosing ? "animate-fade-out-fast" : "animate-fade-in-fast"
              }`}
            onClick={handleCloseMobileMenu}
          ></div>

          {/* Sidebar */}
          <div
            className={`fixed top-0 right-0 h-full w-[80%] max-w-[300px] bg-linear-to-b from-[#0B5D4E] to-[#0B5D4E] text-[#E8F4F1] z-50 shadow-2xl overflow-y-auto ${isClosing ? "animate-slide-out-right" : "animate-slide-in-right"
              }`}
          >
            <div className="flex justify-between items-center p-4 border-b border-[#E8F4F1]/20">
              <h2 className="text-lg font-semibold">Menu</h2>
              <button
                onClick={handleCloseMobileMenu}
                className="p-2 rounded-lg hover:bg-[#E8F4F1]/10 transition"
              >
                <X className="w-6 h-6 text-[#E8F4F1]" />
              </button>
            </div>

            <div className="flex flex-col space-y-1 p-4">
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  href={item.to}
                  onClick={handleCloseMobileMenu}
                  className="hover:bg-[#E8F4F1]/10 px-3 py-3 rounded-lg transition-colors text-base font-medium"
                >
                  {item.label}
                </Link>
              ))}

              <div className="border-t border-[#E8F4F1]/20 my-3"></div>

              {/* Mobile Language Selector */}
              <div className="relative" id="mobile-lang">
                <button
                  onClick={() =>
                    setIsMobileLangDropdownOpen(!isMobileLangDropdownOpen)
                  }
                  className="w-full flex items-center justify-between px-3 py-3 rounded-lg bg-[#E8F4F1]/10 hover:bg-[#E8F4F1]/20 border border-[#E8F4F1]/20 transition-all duration-200"
                >
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center justify-center shrink-0 w-[2em] h-[1.5em] overflow-hidden">
                      <ReactCountryFlag
                        countryCode={activeLangState.countryCode.toUpperCase()}
                        svg
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "fill",
                          display: "block",
                        }}
                        aria-label={activeLangState.name}
                        title={activeLangState.name}
                      />
                    </div>
                    <span className="text-sm font-medium text-[#E8F4F1]">
                      {activeLangState.name}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-[#E8F4F1] transition-transform duration-200 ${isMobileLangDropdownOpen ? "rotate-180" : ""
                      }`}
                  />
                </button>

                {isMobileLangDropdownOpen && (
                  <div className="mt-2 bg-[#FFF9EE]  rounded-lg shadow-lg border border-[#D5AF33] py-1 max-h-48 overflow-y-auto">
                    {languages.map((lng) => (
                      <button
                        key={lng.code}
                        onClick={() => changeLanguage(lng.code)}
                        className={`
          w-full flex items-center justify-between px-3 py-2 transition-colors
          ${currentLocaleState === lng.code
                            ? "bg-[#0B5D4E] text-white" // active item
                            : "hover:bg-[#0B5D4E] hover:text-white text-[#2C2C2C]" // normal item
                          }
        `}
                      >
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">
                            <ReactCountryFlag
                              countryCode={lng.countryCode.toUpperCase()}
                              svg
                              style={{
                                width: "24px",
                                height: "18px",
                                display: "block",
                              }}
                              title={lng.name}
                            />
                          </span>
                          <span
                            className={`
            text-sm font-medium
            ${currentLocaleState === lng.code ? "text-white" : "text-[#2C2C2C]"}
          `}
                          >
                            {lng.name}
                          </span>
                        </div>

                        {currentLocaleState === lng.code && (
                          <Check size={16} className="text-[#D5AF33]" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Mobile Country Selector */}
              <div className="relative">
                <button
                  onClick={() =>
                    setIsCountryDropdownOpen(!isCountryDropdownOpen)
                  }
                  className="w-full flex items-center justify-between px-3 py-3 rounded-lg bg-[#E8F4F1]/10 hover:bg-[#E8F4F1]/20 border border-[#E8F4F1]/20 transition-all duration-200"
                >
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center justify-center shrink-0 w-[2em] h-[1.5em] overflow-hidden">
                      {selectedCountry ? (
                        <ReactCountryFlag
                          countryCode={selectedCountry.code.toUpperCase()}
                          svg
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "fill",
                            display: "block",
                          }}
                          aria-label={selectedCountry.name}
                          title={selectedCountry.name}
                        />
                      ) : (
                        "🌐"
                      )}
                    </div>
                    <span className="text-sm font-medium text-[#E8F4F1]">
                      {selectedCountry.name}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-[#E8F4F1] transition-transform duration-200 ${isCountryDropdownOpen ? "rotate-180" : ""
                      }`}
                  />
                </button>

                {isCountryDropdownOpen && (
                  <div className="mt-2 bg-[#E8F4F1] rounded-lg shadow-lg border border-[#FFF9EE] py-1 max-h-48 overflow-y-auto">
                    {countries.map((country) => (
                      <button
                        key={country.code}
                        onClick={() => handleCountrySelect(country)}
                        className={`w-full flex items-center justify-between px-3 py-2 text-black hover:bg-[#0B5D4E] transition-colors ${selectedCountry.code === country.code
                          ? "bg-[#0B5D4E] text-white font-semibold"
                          : "hover:bg-[#0B5D4E] hover:text-white "
                          }`}
                      >
                        <div className="flex items-center space-x-2">
                          <span className="flex items-center justify-center shrink-0 w-[2em] h-[1.5em] overflow-hidden">
                            <ReactCountryFlag
                              countryCode={country.code.toUpperCase()}
                              svg
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "fill",
                                display: "block",
                              }}
                              title={country.name}
                            />
                          </span>
                          <span className="text-sm">{country.name} </span>
                        </div>
                        {selectedCountry.code === country.code && (
                          <Check size={16} className="text-[#D5AF33]" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
      <style jsx>{`
        /* ... (Your existing CSS animations here) ... */
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fade-in-fast {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fade-out-fast {
          animation: fade-in-fast 0.3s reverse forwards;
        }

        .animate-fade-in {
          animation: fade-in 0.25s ease-out;
        }
        .animate-fade-in-fast {
          animation: fade-in-fast 0.3s ease-out;
        }
        @keyframes dropdown-fade {
          from {
            opacity: 0;
            transform: translateY(-5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-dropdown-fade {
          animation: dropdown-fade 0.2s ease-out;
        }

        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)
            forwards;
        }

        @keyframes slide-out-right {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(100%);
          }
        }
        .animate-slide-out-right {
          animation: slide-out-right 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)
            forwards;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
