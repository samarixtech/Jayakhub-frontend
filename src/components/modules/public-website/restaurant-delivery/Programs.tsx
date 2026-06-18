"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { C } from "./constants";

export function Programs() {
  const t = useTranslations('RestaurantDelivery.programs');

  return (
    <section className="py-[90px] px-8" style={{ background: C.cream }}>
      <div className="max-w-[1280px] mx-auto">
        <div className="text-center mb-14">
          <span className="inline-block text-[13px] font-semibold tracking-[0.15em] uppercase mb-[14px]" style={{ color: C.orange }}>{t('badge')}</span>
          <h2 className="font-bold tracking-[-0.02em]" style={{ fontSize: "clamp(30px,4vw,46px)", color: C.navy }}>{t('title')}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
          {/* Founding 100 */}
          <div id="founding-100" className="relative overflow-hidden rounded-[20px] p-[38px] text-white" style={{ background: `linear-gradient(135deg,${C.green} 0%,${C.greenDeep} 100%)` }}>
            <div className="pointer-events-none absolute" style={{ top: "-30%", right: "-20%", width: 350, height: 350, background: "radial-gradient(circle,rgba(11,93,78,.18),transparent 60%)" }} />
            <span className="inline-block relative z-10 text-[12px] font-bold tracking-[0.05em] px-[14px] py-1.5 rounded-full mb-[18px]" style={{ background: C.gold, color: C.navy }}>{t('founding.badge')}</span>
            <h3 className="text-[28px] font-bold mb-3 tracking-[-0.02em] relative z-10">{t('founding.title')}</h3>
            <p className="text-[15px] opacity-[0.92] leading-[1.6] mb-[22px] relative z-10">{t('founding.desc')}</p>
            <div className="relative z-10 flex items-baseline gap-1.5 mb-[22px]">
              <span className="font-bold tracking-[-0.025em] leading-none" style={{ fontSize: 48, color: C.gold }}>{t('founding.price')}</span>
              <span className="text-[15px] opacity-85">{t('founding.period')}</span>
            </div>
            <ul className="list-none mb-[26px] relative z-10">
              {(t.raw('founding.features') as string[]).map((f) => (
                <li key={f} className="flex gap-2.5 items-start py-1.5 text-[14px] opacity-[0.95]">
                  <span className="font-bold shrink-0" style={{ color: C.gold }}>✓</span>{f}
                </li>
              ))}
            </ul>
            <Link href="/restaurant-register" className="inline-block relative z-10 bg-white font-semibold text-[14px] px-[22px] py-3 rounded-[8px] transition-colors duration-200 hover:bg-amber-300" style={{ color: C.ink }}>
              {t('founding.cta')}
            </Link>
          </div>

          {/* Multi-Business */}
          <div className="relative overflow-hidden rounded-[20px] p-[38px] text-white" style={{ background: "linear-gradient(135deg,#1B3A57 0%,#0d1f2f 100%)" }}>
            <div className="pointer-events-none absolute" style={{ top: "-30%", right: "-20%", width: 350, height: 350, background: "radial-gradient(circle,rgba(11,93,78,.18),transparent 60%)" }} />
            <span className="inline-block relative z-10 text-[12px] font-bold tracking-[0.05em] px-[14px] py-1.5 rounded-full mb-[18px]" style={{ background: C.gold, color: C.navy }}>{t('multi_business.badge')}</span>
            <h3 className="text-[28px] font-bold mb-3 tracking-[-0.02em] relative z-10">{t('multi_business.title')}</h3>
            <p className="text-[15px] opacity-[0.92] leading-[1.6] mb-[22px] relative z-10">{t('multi_business.desc')}</p>
            <div className="relative z-10 flex items-baseline gap-1.5 mb-[22px]">
              <span className="font-bold tracking-[-0.025em] leading-none" style={{ fontSize: 48, color: C.gold }}>{t('multi_business.price')}</span>
              <span className="text-[15px] opacity-85">{t('multi_business.period')}</span>
            </div>
            <ul className="list-none mb-[26px] relative z-10">
              {(t.raw('multi_business.features') as string[]).map((f) => (
                <li key={f} className="flex gap-2.5 items-start py-1.5 text-[14px] opacity-[0.95]">
                  <span className="font-bold shrink-0" style={{ color: C.gold }}>✓</span>{f}
                </li>
              ))}
            </ul>
            <Link href="/restaurant-register" className="inline-block relative z-10 bg-white font-semibold text-[14px] px-[22px] py-3 rounded-[8px] transition-colors duration-200 hover:bg-amber-300" style={{ color: C.ink }}>
              {t('multi_business.cta')}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
