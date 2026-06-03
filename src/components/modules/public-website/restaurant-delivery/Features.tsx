"use client";

import { useTranslations } from "next-intl";

export function Features() {
  const t = useTranslations('RestaurantDelivery.features');
  const feats = t.raw('items') as { icon: string; title: string; desc: string }[];

  return (
    <section id="features" className="py-[90px] px-8 bg-white">
      <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {feats.map((f, i) => (
          <div key={i} className="p-6 border rounded-[16px] flex flex-col gap-3">
            <div className="text-3xl">{f.icon}</div>
            <h3 className="font-bold text-lg text-[#1B3A57]">{f.title}</h3>
            <p className="text-[#6b6b6b] text-sm leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>

    </section>
  );
}
