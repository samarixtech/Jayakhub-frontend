"use client";

import Link from "next/link";
import { C } from "./constants";

export function Features() {
  const feats = [
    { icon: "🕌", title: "Ramadan Operations Mode", desc: "Automatic Suhoor delivery 2-5 AM. Pre-scheduled Iftar orders. Auto-pause during prayer times." },
    { icon: "🇮🇶", title: "Arabic + Kurdish Native", desc: "Full Sorani + Kurmanji + Arabic + English. RTL/LTR handled correctly." },
    { icon: "💵", title: "Iraqi Payments", desc: "Qi Card, ZainCash, Asia Hawala, COD — all supported from Day 1." },
    { icon: "📍", title: "Landmark Addresses", desc: '"Near the white mosque." "Behind the Karrada bridge." Iraqi addressing as it actually works.' },
    { icon: "⚡", title: "Power Outage Handling", desc: "Offline mode for drivers and restaurants. Generator status. SMS fallback when internet fails." },
    { icon: "📊", title: "Restaurant Coach", desc: "Plain-Arabic insights: peak hours, top items, customer patterns, recommendations." },
  ];
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
