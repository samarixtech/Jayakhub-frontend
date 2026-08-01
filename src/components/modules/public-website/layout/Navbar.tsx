"use client";

import React, { useState, useCallback, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import LanguageSwitcher from "@/components/common/LanguageSwitcher";
import CountrySwitcher from "@/components/common/CountrySwitcher";
import image from "../../../../../public/ArbicLogo2.png";
import image2 from "../../../../../public/ENGLogo.png";

const Navbar: React.FC = () => {
  const t = useTranslations("Navbar");
  const localeFromNext = useLocale();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<
    "language" | "country" | null
  >(null);
  const handleCloseMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  // Let other floating UI (e.g. the AI chat bubble) know the mobile nav
  // drawer's open state so it can hide itself while the drawer is open.
  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("jayakhub:mobilenav", {
        detail: { open: isMobileMenuOpen },
      }),
    );
  }, [isMobileMenuOpen]);

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
    <>
    <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b border-navy/10 fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex items-center h-20">
          {/* Logo */}
          <Link href="/home" className="shrink-0">
            <Image
              src={isArabic ? image : image2}
              alt="Logo"
              width={270}
              className="w-39 md:w-[180px] h-auto"
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
                  className={`font-medium transition-colors duration-200 ${
                    isActive
                      ? "text-brand-orange"
                      : "text-navy/70 hover:text-brand-orange"
                  }`}
                >
                  {item.label}
                </Link>
              );
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
              className="text-navy/70 hover:text-brand-orange p-2"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
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
        .animate-fade-in {
          animation: fade-in 0.25s ease-out;
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
      `}</style>
    </nav>

    {/* Mobile Menu — rendered outside <nav> so the navbar's backdrop-blur
        doesn't become the containing block for these fixed-position elements
        (that reparenting is what made the menu appear squashed/hidden). */}
    <AnimatePresence>
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-[#2C2C2C]/50 z-40"
            onClick={handleCloseMobileMenu}
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed top-0 right-0 h-full w-[80%] max-w-[300px] bg-navy text-white/90 z-50 shadow-2xl overflow-y-auto"
          >
            <div className="flex justify-between items-center p-4 border-b border-white/20">
              <h2 className="text-lg font-semibold">{t("mobileMenuTitle")}</h2>
              <button
                onClick={handleCloseMobileMenu}
                className="p-2 rounded-lg hover:bg-white/10 transition"
              >
                <X className="w-6 h-6 text-white/90" />
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
                    className={`px-3 py-3 rounded-lg transition-colors text-base font-medium ${
                      isActive
                        ? "bg-white/10 text-secondary"
                        : "hover:bg-white/10"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}

              <div className="border-t border-white/20 my-3"></div>

              {/* Mobile Language Selector */}
              <LanguageSwitcher variant="navbar" />

              {/* Mobile Country Selector */}
              <div className="mt-2">
                <CountrySwitcher variant="navbar" />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
    </>
  );
};

export default Navbar;
