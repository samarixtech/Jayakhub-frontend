/* eslint-disable react-hooks/immutability */
"use client";
import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { setCookie } from "cookies-next";
import { Globe, Check, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

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

const LanguageSwitcher = () => {
  const router = useRouter();
  const pathname = usePathname();

  const segments = pathname.split("/").filter(Boolean);
  const currentLangCode = segments[1] || "en";
  const activeLang =
    languages.find((l) => l.code === currentLangCode) || languages[0];

  const changeLanguage = (newCode: string) => {
    if (newCode === activeLang.code) return;
    const lang = languages.find((l) => l.code === newCode);
    if (!lang) return;

    setCookie("NEXT_LOCALE", lang.code, {
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });
    document.documentElement.lang = lang.code;
    document.documentElement.dir = lang.dir;

    const newSegments = [...segments];
    newSegments[1] = newCode;

    router.push("/" + newSegments.join("/"));
    router.refresh();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            variant="outline"
            className="bg-white border-none hover:bg-gray-50 text-gray-700 px-4 py-5 rounded-full gap-2 h-11"
          >
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-bg group-hover:rotate-12 transition-transform duration-300" />
              <span className="font-bold tracking-wide text-xs md:text-sm">
                {activeLang.code.toUpperCase()}
              </span>
            </div>
            <ChevronDown className="w-3 h-3 opacity-50 group-hover:opacity-100 group-data-[state=open]:rotate-180 transition-transform duration-300" />
          </Button>
        </motion.div>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-48 p-2 bg-white/95 backdrop-blur-xl border-[#E2E8F0] rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] animate-in fade-in zoom-in-95 duration-200"
      >
        <div className="px-2 py-1.5 mb-1 text-[10px] font-bold uppercase tracking-wider text-gray-400">
          Select Language
        </div>
        {languages.map((l) => (
          <DropdownMenuItem
            key={l.code}
            onClick={() => changeLanguage(l.code)}
            className={`
              relative flex items-center justify-between px-3 py-2.5 mb-1 cursor-pointer rounded-lg transition-all duration-200
              ${
                l.code === activeLang.code
                  ? "bg-emerald-bg/10 text-emerald-bg font-semibold"
                  : "hover:bg-gray-100 text-gray-600 font-medium"
              }
            `}
          >
            <div className="flex items-center gap-3">
              <span className="text-lg leading-none">{l.flag}</span>
              <span className="text-sm">{l.name}</span>
            </div>

            {l.code === activeLang.code && (
              <motion.div layoutId="activeCheck">
                <Check className="w-4 h-4 stroke-[3px]" />
              </motion.div>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
