"use client";

import { useTranslations } from "next-intl";
import { C } from "./constants";

export function QuickLinks() {
  const t = useTranslations('RestaurantDelivery.quick_links');
  const items = t.raw('items') as { icon: string; title: string; desc: string; link: string; link_label: string }[];

  return (
    <section className="py-[90px] px-8 scroll-mt-20" style={{ background: C.white }}>
      <div className="max-w-[1280px] mx-auto">
        <div className="text-center mb-14">
          <span className="inline-block text-[13px] font-semibold tracking-[0.15em] uppercase mb-[14px]" style={{ color: C.orange }}>{t('badge')}</span>
          <h2 className="font-bold tracking-[-0.02em]" style={{ fontSize: "clamp(30px,4vw,46px)", color: C.navy }}>{t('title')}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
          {items.map(({ icon, title, desc, link, link_label }) => (
            <div
              key={title}
              className="relative overflow-hidden rounded-[18px] p-9 flex flex-col transition-all duration-300 border-2 border-transparent hover:-translate-y-1.5 group"
              style={{ background: C.cream }}
            >
              <div className="pointer-events-none absolute top-0 right-0 w-[140px] h-[140px]" style={{ background: "radial-gradient(circle,rgba(253,184,51,.15),transparent 70%)" }} />
              <div className="w-[52px] h-[52px] rounded-[12px] flex items-center justify-center text-[26px] mb-[22px] relative z-10" style={{ background: C.green }}>
                {icon}
              </div>
              <h3 className="text-[22px] font-bold mb-2.5" style={{ color: C.navy }}>{title}</h3>
              <p className="text-[14px] leading-[1.6] mb-[18px] flex-grow" style={{ color: C.muted }}>{desc}</p>
              <a href={link} className="font-semibold text-[14px] inline-flex items-center gap-1.5 group-hover:gap-3 transition-all" style={{ color: C.orange }}>
                {link_label} →
              </a>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
