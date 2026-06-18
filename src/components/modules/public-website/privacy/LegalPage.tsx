"use client";

import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import PrivacyContent from "./PrivacyContent";

const TABS = [
  { id: "privacy", slug: "privacy-policy" },
  { id: "terms-and-conditions", slug: "terms-of-service" },
  { id: "refund", slug: "refund-policy" },
  { id: "delivery", slug: "delivery-policy" },
  { id: "deletion", slug: "account-deletion" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function LegalPage({ tab }: { tab: TabId }) {
  const t = useTranslations("LegalPolicies");
  const pathname = usePathname();
  const params = useParams();
  const country = (params?.country as string) || "iq";
  const language = (params?.language as string) || "en";

  const TAB_LABELS: Record<string, string> = {
    privacy: t("tabs.privacy"),
    "terms-and-conditions": t("tabs.terms"),
    refund: t("tabs.refund"),
    delivery: t("tabs.delivery"),
    deletion: t("tabs.deletion"),
  };

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

        {/* Tab Nav */}
        <div className="border-b border-[#e5e0d8] mb-8 overflow-x-auto no-scrollbar">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {TABS.map(({ id, slug }) => {
              const href = `/${country}/${language}/${slug}`;
              const isActive = pathname === href || pathname.endsWith(`/${slug}`);
              return (
                <Link
                  key={id}
                  href={href}
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    isActive
                      ? "border-[#0B5D4E] text-[#0B5D4E]"
                      : "border-transparent text-[#6b6b6b] hover:text-[#0B5D4E] hover:border-[#0B5D4E]"
                  }`}
                >
                  {TAB_LABELS[id]}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <PrivacyContent tab={tab} />
      </div>
    </div>
  );
}
