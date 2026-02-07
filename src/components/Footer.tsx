"use client";
import { Send, MapPin, Phone, MessageSquare } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

const primaryyellow = "#0B5D4E";
const secondaryyellow = "#2a6f97";
const tertiaryyellow = "#61a5c2";

const FooterLink = ({ href, children }: any) => (
  <a
    href={href}
    className="text-gray-400 hover:text-[#E8F4F1] transition-colors duration-200 block text-base mb-3"
  >
    {children}
  </a>
);

const FooterSection = ({ title, children }: any) => (
  <div>
    <h4 className="text-xl font-bold text-[#E8F4F1] mb-6 border-b border-[#E8F4F1]/10 pb-2">
      {title}
    </h4>
    <nav className="list-none mb-10">{children}</nav>
  </div>
);

const Footer = () => {
  const t = useTranslations("Footer");

  return (
    <footer
      className={`bg-[${primaryyellow}] text-[#E8F4F1] pt-16 pb-8 border-t border-[#0B5D4E]/20`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* GRID */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 border-b border-[#E8F4F1]/20 pb-12">
          {/* BRAND */}
          <div className="col-span-2 md:col-span-2 pr-8">
            <h3 className="text-3xl font-extrabold mb-4 flex items-center">
              <span className={`text-[${tertiaryyellow}] mr-2`}>
                {t("brand.accent")}
              </span>
              <span className="text-[#E8F4F1]">{t("brand.main")}</span>
            </h3>

            <p className="text-gray-300 text-lg mb-6 leading-relaxed">
              {t("brand.description")}
            </p>

            <div className="flex space-x-4">
              <a
                className={`p-3 rounded-full bg-[#E8F4F1]/10 hover:bg-[${tertiaryyellow}]`}
              >
                <Send className="w-5 h-5 text-[#E8F4F1]" />
              </a>

              <a
                className={`p-3 rounded-full bg-[#E8F4F1]/10 hover:bg-[${tertiaryyellow}]`}
              >
                <MapPin className="w-5 h-5 text-[#E8F4F1]" />
              </a>

              <a
                className={`p-3 rounded-full bg-[#E8F4F1]/10 hover:bg-[${tertiaryyellow}]`}
              >
                <Phone className="w-5 h-5 text-[#E8F4F1]" />
              </a>
            </div>
          </div>

          {/* QUICK LINKS */}
          <FooterSection title={t("quick_links.title")}>
            <FooterLink href="/about">{t("quick_links.about")}</FooterLink>
            <FooterLink href="/features">
              {t("quick_links.features")}
            </FooterLink>
            <FooterLink href="/privacyPolicy">
              {t("quick_links.privacy")}
            </FooterLink>
            <FooterLink href="/press">{t("quick_links.press")}</FooterLink>
          </FooterSection>

          {/* SOLUTIONS */}
          <FooterSection title={t("solutions.title")}>
            <FooterLink href="/enterprise">
              {t("solutions.enterprise")}
            </FooterLink>
            <FooterLink href="/partner-network">
              {t("solutions.partner")}
            </FooterLink>
            <FooterLink href="/api">{t("solutions.api")}</FooterLink>
            <FooterLink href="/logistics">
              {t("solutions.logistics")}
            </FooterLink>
          </FooterSection>

          {/* SUPPORT */}
          <FooterSection title={t("support.title")}>
            <div className="flex items-center mb-3">
              <Phone className={`w-5 h-5 text-[${tertiaryyellow}] mr-3`} />
              <span>
                <a href="tel:+1 (469) 422-5944" className="text-[#E8F4F1]">
                  {t("support.phone")}
                </a>
              </span>
            </div>

            <div className="flex items-center mb-3">
              <Send className={`w-5 h-5 text-[${tertiaryyellow}] mr-3`} />
              <span>
                <a href="mailto:jayakhub@info.com" className="text-[#E8F4F1]">
                  {t("support.email")}
                </a>
              </span>
            </div>

            <div className="mt-5">
              <Link
                href="/contact"
                className={`inline-flex items-center px-5 py-2 text-sm font-semibold rounded-full bg-[${secondaryyellow}] hover:bg-[${tertiaryyellow}]`}
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                {t("support.live_chat")}
              </Link>
            </div>
          </FooterSection>
        </div>

        {/* BOTTOM */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 text-sm text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} {t("bottom.copyright")}
          </p>

          <div className="flex space-x-6">
            <Link href="/privacyPolicy">{t("bottom.privacy")}</Link>
            <Link href="/terms">{t("bottom.terms")}</Link>
            <Link href="/cookies">{t("bottom.cookies")}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
