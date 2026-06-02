"use client";

import { useTranslations } from "next-intl";
import { C } from "./constants";

export function Mission() {
  const t = useTranslations('RestaurantDelivery.mission');
  return (
    <section
      className="py-[90px] px-8 relative overflow-hidden border-b"
      style={{ background: C.creamWarm, borderColor: C.line }}
    >
      <div
        className="pointer-events-none absolute font-serif font-bold opacity-[0.08] leading-none"
        style={{ top: -30, left: "5%", fontSize: 240, color: C.orange }}
      >
        "
      </div>
      <div className="max-w-[980px] mx-auto text-center relative">
        <p className="font-medium leading-[1.35] tracking-[-0.015em] mb-7" style={{ fontSize: "clamp(26px,3.5vw,40px)", color: C.navy }}>
          {t.rich('quote', { strong: (chunks) => <span className="font-semibold" style={{ color: C.green }}>{chunks}</span> })}
        </p>
        <div className="inline-flex items-center gap-[14px] text-[15px]" style={{ color: C.muted }}>
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-[20px]"
            style={{ background: `linear-gradient(135deg,${C.green},${C.orange})` }}
          >
            S
          </div>
          <div>
            <strong className="block font-bold" style={{ color: C.ink }}>{t('founder_name')}</strong>
            <div className="text-[13px] opacity-80">{t('founder_title')}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
