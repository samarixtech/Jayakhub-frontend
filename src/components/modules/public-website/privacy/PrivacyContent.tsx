"use client";

import { useTranslations } from "next-intl";

function SectionList({ items }: { items: string[] }) {
  return (
    <ul className="list-disc pl-5 mb-6 text-[15px] leading-relaxed text-[#1a1a1a] space-y-2">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}

export default function PrivacyContent({ tab }: { tab: string }) {
  const t = useTranslations("LegalPolicies");

  return (
    <div className="bg-white rounded-[16px] p-8 md:p-12 shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-[#e5e0d8]">
      {tab === "privacy" && (
        <>
          <h1 className="text-[28px] font-bold text-[#0f172a] mb-2">{t("privacy.title")}</h1>
          <p className="text-sm text-[#6b6b6b] mb-6">{t("privacy.effective_date")}</p>
          <p className="text-[15px] leading-relaxed text-[#1a1a1a] mb-6">{t("privacy.intro")}</p>
          {["s1","s2","s3","s4","s5","s6","s7","s8","s9"].map((s) => (
            <div key={s}>
              <h2 className="text-lg font-bold text-[#0f172a] mb-3">{t(`privacy.sections.${s}.title`)}</h2>
              {["s1","s2"].includes(s) ? (
                <SectionList items={t.raw(`privacy.sections.${s}.items`) as string[]} />
              ) : (
                <p className="text-[15px] leading-relaxed text-[#1a1a1a] mb-6">{t(`privacy.sections.${s}.content`)}</p>
              )}
            </div>
          ))}
        </>
      )}

      {tab === "terms-and-conditions" && (
        <>
          <h1 className="text-[28px] font-bold text-[#0f172a] mb-2">{t("terms.title")}</h1>
          <p className="text-sm text-[#6b6b6b] mb-6">{t("terms.effective_date")}</p>
          <p className="text-[15px] leading-relaxed text-[#1a1a1a] mb-6">{t("terms.intro")}</p>
          {["s1","s2","s3","s4","s5","s6","s7"].map((s) => (
            <div key={s}>
              <h2 className="text-lg font-bold text-[#0f172a] mb-3">{t(`terms.sections.${s}.title`)}</h2>
              {["s1","s2","s3"].includes(s) ? (
                <SectionList items={t.raw(`terms.sections.${s}.items`) as string[]} />
              ) : (
                <p className="text-[15px] leading-relaxed text-[#1a1a1a] mb-6">{t(`terms.sections.${s}.content`)}</p>
              )}
            </div>
          ))}
        </>
      )}

      {tab === "refund" && (
        <>
          <h1 className="text-[28px] font-bold text-[#0f172a] mb-2">{t("refund.title")}</h1>
          <p className="text-sm text-[#6b6b6b] mb-6">{t("refund.effective_date")}</p>
          {["s1","s2","s3","s4"].map((s) => (
            <div key={s}>
              <h2 className="text-lg font-bold text-[#0f172a] mb-3">{t(`refund.sections.${s}.title`)}</h2>
              <p className="text-[15px] leading-relaxed text-[#1a1a1a] mb-6">{t(`refund.sections.${s}.content`)}</p>
            </div>
          ))}
          <h2 className="text-lg font-bold text-[#0f172a] mb-3">{t("refund.sections.s5.title")}</h2>
          <SectionList items={t.raw("refund.sections.s5.items") as string[]} />
          <p className="text-[15px] leading-relaxed text-[#1a1a1a]">{t("refund.sections.s5.contact")}</p>
        </>
      )}

      {tab === "delivery" && (
        <>
          <h1 className="text-[28px] font-bold text-[#0f172a] mb-2">{t("delivery_policy.title")}</h1>
          <p className="text-sm text-[#6b6b6b] mb-6">{t("delivery_policy.effective_date")}</p>
          {["s1","s2","s3","s4"].map((s) => (
            <div key={s}>
              <h2 className="text-lg font-bold text-[#0f172a] mb-3">{t(`delivery_policy.sections.${s}.title`)}</h2>
              <p className="text-[15px] leading-relaxed text-[#1a1a1a] mb-6">{t(`delivery_policy.sections.${s}.content`)}</p>
            </div>
          ))}
        </>
      )}

      {tab === "deletion" && (
        <>
          <h1 className="text-[28px] font-bold text-[#0f172a] mb-2">{t("deletion.title")}</h1>
          <p className="text-sm text-[#6b6b6b] mb-6">{t("deletion.effective_date")}</p>
          <p className="text-[15px] leading-relaxed text-[#1a1a1a] mb-6">{t("deletion.intro")}</p>
          {["s1","s2","s3","s4","s5"].map((s) => (
            <div key={s}>
              <h2 className="text-lg font-bold text-[#0f172a] mb-3">{t(`deletion.sections.${s}.title`)}</h2>
              {s === "s4" ? (
                <SectionList items={t.raw("deletion.sections.s4.items") as string[]} />
              ) : (
                <p className="text-[15px] leading-relaxed text-[#1a1a1a] mb-6">{t(`deletion.sections.${s}.content`)}</p>
              )}
            </div>
          ))}
        </>
      )}
    </div>
  );
}
