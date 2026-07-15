import { usePathname } from "next/navigation";
import { setCookie } from "cookies-next";
import { Check, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import ReactCountryFlag from "react-country-flag";
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
  countryCode: string;
  dir: "ltr" | "rtl";
}

const languages: Language[] = [
  { code: "en", name: "EN", countryCode: "US", dir: "ltr" },
  { code: "ar", name: "AR", countryCode: "IQ", dir: "rtl" },
];

interface LanguageSwitcherProps {
  variant?: "default" | "sidebar" | "navbar";
  collapsed?: boolean;
  className?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const LanguageSwitcher = ({
  variant = "default",
  collapsed = false,
  className,
  open,
  onOpenChange,
}: LanguageSwitcherProps) => {
  const pathname = usePathname();

  const segments = pathname ? pathname.split("/").filter(Boolean) : [];
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

    const newSegments = [...segments];
    let targetPath: string;
    if (newSegments.length >= 2) {
      newSegments[1] = newCode;
      targetPath = "/" + newSegments.join("/");
    } else {
      targetPath = `/${activeLang.countryCode.toLowerCase()}/${newCode}/restaurants`;
    }

    // Full reload (not router.push/refresh) so the root layout's <html dir>
    // and NextIntlClientProvider locale are always re-rendered fresh on the
    // server. A soft navigation can reuse a cached client-side render of the
    // root layout in production, leaving RTL layout (sidebar, etc.) stuck on
    // the old direction until a manual refresh.
    window.location.href = targetPath;
  };

  const isSidebar = variant === "sidebar";
  const isNavbar = variant === "navbar";

  return (
    <DropdownMenu open={open} onOpenChange={onOpenChange}>
      <DropdownMenuTrigger asChild>
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`group ${isSidebar ? "w-full" : ""}`}
        >
          <Button
            variant="ghost"
            className={`
              ${
                isSidebar
                  ? "w-full justify-start hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sidebar-foreground/80 h-11 px-4"
                  : isNavbar
                    ? "flex h-auto w-full md:w-auto items-center justify-between gap-2 px-3 py-3 md:py-2 rounded-xl bg-[#E8F4F1]/10 md:bg-white text-[#E8F4F1] md:text-[#2C2C2C] hover:bg-[#E8F4F1]/20 md:hover:bg-[#0B5D4E] md:hover:text-white transition-all md:shadow-sm"
                    : "bg-none border-none hover:bg-white/10 text-white px-4 py-5 rounded-full gap-2 h-10"
              }
              ${collapsed ? "size-11! p-0! justify-center" : ""}
              ${className}
            `}
          >
            <div
              className={`flex items-center gap-2 ${collapsed ? "justify-center w-full" : ""}`}
            >
              <div
                className={`rounded-full overflow-hidden relative shrink-0 ${
                  isSidebar && collapsed
                    ? "w-6 h-6"
                    : isNavbar
                      ? "w-[30px] h-[30px]"
                      : "w-5 h-5"
                }`}
              >
                <ReactCountryFlag
                  countryCode={activeLang.countryCode}
                  svg
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    position: "absolute",
                    top: 0,
                    left: 0,
                  }}
                  title={activeLang.name}
                />
              </div>
              {!collapsed && (
                <span
                  className={`font-bold tracking-wide text-xs md:text-sm ${isNavbar ? "hidden md:block" : ""}`}
                >
                  {isSidebar ? activeLang.name : activeLang.name}
                </span>
              )}
            </div>
            {!collapsed && (
              <ChevronDown
                className={`w-3 h-3 transition-all duration-300 ${
                  isNavbar
                    ? "text-[#E8F4F1] md:text-[#0B5D4E] md:group-hover:text-white"
                    : "opacity-50 group-hover:opacity-100"
                } group-data-[state=open]:rotate-180 ${isSidebar ? "ms-auto" : ""}`}
              />
            )}
          </Button>
        </motion.div>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className={`w-48 p-2 ${
          isNavbar
            ? "bg-[#E8F4F1] text-[#2C2C2C] border-[#0B5D4E] shadow-xl"
            : "bg-white/95 backdrop-blur-xl border-[#E2E8F0] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)]"
        } rounded-2xl animate-in fade-in zoom-in-95 duration-200 z-60`}
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
                  ? "bg-emerald-bg/10 text-[#0B5D4E] font-semibold"
                  : isNavbar
                    ? "hover:bg-[#0B5D4E] hover:text-white text-[#2C2C2C] font-medium"
                    : "hover:bg-gray-100 text-gray-600 font-medium"
              }
            `}
          >
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full overflow-hidden relative">
                <ReactCountryFlag
                  countryCode={l.countryCode}
                  svg
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    position: "absolute",
                    top: 0,
                    left: 0,
                  }}
                  title={l.name}
                />
              </div>
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
