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
    { label: "About Us", href: "/about" },
    { label: "Careers", href: "/careers" },
    { label: "Blog", href: "/blogs" },
    { label: "Press", href: "/press" },
  ];

  const supportLinks = [
    { label: "Help Center", href: "/help" },
    { label: "Safety", href: "/safety" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Privacy Policy", href: "/privacyPolicy" },
  ];

  const partnerLinks = [
    { label: "For Drivers", href: "/drivers" },
    { label: "For Restaurants", href: "/restaurants" },
    { label: "For Business", href: "/business" },
  ];

  return (
    <footer className="bg-primary text-white py-10 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12 items-start">
          {/* BRAND COLUMN (Span 2 columns on large screens) */}
          <div className="col-span-2 lg:col-span-2 space-y-6">
            <div className="flex items-start">
              <Image
                src={image2}
                alt="Jayak Hub Logo"
                width={200}
                className="object-contain h-auto"
              />
            </div>

            <p className="text-[#FFFFFF80] text-sm leading-relaxed max-w-sm">
              Connecting you with the best restaurants in Iraq. Fast, reliable
              delivery right to your doorstep.
            </p>

            <div className="space-y-3 text-sm text-[#FFFFFF80]">
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4" />
                <span>info@jayakhub.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4" />
                <span>+1 (469) 422-5944</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4" />
                <span>Baghdad, Iraq</span>
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
            <h3 className="font-bold text-lg mb-4 text-white">Company</h3>
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
            <h3 className="font-bold text-lg mb-4 text-white">Support</h3>
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
            <h3 className="font-bold text-lg mb-4 text-white">Partners</h3>
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
            © 2026 Jayak Hub. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms
            </Link>
            <Link
              href="/privacyPolicy"
              className="hover:text-white transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/cookies"
              className="hover:text-white transition-colors"
            >
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
