"use client";

import Link from "next/link";

import { TopBarProps } from "@/components/modules/discovery/discovery.types";

const TopBar = ({ isScrolled }: TopBarProps) => {
  const links = [
    { label: "Our Business Website", href: "/home" },
    {
      label: "Sign up for a Restaurant Account",
      href: "/restaurant-register",
    },
    {
      label: "Sign up to be a business partner",
      href: "/partners",
    },
  ];

  return (
    <div
      className={`flex items-center justify-start md:justify-center bg-[#3C8C64] px-4 md:px-6 overflow-x-auto scrollbar-hide transition-all duration-300 h-12 md:h-10 ${
        isScrolled ? "-mt-12 md:-mt-10" : "mt-0"
      }`}
    >
      <div className="flex flex-row items-center gap-3 w-max md:w-auto pr-4 md:pr-0">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-[11px] font-bold text-white uppercase tracking-wide border border-white/50 rounded px-4 py-1.5 hover:bg-white/10 transition-colors whitespace-nowrap shrink-0"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TopBar;
