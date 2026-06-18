"use client";

import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { useTranslations } from "next-intl";

export default function PrivacyTabNav() {
  const t = useTranslations("LegalPolicies");
  const pathname = usePathname();
  const params = useParams();
  const country = params?.country as string || "iq";
  const language = params?.language as string || "en";

  const base = `/${country}/${language}/privacy-policy`;

  const TABS = [
    { id: "privacy", label: t("tabs.privacy") },
    { id: "terms", label: t("tabs.terms") },
    { id: "refund", label: t("tabs.refund") },
    { id: "delivery", label: t("tabs.delivery") },
    { id: "deletion", label: t("tabs.deletion") },
  ];

  return (
    <div className="min-h-screen bg-[#F2F2ED] py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto">
        {/* Alert Banner */}
        <div className="bg-[#FFF8E1] border border-[#FFB300] rounded-lg p-4 mb-8 flex gap-3 shadow-sm">
          <span className="text-[#F57C00] font-bold">⚠️</span>
          <p className="text-sm text-[#5D4037] leading-relaxed">
            <strong>{t("alert.title")}</strong> {t("alert.description")}
          </p>
        </div>

        {/* Tabs */}
        <div className="border-b border-[#e5e0d8] mb-8 overflow-x-auto no-scrollbar">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {TABS.map((tab) => {
              const isActive = pathname === `${base}/${tab.id}` || pathname.endsWith(`/privacy-policy/${tab.id}`);
              return (
                <Link
                  key={tab.id}
                  href={`${base}/${tab.id}`}
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    isActive
                      ? "border-[#0B5D4E] text-[#0B5D4E]"
                      : "border-transparent text-[#6b6b6b] hover:text-[#0B5D4E] hover:border-[#0B5D4E]"
                  }`}
                >
                  {tab.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Content slot */}
        <div id="privacy-content" />
      </div>
    </div>
  );
}
