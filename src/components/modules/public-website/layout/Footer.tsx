"use client";
import {
  MapPin,
  Phone,
  Mail,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import image2 from "../../../../../public/EngLogo (2).png";

const Footer = () => {
  const t = useTranslations("Footer");

  const socialLinks = [
    { icon: Facebook, href: "https://www.facebook.com", target: "_blank" },
    { icon: Instagram, href: "https://www.instagram.com", target: "_blank" },
    { icon: Twitter, href: "https://twitter.com", target: "_blank" },
    {
      icon: Linkedin,
      href: "https://www.linkedin.com/company",
      target: "_blank",
    },
  ];

  const companyLinks = [
    { label: t("company.about"), href: "/about" },
    { label: t("company.careers"), href: "/careers" },
    { label: t("company.blog"), href: "/blogs" },
    { label: t("company.press"), href: "/press" },
  ];

  const supportLinks = [
    { label: t("support.help_center"), href: "/help" },
    { label: t("support.safety"), href: "/safety" },
    { label: t("support.terms"), href: "/terms" },
    { label: t("support.privacy"), href: "/privacyPolicy" },
  ];

  const partnerLinks = [
    { label: t("partners.for_drivers"), href: "/drivers" },
    { label: t("partners.for_restaurants"), href: "/restaurants" },
    { label: t("partners.for_business"), href: "/business" },
  ];

  return (
    <footer className="bg-primary text-white py-10 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12 items-start">
          {/* BRAND COLUMN (Span 2 columns on large screens) */}
          <div className="col-span-2 lg:col-span-2 space-y-6">
            <div className="flex items-start">
              <Image
                src={image2}
                alt={t("brand.logo_alt")}
                width={200}
                className="object-contain h-auto"
              />
            </div>

            <p className="text-[#FFFFFF80] text-sm leading-relaxed max-w-sm">
              {t("brand.description_line1")}<br />
              {t("brand.description_line2")}
            </p>

            <div className="space-y-3 text-sm text-[#FFFFFF80]">
              <a href={`mailto:${t("brand.email")}`} className="flex items-center space-x-3 hover:text-white transition-colors">
                <Mail className="w-4 h-4 shrink-0" />
                <span>{t("brand.email")}</span>
              </a>
              <a href={`tel:${t("brand.phone")}`} className="flex items-center space-x-3 hover:text-white transition-colors">
                <Phone className="w-4 h-4 shrink-0" />
                <span>{t("brand.phone")}</span>
              </a>
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 shrink-0" />
                <span>{t("brand.location")}</span>
              </div>
            </div>

            <div className="flex space-x-3 pt-2">
              {socialLinks.map((social, index) => (
                <a // <--- Changed Link to a
                  key={index}
                  href={social.href}
                  target={social.target} // <--- Add this line
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <social.icon className="w-5 h-5 text-white" />
                </a>
              ))}
            </div>
          </div>

          {/* COMPANY COLUMN */}
          <div className="mt-4 col-span-1">
            <h3 className="font-bold text-lg mb-4 text-white">{t("company.title")}</h3>
            <ul className="space-y-3 text-sm text-[#FFFFFF80]">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* SUPPORT COLUMN */}
          <div className="mt-4 col-span-1">
            <h3 className="font-bold text-lg mb-4 text-white">{t("support.title")}</h3>
            <ul className="space-y-3 text-sm text-[#FFFFFF80]">
              {supportLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* PARTNERS COLUMN */}
          <div className="mt-4 col-span-1">
            <h3 className="font-bold text-lg mb-4 text-white">{t("partners.title")}</h3>
            <ul className="space-y-3 text-sm text-[#FFFFFF80]">
              {partnerLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center text-xs text-[#FFFFFF80]">
          <p className="text-[#FFFFFF80]">
            {t("bottom.copyright")}
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/terms" className="hover:text-white transition-colors">
              {t("bottom.terms")}
            </Link>
            <Link
              href="/privacyPolicy"
              className="hover:text-white transition-colors"
            >
              {t("bottom.privacy")}
            </Link>
            <Link
              href="/cookies"
              className="hover:text-white transition-colors"
            >
              {t("bottom.cookies")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
