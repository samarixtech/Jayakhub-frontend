"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSelector } from "react-redux";
import { FiShoppingBag } from "react-icons/fi";
import { User, BarChart, ShoppingBag } from "lucide-react";
import { useTranslations } from "next-intl";
import { RootState } from "@/redux/store/store";
import CartDrawer from "@/components/CartDrawer";
import AuthModal from "@/components/AuthModal";
import useLocale from "@/hooks/useLocals";
import image from "../../../public/EngLogo (2).png";
import arabicLogo from "../../../public/ArbicLogo (2).png";
import { setCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import LocalizedLink from "../navigation/LocalizedLink";

interface UserData {
  id: string;
  email: string;
}

interface Language {
  code: string;
  name: string;
  flag: string;
  dir: "ltr" | "rtl";
}

const languages: Language[] = [
  { code: "en", name: "English", flag: "🇺🇸", dir: "ltr" },
  { code: "ar", name: "العربية", flag: "🇮🇶", dir: "rtl" },
];

// ---------------- SVG Icons ----------------
const MapPin = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
  >
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);
const ChevronDown = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
);
// const ShoppingBagIcon = (props: React.SVGProps<SVGSVGElement>) => (
//   <svg
//     {...props}
//     xmlns="http://www.w3.org/2000/svg"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth="2"
//     strokeLinecap="round"
//     strokeLinejoin="round"
//     viewBox="0 0 24 24"
//   >
//     <path d="M6 2L3 7v13a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7l-3-5Z" />
//     <line x1="3" x2="21" y1="7" y2="7" />
//     <path d="M12 22v-3" />
//     <path d="M12 7V2" />
//   </svg>
// );
const Globe = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    <line x1="2" x2="22" y1="12" y2="12" />
  </svg>
);
// const Bike = (props: React.SVGProps<SVGSVGElement>) => (
//   <svg
//     {...props}
//     xmlns="http://www.w3.org/2000/svg"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth="2"
//     strokeLinecap="round"
//     strokeLinejoin="round"
//     viewBox="0 0 24 24"
//   >
//     <circle cx="12" cy="18" r="4" />
//     <path d="M19 18a2 2 0 0 0 0-4H7a2 2 0 0 0 0 4" />
//     <path d="M22 18h-2l-1-4h-2" />
//     <path d="m14 14 1 4h5" />
//     <path d="m5 18-1-4h-2" />
//     <path d="m3 7 3 2 4-5 5 5 1-2" />
//     <path d="M13 10V4" />
//   </svg>
// );
// const Package = (props: React.SVGProps<SVGSVGElement>) => (
//   <svg
//     {...props}
//     xmlns="http://www.w3.org/2000/svg"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth="2"
//     strokeLinecap="round"
//     strokeLinejoin="round"
//     viewBox="0 0 24 24"
//   >
//     <path d="m7.5 4.27 9.5.5c.42 0 .78-.35.8-.76V2.5A.5.5 0 0 0 18 2h-9c-.48 0-.82.3-.87.72V4.2c0-.06-.02-.12-.02-.18" />
//     <path d="m20 10-8-5-8 5V21l8-4 8 4Z" />
//     <path d="m12 17 8 4M12 17 4 21M4 21V10M20 10v11" />
//   </svg>
// );

// ---------------- Profile Dropdown ----------------

interface ProfileDropdownProps {
  profileContent: React.ReactNode;
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({
  profileContent,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-3 bg-[#0B5D4E] rounded-full hover:bg-[#084838] transition duration-150 relative z-10 focus:outline-none focus:ring-2 focus:ring-[#0B5D4E]"
      >
        <User className="w-6 h-6 text-[#E8F4F1]" />
      </button>
      <div
        className={`absolute top-full mt-2 right-0 w-64 rounded-xl shadow-2xl bg-[#E8F4F1] p-3 transition-all duration-300 origin-top-right z-50 overflow-hidden border border-[#FFF9EE]
          ${
            isOpen
              ? "scale-100 opacity-100 max-h-[500px]"
              : "scale-95 opacity-0 max-h-0"
          }`}
      >
        {profileContent}
      </div>
    </div>
  );
};

// ---------------- Dropdown Component ----------------
interface DropdownProps {
  label: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  content: React.ReactNode;
  isLocation?: boolean;
  onClose?: () => void;
}

const Dropdown: React.FC<DropdownProps> = ({
  label,
  icon: Icon,
  content,
  isLocation = false,
  onClose,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
        onClose?.();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div
      ref={ref}
      className={`relative ${isLocation ? "w-full sm:w-auto" : "w-auto"}`}
    >
      <button
        onClick={toggleDropdown}
        className={`flex items-center w-full md:p-3 p-1 rounded-lg border transition-all duration-200 bg-[#E8F4F1] shadow-sm hover:shadow-md focus:outline-none focus:ring-2 ${
          isOpen
            ? "border-[#0B5D4E] ring-[#0B5D4E]"
            : "border-[#FFF9EE] hover:border-[#0B5D4E] hover:ring-1 hover:ring-[#0B5D4E]"
        }`}
      >
        <Icon className="w-5 h-5 text-[#0B5D4E] mr-2 shrink-0" />
        <span className="text-sm font-semibold text-gray-700 max-w-[200px] truncate">
          {label}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 ml-auto transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <div
        className={`
          absolute top-full mt-2 rounded-b-2xl shadow-2xl bg-[#E8F4F1] p-4 transition-all duration-300 origin-top z-50 overflow-auto border border-[#FFF9EE]
          ${
            isLocation
              ? "w-full sm:w-[300px] right-0 lg:left-0"
              : "w-40 right-0"
          }
          ${
            isOpen
              ? "scale-y-100 opacity-100 max-h-[300px]"
              : "scale-y-0 opacity-0 max-h-0"
          }
        `}
        style={{ maxHeight: "300px" }} // max height with scroll on overflow
      >
        {content}
      </div>
    </div>
  );
};

// ---------------- Header Component ----------------
interface IFDPHeaderProps {
  currentCountryCode?: string;
  currentLangCode?: string;
}

const IFDPHeader: React.FC<IFDPHeaderProps> = () => {
  const tHeader = useTranslations("idfpHeader");
  const tLocation = useTranslations("location.dropdown");
  // const tLanguage = useTranslations("language.dropdown");
  const tProfile = useTranslations("profile");
  const [currentAddress, setCurrentAddress] = useState("Detecting location...");
  const { country, language } = useLocale();
  const router = useRouter();

  // -------- Auth State --------
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");

  const openLogin = () => {
    setAuthMode("login");
    setAuthModalOpen(true);
  };
  const openSignup = () => {
    setAuthMode("signup");
    setAuthModalOpen(true);
  };

  const checkAuthStatus = useCallback(() => {
    if (typeof window === "undefined") return;
    const token = sessionStorage.getItem("authToken");
    const userData = sessionStorage.getItem("user");
    if (token && userData) {
      setIsLoggedIn(true);
      try {
        setCurrentUser(JSON.parse(userData));
      } catch {
        setIsLoggedIn(false);
        setCurrentUser(null);
      }
    } else {
      setIsLoggedIn(false);
      setCurrentUser(null);
    }
  }, []);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("authToken");
      sessionStorage.removeItem("refreshToken");
      sessionStorage.removeItem("user");
    }
    setIsLoggedIn(false);
    setCurrentUser(null);
  };

  const totalItems = useSelector((state: RootState) =>
    state.cart.items.reduce((sum, item) => sum + item.quantity, 0),
  );
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // -------- Language --------
  // Detect language from URL
  const pathname =
    typeof window !== "undefined" ? window.location.pathname : "";
  const segments = pathname.split("/").filter(Boolean);
  const detectedLang = segments[1] || "en";

  // Initial language state
  const [activeLang, setActiveLang] = useState<Language>(() => {
    return languages.find((l) => l.code === detectedLang) || languages[0];
  });

  // Update DOM when URL language changes
  useEffect(() => {
    const lang = languages.find((l) => l.code === detectedLang);
    if (lang) {
      setActiveLang(lang);
      document.documentElement.lang = lang.code;
      document.documentElement.dir = lang.dir;
    }
  }, [detectedLang]);

  // Change language function
  const changeLanguage = (newCode: string) => {
    const lang = languages.find((l) => l.code === newCode);
    if (!lang) return;

    setActiveLang(lang);
    setCookie("NEXT_LOCALE", lang.code, {
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });

    // Replace only the language part of the URL
    const seg = [...segments];
    seg[1] = newCode;

    router.push("/" + seg.join("/"));
    document.documentElement.lang = lang.code;
    document.documentElement.dir = lang.dir;
    router.refresh();
  };

  const languageContent = (
    <div className="flex flex-col space-y-2">
      {languages.map((l) => (
        <button
          key={l.code}
          className={`text-left p-2 rounded-lg transition w-full ${
            l.code === activeLang.code
              ? "bg-[#0B5D4E] text-[#E8F4F1] font-bold"
              : "hover:bg-[#FFF9EE] text-gray-800"
          }`}
          onClick={() => changeLanguage(l.code)}
        >
          {l.flag} {l.name}
        </button>
      ))}
    </div>
  );

  // -------- Location --------

  const [loading, setLoading] = useState(false);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setCurrentAddress("Geolocation not supported");
      return;
    }

    setLoading(true);
    setCurrentAddress("Fetching current location...");

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const apiKey = "958d98442a434df9bcf5638fddd9088a";

        try {
          const res = await fetch(
            `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}`,
          );

          const data = await res.json();

          if (data.results && data.results.length) {
            const address = data.results[0].components;

            const locationDetails = {
              city: address.city || address.town || address.village,
              continent: "Asia",
              country: address.country,
              country_code: address.country_code,
              county: address.county,
              municipality: address.municipality,
              neighbourhood: address.neighbourhood,
              postcode: address.postcode,
              road: address.road,
              state: address.state,
              state_code: address.state_code,
              state_district: address.state_district,
              town: address.town,
            };

            console.log(locationDetails, "locationDetails");
            setCurrentAddress(data.results[0].formatted);
          }
        } catch (err) {
          setCurrentAddress("Error fetching address");
        }

        setLoading(false);
      },
      (err) => {
        setCurrentAddress("Location permission deny ho gayi");
        setLoading(false);
      },
    );
  };

  //   const getCurrentLocation = () => {
  //   if (!navigator.geolocation) {
  //     setCurrentAddress("Geolocation not supported");
  //     return;
  //   }

  //   navigator.geolocation.getCurrentPosition(
  //     (pos) => {
  //       const { latitude, longitude } = pos.coords;
  //       setCurrentAddress(`Lat: ${latitude}, Lng: ${longitude}`);
  //     },
  //     () => setCurrentAddress("Location permission denied")
  //   );
  // };

  // Content for the Location Dropdown
  const locationContent = (
    <div className="flex flex-col md:space-y-4 space-y-2">
      <h3 className="text-lg font-bold text-gray-800">{tLocation("title")}</h3>

      <button
        onClick={getCurrentLocation}
        // MODIFIED: Use theme green for primary action button
        className="w-full md:p-3 p-1 bg-[#0B5D4E] text-[#E8F4F1] font-bold text-sm rounded-lg hover:bg-[#084838] transition"
      >
        Use Current Location
      </button>

      <input
        type="text"
        placeholder={tLocation("placeholder")}
        // MODIFIED: Use theme green for focus ring/border
        className="w-full md:p-3 p-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B5D4E] focus:border-[#0B5D4E] transition"
      />

      <div className="text-sm text-gray-500 mt-2">
        Current:{" "}
        <span className="font-semibold text-gray-700 text-[12px]">
          {currentAddress}
        </span>
      </div>
    </div>
  );

  // Content for Profile Dropdown (Uses currentUser data)
  const profileContent = (
    <div className="flex flex-col space-y-1">
      <div className="py-2 px-3">
        <p className="text-base font-bold text-gray-900">
          {currentUser?.email || tProfile("placeholder.name")}
        </p>
        <p className="text-sm text-gray-500">
          {currentUser?.email || tProfile("placeholder.email")}
        </p>
      </div>
      <hr className="border-[#FFF9EE]" />
      <LocalizedLink
        href="/dashboard"
        // MODIFIED: Use green hover background
        className="flex items-center p-3 text-gray-700 hover:bg-[#FFF9EE] rounded-lg transition"
      >
        <BarChart className="w-5 h-5 mr-3" />
        {tProfile("link.dashboard")}
      </LocalizedLink>
      <Link
        href={`/${country.toLowerCase()}/${language?.toLowerCase()}/account-settings`}
        // MODIFIED: Use green hover background
        className="flex items-center p-3 text-gray-700 hover:bg-[#FFF9EE] rounded-lg transition"
      >
        <User className="w-5 h-5 mr-3" />
        {tProfile("link.accountSettings")}
      </Link>
      <Link
        href={`/myorders`}
        // MODIFIED: Use green hover background
        className="flex items-center p-3 text-gray-700 hover:bg-[#FFF9EE] rounded-lg transition"
      >
        <ShoppingBag className="w-5 h-5 mr-3" />
        {tProfile("link.myOrders")}
      </Link>
      <hr className="border-[#FFF9EE]" />
      <button
        onClick={handleLogout}
        className="flex items-center p-3 text-red-600 font-semibold hover:bg-red-50 rounded-lg transition w-full text-left"
      >
        {tProfile("link.logout")}
      </button>
    </div>
  );

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 shadow-lg ">
        <div className="bg-[#0B5D4E] text-[#E8F4F1] text-sm py-2 md:px-4 shadow-md px-5 ">
          <div className="max-w-7xl mx-auto flex justify-between items-center h-10">
            <Link href="/home" className="flex items-center">
              <Image
                src={activeLang.code === "ar" ? arabicLogo : image}
                alt="Logo"
                width={250}
                height={150}
                className="object-contain"
                priority
              />
            </Link>
            <div className="flex items-center space-x-2 text-xs md:text-sm  text-[12px]">
              <Link
                href="/partner"
                className="hidden sm:block py-1 px-2 border border-[#E8F4F1] hover:bg-[#084838] transition duration-150 rounded-md shrink-0"
              >
                {tHeader("topBar.partnerSignup")}
              </Link>
              <Link
                href="/home"
                className="hidden sm:block py-1 px-2 border border-[#E8F4F1] hover:bg-[#084838] transition duration-150 rounded-md shrink-0"
              >
                {tHeader("topBar.businessSignup")}
              </Link>
              <div className="md:hidden lg:hidden">
                <Dropdown
                  label={activeLang.code.toUpperCase()}
                  icon={Globe}
                  content={languageContent}
                />
              </div>
            </div>
          </div>
        </div>
        <nav className="bg-[#E8F4F1] shadow-xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
            <div className="flex justify-between items-center h-12 space-x-2">
              <div className="flex items-start space-x-2 lg:space-x-12 w-full lg:w-[360px]">
                <Dropdown
                  label={currentAddress}
                  icon={MapPin}
                  content={locationContent}
                  isLocation={true}
                />
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
                {!isLoggedIn ? (
                  <>
                    <Link
                      href={`/${country?.toLocaleLowerCase()}/${language?.toLocaleLowerCase()}/login`}
                      className="hidden sm:block px-4 py-2 border border-[#0B5D4E] text-[#0B5D4E] font-bold rounded-lg hover:bg-[#FFF9EE] transition text-sm"
                    >
                      {tHeader("auth.login")}
                    </Link>
                    <Link
                      href={`/${country?.toLocaleLowerCase()}/${language?.toLocaleLowerCase()}/register`}
                      className="hidden sm:block px-4 py-2 bg-[#0B5D4E] text-[#E8F4F1] font-bold rounded-lg hover:bg-[#084838] transition text-sm"
                    >
                      {tHeader("auth.signup")}
                    </Link>
                  </>
                ) : (
                  <ProfileDropdown profileContent={profileContent} />
                )}
                {/* <ProfileDropdown profileContent={profileContent} /> */}

                {/* Language Dropdown (Kept it small) */}
                <div className="hidden sm:block">
                  <Dropdown
                    label={activeLang.code.toUpperCase()}
                    icon={Globe}
                    content={languageContent}
                  />
                </div>

                <button
                  onClick={() => setIsDrawerOpen(true)}
                  className="relative hidden sm:block  p-3 bg-[#0B5D4E] rounded-full hover:bg-[#084838] transition duration-150 focus:outline-none focus:ring-2 focus:ring-[#0B5D4E]"
                  aria-label="Cart"
                >
                  <FiShoppingBag className="w-6 h-6 text-[#E8F4F1]" />
                  {totalItems > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center h-5 w-5 text-xs font-bold leading-none text-[#E8F4F1] transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
                      {totalItems > 9 ? "9+" : totalItems}
                    </span>
                  )}
                </button>

                {/* Drawers / Modals */}
                <CartDrawer
                  isOpen={isDrawerOpen}
                  onClose={() => setIsDrawerOpen(false)}
                />
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* Modals */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        mode={authMode}
        switchMode={(mode) => setAuthMode(mode)}
        onLoginSuccess={checkAuthStatus}
      />
    </>
  );
};

export default IFDPHeader;
