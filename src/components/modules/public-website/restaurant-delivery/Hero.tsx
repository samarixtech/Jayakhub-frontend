"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { C } from "./constants";

export function Hero() {
  const t = useTranslations('RestaurantDelivery.hero');
  const trustItems = t.raw('trust_items') as { value: string; label: string }[];
  const cardPlatforms = t.raw('card.platforms') as { name: string; cost: string }[];

  return (
    <section
      className="relative overflow-hidden py-[70px] px-8 pb-[100px]"
      style={{ background: C.green, color: C.white }}
    >
      <div
        className="pointer-events-none absolute"
        style={{
          top: "-10%", right: "-8%", width: 600, height: 600,
          background: "radial-gradient(circle,rgba(11,93,78,.18),transparent 60%)",
        }}
      />
      <div
        className="pointer-events-none absolute"
        style={{
          bottom: "-40%", left: "-10%", width: 700, height: 700,
          background: "radial-gradient(circle,rgba(11,93,78,.10),transparent 60%)",
        }}
      />

      <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-[1.3fr_1fr] gap-[60px] items-center relative z-10">
        <div className="animate-fadeUp">
          <div
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-semibold mb-7"
            style={{
              background: "rgba(11,93,78,.18)",
              border: "1px solid rgba(11,93,78,.4)",
              color: C.gold,
            }}
          >
            <span>🇮🇶</span> {t('badge')}
          </div>

          <h1 className="font-bold leading-[1.05] tracking-[-0.03em] mb-7" style={{ fontSize: "clamp(38px,5.5vw,64px)" }}>
            {t('title_p1')}
            <br />
            <span className="relative opacity-70">
              {t('title_crossout')}
              <span
                className="absolute rounded-[3px]"
                style={{
                  left: "-3%", right: "-3%", top: "50%",
                  height: 6, background: C.orange, transform: "rotate(-3deg)",
                }}
              />
            </span>{" "}
            <span style={{ color: C.orange }}>{t('title_highlight')}</span>
          </h1>

          <p className="text-[19px] opacity-[0.92] leading-[1.6] max-w-[580px] mb-9">
            {t.rich('subtitle', { strong: (chunks) => <strong>{chunks}</strong> })}
          </p>

          <div className="flex gap-[14px] flex-wrap mb-12">
            <Link
              href="/restaurant-register"
              className="inline-flex items-center gap-2 px-7 py-4 rounded-[10px] font-semibold text-white text-[16px] transition-all duration-200 hover:-translate-y-0.5"
              style={{ background: C.orange, boxShadow: "0 4px 14px rgba(11,93,78,.4)" }}
            >
              {t('cta')}
            </Link>
            <a
              href="#calculator"
              className="inline-flex items-center gap-2 px-7 py-4 rounded-[10px] font-semibold text-white text-[16px] transition-all duration-200"
              style={{ border: "2px solid rgba(255,255,255,.4)" }}
            >
              {t('secondary_cta')}
            </a>
          </div>

          <div className="flex gap-8 flex-wrap pt-8 border-t border-white/15">
            {trustItems.map(({ value, label }) => (
              <div key={label}>
                <div className="text-[28px] font-bold tracking-[-0.02em]" style={{ color: C.gold }}>{value}</div>
                <div className="text-[13px] opacity-80 mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>

        <div
          className="animate-fadeUp bg-white rounded-[20px] p-8 transition-transform duration-300 hover:rotate-0"
          style={{
            color: C.ink,
            boxShadow: "0 20px 60px rgba(0,0,0,.25)",
            transform: "rotate(1.5deg)",
          }}
        >
          <div className="text-[12px] font-semibold tracking-[0.1em] uppercase mb-1" style={{ color: C.orange }}>
            {t('card.label')}
          </div>
          <div className="text-[18px] font-semibold mb-5" style={{ color: C.navy }}>
            {t('card.details')}
          </div>
          {cardPlatforms.map(({ name, cost }) => (
            <div key={name} className="flex justify-between py-[11px] border-b text-[14px]" style={{ borderColor: C.line }}>
              <span style={{ color: C.muted }}>{name}</span>
              <span className="font-semibold" style={{ color: C.red }}>{cost}</span>
            </div>
          ))}
          <div className="flex justify-between items-baseline mt-[10px] pt-4 border-t-2" style={{ borderColor: C.green }}>
            <span className="text-[14px] font-semibold">{t('card.savings_label')}</span>
            <span className="text-[28px] font-bold tracking-[-0.02em]" style={{ color: C.green }}>{t('card.savings_value')}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
