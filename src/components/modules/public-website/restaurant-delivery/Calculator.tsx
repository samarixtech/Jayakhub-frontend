"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { C } from "./constants";

export type Tier = "starter" | "pro" | "premium" | "founding";

export function fmt(n: number) {
  return "$" + Math.round(n).toLocaleString();
}

export function Calculator() {
  const t = useTranslations('RestaurantDelivery.calculator');
  const tiersData = t.raw('tiers') as { id: Tier; label: string; price: number; badge?: string; note: string }[];
  const platforms = t.raw('tool.platforms') as { name: string }[];

  const TIERS: { id: Tier; label: string; price: number; badge?: string; badgeStyle?: "gold" | "hot"; featured?: boolean; founding?: boolean; note: string }[] = tiersData.map((td: any) => ({
    ...td,
    badgeStyle: td.id === "pro" ? "gold" as const : td.id === "founding" ? "hot" as const : undefined,
    featured: td.id === "pro",
    founding: td.id === "founding",
  }));

  const [orders, setOrders] = useState(250);
  const [aov, setAov] = useState(30);
  const [restName, setRestName] = useState("");
  const [selectedTier, setSelectedTier] = useState<Tier>("pro");

  const rev = orders * aov;
  const talabat = rev * 0.28;
  const careem = rev * 0.22;
  const lezzoo = rev * 0.20;

  function tierCost(price: number) {
    return price + orders * 2;
  }

  const costs: Record<Tier, number> = {
    starter: tierCost(99),
    pro: tierCost(199),
    premium: tierCost(349),
    founding: tierCost(59),
  };

  const saves: Record<Tier, number> = {
    starter: talabat - costs.starter,
    pro: talabat - costs.pro,
    premium: talabat - costs.premium,
    founding: talabat - costs.founding,
  };

  const yearlyNotes: Record<string, string> = {};
  tiersData.forEach((td: any) => { yearlyNotes[td.id] = td.note; });

  return (
    <section
      id="calculator"
      className="py-[50px] px-8 relative overflow-hidden scroll-mt-20"
      style={{ background: C.navy, color: C.white }}
    >
      <div className="pointer-events-none absolute" style={{ top: "-20%", left: "-10%", width: 600, height: 600, background: `radial-gradient(circle,rgba(11,93,78,.3),transparent 60%)` }} />
      <div className="pointer-events-none absolute" style={{ bottom: "-30%", right: "-10%", width: 500, height: 500, background: `radial-gradient(circle,rgba(11,93,78,.15),transparent 60%)` }} />

      <div className="max-w-[1280px] mx-auto relative z-10">
        <div className="text-center mb-14">
          <span className="inline-block text-[13px] font-semibold tracking-[0.15em] uppercase mb-[14px]" style={{ color: C.gold }}>
            {t('badge')}
          </span>
          <h2 className="font-bold tracking-[-0.02em] mb-[18px]" style={{ fontSize: "clamp(30px,4vw,46px)", color: C.white }}>
            {t('title')}
          </h2>
          <p className="text-[18px] leading-[1.65] max-w-[680px] mx-auto" style={{ color: "rgba(255,255,255,.85)" }}>
            {t('subtitle')}
          </p>
        </div>

        {/* Tool box */}
        <div className="bg-white rounded-[24px] p-5 max-w-[850px] mx-auto" style={{ color: C.ink, boxShadow: "0 30px 80px rgba(0,0,0,.4)" }}>
          {/* Header */}
          <div className="flex flex-wrap gap-4 justify-between items-center pb-6 mb-7 border-b-2" style={{ borderColor: C.line }}>
            <div className="flex items-center gap-[14px]">
              <div className="w-12 h-12 rounded-[12px] flex items-center justify-center text-2xl" style={{ background: C.green, color: C.white }}>
                💰
              </div>
              <div>
                <h3 className="text-[22px] font-bold" style={{ color: C.navy }}>{t('tool.title')}</h3>
                <div className="text-[14px]" style={{ color: C.muted }}>{t('tool.subtitle')}</div>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => window.print()}
                className="px-[18px] py-[10px] rounded-[8px] text-[14px] font-semibold inline-flex items-center gap-1.5 border transition-colors duration-200 hover:bg-green-600 hover:text-white"
                style={{ background: C.cream, color: C.navy, borderColor: C.line }}
              >
                {t('tool.print')}
              </button>
              <button
                onClick={() => { setOrders(250); setAov(30); setRestName(""); }}
                className="px-[18px] py-[10px] rounded-[8px] text-[14px] font-semibold transition-colors duration-200 hover:text-red-600"
                style={{ color: C.muted }}
              >
                {t('tool.reset')}
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1.2fr] gap-4">
            {/* Inputs */}
            <div>
              <h4 className="text-[13px] font-bold tracking-[0.12em] uppercase mb-5" style={{ color: C.orange }}>{t('tool.restaurant_details')}</h4>

              {/* Name */}
              <div className="mb-4">
                <label className="block font-semibold text-[13px] mb-2" style={{ color: C.navy }}>{t('tool.name_label')}</label>
                <div className="flex items-baseline gap-3 rounded-[10px] border-2 px-[12px] py-[8px] transition-all focus-within:border-green-600 focus-within:bg-white" style={{ background: C.cream, borderColor: C.line }}>
                  <input
                    type="text"
                    value={restName}
                    onChange={(e) => setRestName(e.target.value)}
                    placeholder={t('tool.name_placeholder')}
                    className="flex-1 bg-transparent border-none outline-none font-[inherit] text-[17px] font-bold"
                    style={{ color: C.ink }}
                  />
                </div>
              </div>

              {/* Orders */}
              <div className="mb-4">
                <label className="block font-semibold text-[13px] mb-2" style={{ color: C.navy }}>{t('tool.orders_label')}</label>
                <div className="flex items-baseline gap-3 rounded-[10px] border-2 px-[12px] py-[8px] transition-all focus-within:border-green-600 focus-within:bg-white" style={{ background: C.cream, borderColor: C.line }}>
                  <input
                    type="number"
                    value={orders}
                    min={0}
                    max={5000}
                    onChange={(e) => setOrders(Math.max(0, Number(e.target.value) || 0))}
                    className="flex-1 bg-transparent border-none outline-none font-[inherit] text-[16px] font-bold min-w-0"
                    style={{ color: C.ink }}
                  />
                  <span className="text-[16px] font-semibold" style={{ color: C.muted }}>{t('tool.orders_suffix')}</span>
                </div>
                <input
                  type="range"
                  min={50} max={2000} step={50}
                  value={orders}
                  onChange={(e) => setOrders(Number(e.target.value))}
                  className="w-full mt-2.5 h-1.5 accent-green-700"
                />
              </div>

              {/* AOV */}
              <div className="mb-4">
                <label className="block font-semibold text-[13px] mb-2" style={{ color: C.navy }}>{t('tool.aov_label')}</label>
                <div className="flex items-baseline gap-3 rounded-[10px] border-2 px-[12px] py-[8px] transition-all focus-within:border-green-600 focus-within:bg-white" style={{ background: C.cream, borderColor: C.line }}>
                  <span className="text-[14px] font-semibold" style={{ color: C.muted }}>$</span>
                  <input
                    type="number"
                    value={aov}
                    min={0}
                    max={500}
                    onChange={(e) => setAov(Math.max(0, Number(e.target.value) || 0))}
                    className="flex-1 bg-transparent border-none outline-none font-[inherit] text-[16px] font-bold min-w-0"
                    style={{ color: C.ink }}
                  />
                  <span className="text-[16px] font-semibold" style={{ color: C.muted }}>{t('tool.aov_suffix')}</span>
                </div>
                <input
                  type="range"
                  min={5} max={100} step={1}
                  value={aov}
                  onChange={(e) => setAov(Number(e.target.value))}
                  className="w-full mt-2.5 h-1.5 accent-green-700"
                />
              </div>

              {/* Summary box */}
              <div className="rounded-[12px] p-[18px]" style={{ background: "linear-gradient(135deg,#E8F5E9,#FFF8E1)" }}>
                <div className="text-[12px] font-bold uppercase tracking-[0.08em] mb-1" style={{ color: C.muted }}>{t('tool.revenue_label')}</div>
                <div className="text-[26px] font-bold tracking-[-0.02em]" style={{ color: C.green }}>{fmt(rev)}</div>
              </div>
            </div>

            {/* Results */}
            <div
              className="rounded-[16px] p-7 relative overflow-hidden"
              style={{ background: `linear-gradient(135deg,${C.green} 0%,${C.greenDeep} 100%)`, color: C.white }}
            >
              <div className="pointer-events-none absolute" style={{ top: "-50%", right: "-20%", width: 350, height: 350, background: "radial-gradient(circle,rgba(11,93,78,.22),transparent 60%)" }} />
              <div className="relative z-10">
                <div className="text-[12px] font-bold tracking-[0.12em] uppercase mb-[18px]" style={{ color: C.gold }}>{t('tool.results_title')}</div>

                {[
                  { name: platforms[0]?.name || "Talabat (28%)", cost: talabat },
                  { name: platforms[1]?.name || "Careem Now (~22%)", cost: careem },
                  { name: platforms[2]?.name || "Lezzoo / Toters (~20%)", cost: lezzoo },
                ].map(({ name, cost }) => (
                  <div key={name} className="flex justify-between items-baseline py-3 border-b border-white/15">
                    <span className="text-[15px] opacity-90">{name}</span>
                    <span className="text-[22px] font-bold tracking-[-0.02em]" style={{ color: "#FFB199" }}>{fmt(cost)}</span>
                  </div>
                ))}

                <div className="mt-[18px] mb-3 text-[13px] font-bold tracking-[0.1em] uppercase" style={{ color: C.gold }}>
                  {t('tool.jayakub_title')}
                </div>

                {TIERS.map((tier) => {
                  const isSelected = selectedTier === tier.id;
                  return (
                    <div
                      key={tier.id}
                      onClick={() => setSelectedTier(tier.id)}
                      className="relative flex justify-between items-center px-4 py-[8px] rounded-[10px] mb-2 cursor-pointer transition-all duration-200 select-none"
                      style={{
                        background: isSelected
                          ? "linear-gradient(135deg,rgba(11,93,78,.3),rgba(11,93,78,.2))"
                          : tier.featured
                            ? "rgba(11,93,78,.18)"
                            : tier.founding
                              ? "rgba(11,93,78,.15)"
                              : "rgba(255,255,255,.08)",
                        border: isSelected
                          ? `2px solid ${C.gold}`
                          : tier.featured
                            ? `1.5px solid rgba(11,93,78,.5)`
                            : tier.founding
                              ? `1.5px solid rgba(11,93,78,.4)`
                              : "1px solid rgba(255,255,255,.1)",
                        boxShadow: isSelected ? `0 0 0 4px rgba(11,93,78,.15), 0 8px 24px rgba(0,0,0,.25)` : undefined,
                        transform: isSelected ? "scale(1.02)" : undefined,
                      }}
                    >
                      {isSelected && (
                        <span
                          className="absolute text-[10px] font-black tracking-[0.1em] px-[10px] py-[3px] rounded-full"
                          style={{ top: -10, right: 12, background: C.gold, color: C.navy, boxShadow: "0 2px 8px rgba(0,0,0,.25)" }}
                        >
                          {t('tool.selected_badge')}
                        </span>
                      )}

                      <div className="flex flex-col gap-[2px]">
                        <span className="text-[15px] font-bold text-white inline-flex items-center gap-2">
                          {tier.label}
                          {tier.badge && (
                            <span
                              className="text-[10px] font-bold tracking-[0.08em] px-2 py-[2px] rounded-full"
                              style={
                                tier.badgeStyle === "gold"
                                  ? { background: C.gold, color: C.navy }
                                  : { background: C.orange, color: C.white }
                              }
                            >
                              {tier.badge}
                            </span>
                          )}
                        </span>
                        <span className="text-[11px] font-semibold uppercase tracking-[0.05em] opacity-70">
                          ${tier.price}/mo{tier.founding ? " for life" : ""}
                        </span>
                      </div>

                      <div className="flex flex-col items-end gap-[2px]">
                        <span
                          className="font-bold tracking-[-0.02em] leading-none"
                          style={{
                            fontSize: isSelected ? 22 : 18,
                            color: isSelected ? C.gold : tier.featured ? C.gold : tier.founding ? "#FFE0B2" : C.white,
                          }}
                        >
                          {fmt(costs[tier.id])}
                        </span>
                        <span
                          className="text-[11px] font-bold tracking-[0.03em]"
                          style={{ color: isSelected ? C.gold : "#B7E4B7" }}
                        >
                          {saves[tier.id] > 0 ? `save ${fmt(saves[tier.id])}/mo` : ""}
                        </span>
                      </div>
                    </div>
                  );
                })}

                {/* Yearly */}
                <div className="mt-[18px] p-[12px] rounded-[12px] text-center" style={{ background: "rgba(0,0,0,.22)" }}>
                  <div className="text-[11px] opacity-90 mb-1 font-bold tracking-[0.1em] uppercase">
                    {t('yearly.label', { tier: TIERS.find((t) => t.id === selectedTier)?.label || '' })}
                  </div>
                  <div className="font-bold tracking-[-0.025em] leading-none" style={{ fontSize: "clamp(24px,2.5vw,32px)", color: C.gold }}>
                    {fmt(saves[selectedTier] * 12)}
                  </div>
                  <div className="text-[13px] opacity-85 mt-2">{yearlyNotes[selectedTier]}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
