"use client";

import Link from "next/link";
import { C } from "./constants";

export function Pricing() {
  const plans = [
    {
      tier: "Starter", name: "For Small Restaurants", price: 99,
      desc: "Under 100 orders per month. Perfect for getting started.",
      features: ["Restaurant dashboard","Order management","Driver network access","Customer app listing","Email support","Next-day payouts"],
      featured: false,
    },
    {
      tier: "Pro", name: "For Established Restaurants", price: 199,
      desc: "100-400 orders/month. Your brand, customers, and data.",
      features: ["Everything in Starter","Branded customer app","Marketing tools & coupons","Push notifications","Restaurant Coach (Arabic)","Customer data export","WhatsApp support","Built-in loyalty program"],
      featured: true, badgeFeatures: ["Branded customer app"],
    },
    {
      tier: "Premium", name: "For Large Restaurants", price: 349,
      desc: "400+ orders/month. Full features, dedicated support.",
      features: ["Everything in Pro","Instant payouts (real-time)","Dedicated account manager","Priority support","AI recommendations","Multi-location support","Early access features","Email & SMS automation"],
      featured: false, badgeFeatures: ["Instant payouts (real-time)"],
    },
  ];
  return (
    <section id="pricing" className="py-[50px] px-8 scroll-mt-20" style={{ background: C.white }}>
      <div className="max-w-[1280px] mx-auto">
        <div className="text-center mb-14">
          <span className="inline-block text-[13px] font-semibold tracking-[0.15em] uppercase mb-[14px]" style={{ color: C.orange }}>Honest Pricing</span>
          <h2 className="font-bold tracking-[-0.02em] mb-[12px]" style={{ fontSize: "clamp(26px,3vw,38px)", color: C.navy }}>Flat fee. No commission. Forever.</h2>
          <p className="text-[16px] leading-[1.6] max-w-[680px] mx-auto" style={{ color: C.muted }}>
            One-time setup of $500. Then pick your monthly tier. $2 flat per delivery. Credit card fees pass through to the processor — we never take a cut of your sales.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {plans.map((p, i) => (
            <div
              key={p.tier}
              className="relative rounded-[16px] p-6 flex flex-col border-2 transition-all duration-300 hover:-translate-y-1.5"
              style={{
                background: p.featured ? `linear-gradient(180deg,#fff 0%,${C.creamWarm} 100%)` : C.cream,
                borderColor: p.featured ? C.orange : C.line,
                transform: p.featured ? "scale(1.04)" : undefined,
                boxShadow: p.featured ? "0 12px 32px rgba(255,107,53,.15)" : undefined,
                animationDelay: `${i * 0.1}s`,
              }}
            >
              {p.featured && (
                <div
                  className="absolute text-[12px] font-bold tracking-[0.05em] px-4 py-1.5 rounded-[20px] text-white whitespace-nowrap"
                  style={{ top: -14, left: "50%", transform: "translateX(-50%)", background: C.orange, boxShadow: "0 4px 12px rgba(255,107,53,.3)" }}
                >
                  MOST POPULAR
                </div>
              )}
              <div className="text-[12px] font-semibold tracking-[0.1em] uppercase mb-1" style={{ color: C.orange }}>{p.tier}</div>
              <h3 className="text-[18px] font-bold mb-[14px]" style={{ color: C.navy }}>{p.name}</h3>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-[20px] font-medium" style={{ color: C.muted }}>$</span>
                <span className="font-bold leading-none tracking-[-0.035em]" style={{ fontSize: 42, color: C.ink }}>{p.price}</span>
                <span className="text-[14px] ml-1" style={{ color: C.muted }}>/mo</span>
              </div>
              <p className="text-[13px] mb-[18px]" style={{ color: C.muted, minHeight: 38 }}>{p.desc}</p>
              <ul className="list-none mb-5 flex-grow">
                {p.features.map((f) => (
                  <li key={f} className={`flex gap-2 items-start py-1 text-[13px] ${p.badgeFeatures?.includes(f) ? "font-semibold" : ""}`} style={{ color: C.ink }}>
                    <span className="font-bold text-[14px] shrink-0" style={{ color: C.green }}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/restaurant-register"
                className="block text-center py-[10px] rounded-[8px] font-semibold text-[14px] transition-all duration-200"
                style={
                  p.featured
                    ? { background: C.orange, color: C.white, boxShadow: "0 2px 8px rgba(255,107,53,.3)" }
                    : { background: C.white, color: C.navy, border: `2px solid ${C.line}` }
                }
              >
                Choose {p.tier}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
