"use client";

import Link from "next/link";
import { C } from "./constants";

export function Programs() {
  return (
    <section className="py-[90px] px-8" style={{ background: C.cream }}>
      <div className="max-w-[1280px] mx-auto">
        <div className="text-center mb-14">
          <span className="inline-block text-[13px] font-semibold tracking-[0.15em] uppercase mb-[14px]" style={{ color: C.orange }}>Special Programs</span>
          <h2 className="font-bold tracking-[-0.02em]" style={{ fontSize: "clamp(30px,4vw,46px)", color: C.navy }}>Built for the way Iraq does business</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
          {/* Founding 100 */}
          <div id="founding-100" className="relative overflow-hidden rounded-[20px] p-[38px] text-white" style={{ background: `linear-gradient(135deg,${C.green} 0%,${C.greenDeep} 100%)` }}>
            <div className="pointer-events-none absolute" style={{ top: "-30%", right: "-20%", width: 350, height: 350, background: "radial-gradient(circle,rgba(253,184,51,.18),transparent 60%)" }} />
            <span className="inline-block relative z-10 text-[12px] font-bold tracking-[0.05em] px-[14px] py-1.5 rounded-full mb-[18px]" style={{ background: C.gold, color: C.navy }}>⚡ Limited — 100 Spots Per City</span>
            <h3 className="text-[28px] font-bold mb-3 tracking-[-0.02em] relative z-10">Founding 100</h3>
            <p className="text-[15px] opacity-[0.92] leading-[1.6] mb-[22px] relative z-10">First 100 restaurants in each Iraqi city lock in lifetime pricing. All Pro features included.</p>
            <div className="relative z-10 flex items-baseline gap-1.5 mb-[22px]">
              <span className="font-bold tracking-[-0.025em] leading-none" style={{ fontSize: 48, color: C.gold }}>$59</span>
              <span className="text-[15px] opacity-85">/month — for life</span>
            </div>
            <ul className="list-none mb-[26px] relative z-10">
              {["All Pro tier features included","Lifetime price lock — never goes up",'"Founding Member" badge',"Priority support forever"].map((f) => (
                <li key={f} className="flex gap-2.5 items-start py-1.5 text-[14px] opacity-[0.95]">
                  <span className="font-bold shrink-0" style={{ color: C.gold }}>✓</span>{f}
                </li>
              ))}
            </ul>
            <Link href="/restaurant-register" className="inline-block relative z-10 bg-white font-semibold text-[14px] px-[22px] py-3 rounded-[8px] transition-colors duration-200 hover:bg-amber-300" style={{ color: C.ink }}>
              Apply for Founding 100 →
            </Link>
          </div>

          {/* Multi-Business */}
          <div className="relative overflow-hidden rounded-[20px] p-[38px] text-white" style={{ background: "linear-gradient(135deg,#1B3A57 0%,#0d1f2f 100%)" }}>
            <div className="pointer-events-none absolute" style={{ top: "-30%", right: "-20%", width: 350, height: 350, background: "radial-gradient(circle,rgba(253,184,51,.18),transparent 60%)" }} />
            <span className="inline-block relative z-10 text-[12px] font-bold tracking-[0.05em] px-[14px] py-1.5 rounded-full mb-[18px]" style={{ background: C.gold, color: C.navy }}>UNIQUE TO JAYAKHUB</span>
            <h3 className="text-[28px] font-bold mb-3 tracking-[-0.02em] relative z-10">Multi-Business Tier</h3>
            <p className="text-[15px] opacity-[0.92] leading-[1.6] mb-[22px] relative z-10">Own a restaurant AND a grocery store? One login. Multiple businesses. One consolidated bill.</p>
            <div className="relative z-10 flex items-baseline gap-1.5 mb-[22px]">
              <span className="font-bold tracking-[-0.025em] leading-none" style={{ fontSize: 48, color: C.gold }}>$249</span>
              <span className="text-[15px] opacity-85">/month total</span>
            </div>
            <ul className="list-none mb-[26px] relative z-10">
              {["All Pro features for every business","Switch businesses in one tap","Consolidated billing & reporting","Shared driver network"].map((f) => (
                <li key={f} className="flex gap-2.5 items-start py-1.5 text-[14px] opacity-[0.95]">
                  <span className="font-bold shrink-0" style={{ color: C.gold }}>✓</span>{f}
                </li>
              ))}
            </ul>
            <Link href="/restaurant-register" className="inline-block relative z-10 bg-white font-semibold text-[14px] px-[22px] py-3 rounded-[8px] transition-colors duration-200 hover:bg-amber-300" style={{ color: C.ink }}>
              Learn More →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
