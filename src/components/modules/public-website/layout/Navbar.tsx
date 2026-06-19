"use client";

import React, { useState, useCallback } from "react";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { useTranslations, useLocale } from "next-intl";
import LanguageSwitcher from "@/components/common/LanguageSwitcher";
import CountrySwitcher from "@/components/common/CountrySwitcher";
import image from "../../../../../public/ArbicLogo (2).png";
import image2 from "../../../../../public/EngLogo (2).png";

const Navbar: React.FC = () => {
  const t = useTranslations("Navbar");
  const localeFromNext = useLocale();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<"language" | "country" | null>(null);
  const handleCloseMobileMenu = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      setIsMobileMenuOpen(false);
      setIsClosing(false);
    }, 300);
  }, []);

  // --- Nav Items ---
  const navItems = [
    { label: t("home"), to: "/home" },
    { label: t("about"), to: "/about-us" },
    { label: t("services"), to: "/services" },
    { label: t("contact"), to: "/contact" },
    { label: t("newsroom"), to: "/newsroom" },
    { label: t("partners"), to: "/partners" },
  ];

  const isArabic = localeFromNext === "ar";

  return (
    <nav className="bg-[#0B5D4E] shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex items-center h-20">
          {/* Logo */}
          <Link href="/home" className="shrink-0">
            <Image
              src={isArabic ? image : image2}
              alt="Logo"
              width={270}
              className="w-32 md:w-[180px] h-auto"
            />
          </Link>

          {/* Desktop Nav Links — centered */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8 flex-1 justify-center">
            {navItems.map((item) => {
              const isActive = pathname.includes(item.to);
              return (
                <Link
                  key={item.to}
                  href={item.to}
                  className={`font-medium transition-colors duration-200 ${isActive ? "text-[#B6932F]" : "text-[#E8F4F1] hover:text-[#B6932F]"
                    }`}
                >
                  {item.label}
                </Link>
              )
            })}
          </div>

          {/* Desktop Switchers — pushed to end */}
          <div className="hidden md:flex items-center gap-3 shrink-0 ms-auto">
            <LanguageSwitcher
              variant="navbar"
              open={openDropdown === "language"}
              onOpenChange={(o) => setOpenDropdown(o ? "language" : null)}
            />
            <CountrySwitcher
              variant="navbar"
              open={openDropdown === "country"}
              onOpenChange={(o) => setOpenDropdown(o ? "country" : null)}
            />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden ms-auto">
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
              {navItems.map((item) => {
                const isActive = pathname.includes(item.to);
                return (
                  <Link
                    key={item.to}
                    href={item.to}
                    onClick={handleCloseMobileMenu}
                    className={`px-3 py-3 rounded-lg transition-colors text-base font-medium ${isActive ? "bg-[#E8F4F1]/10 text-[#B6932F]" : "hover:bg-[#E8F4F1]/10"
                      }`}
                  >
                    {item.label}
                  </Link>
                )
              })}

              <div className="border-t border-[#E8F4F1]/20 my-3"></div>

              {/* Mobile Language Selector */}
              <LanguageSwitcher variant="navbar" />

              {/* Mobile Country Selector */}
              <div className="mt-2">
                <CountrySwitcher variant="navbar" />
              </div>
            </div>
          </div>
        </>
      )}
      <style jsx>{`
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
