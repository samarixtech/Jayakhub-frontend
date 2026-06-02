"use client";

import Link from "next/link";
import { C } from "./constants";

export function HowItWorks() {
  const steps = [
    { n: 1, title: "Sign Up & Pay Setup", desc: "Pay $500 setup, pick your tier. Our team contacts you within 24 hours.", time: "Day 1 · 5 min" },
    { n: 2, title: "Upload Your Menu", desc: "Send menu photos and your logo. We build your catalog and branded customer app.", time: "Day 1-2" },
    { n: 3, title: "Get Your Branded App", desc: "Your branded app appears on Google Play & App Store. We submit it for you.", time: "Day 2-3" },
    { n: 4, title: "Start Receiving Orders", desc: "Orders come straight to your dashboard. Our drivers handle delivery. You keep every dinar.", time: "Day 3 · LIVE" },
  ];
  return (
    <section id="how" className="py-[90px] px-8 scroll-mt-20" style={{ background: C.white }}>
      <div className="max-w-[1280px] mx-auto">
        <div className="text-center mb-14">
          <span className="inline-block text-[13px] font-semibold tracking-[0.15em] uppercase mb-[14px]" style={{ color: C.orange }}>How It Works</span>
          <h2 className="font-bold tracking-[-0.02em] mb-[18px]" style={{ fontSize: "clamp(30px,4vw,46px)", color: C.navy }}>Live in 3 days. Truly.</h2>
          <p className="text-[18px] leading-[1.65] max-w-[680px] mx-auto" style={{ color: C.muted }}>From signup to first delivery in 72 hours. No installation. No complex training.</p>
        </div>
        <div className="max-w-[980px] mx-auto">
          {steps.map((s, i) => (
            <div
              key={s.n}
              className="grid grid-cols-[72px_1fr_auto] md:grid-cols-[72px_1fr_auto] gap-7 items-center p-8 rounded-[18px] mb-5 border transition-all duration-300 hover:border-orange-400 hover:translate-x-1"
              style={{ background: C.cream, borderColor: C.line, animationDelay: `${i * 0.1}s` }}
            >
              <div
                className="w-16 h-16 rounded-[16px] flex items-center justify-center text-[28px] font-bold text-white"
                style={{ background: `linear-gradient(135deg,${C.green},${C.greenDeep})`, boxShadow: "0 6px 16px rgba(44,95,45,.25)" }}
              >
                {s.n}
              </div>
              <div>
                <h3 className="text-[21px] font-bold mb-1.5" style={{ color: C.navy }}>{s.title}</h3>
                <p className="text-[15px] leading-[1.6]" style={{ color: C.muted }}>{s.desc}</p>
              </div>
              <div className="px-[14px] py-2 rounded-full text-[13px] font-bold whitespace-nowrap" style={{ background: C.greenLight, color: C.green }}>
                {s.time}
              </div>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}
