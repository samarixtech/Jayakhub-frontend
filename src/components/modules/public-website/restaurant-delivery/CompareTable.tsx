"use client";

import Link from "next/link";
import { C } from "./constants";

export function CompareTable() {
  const rows = [
    { name: "Talabat", commission: "15-28%", sub: "$0", own: false, branded: false, kurdish: false, warn: true },
    { name: "Careem Now", commission: "18-25%", sub: "$0", own: false, branded: false, kurdish: false, warn: true },
    { name: "Lezzoo", commission: "~20%+", sub: "$0", own: false, branded: false, kurdish: true, warn: true },
    { name: "Toters", commission: "~20%+", sub: "$0", own: false, branded: false, kurdish: null, warn: true },
    { name: "Ziber", commission: "15-20%", sub: "$0", own: false, branded: false, kurdish: false, warn: true },
    { name: "Weevi (white-label)", commission: null, sub: "Custom pricing", own: true, branded: true, kurdish: false, warn: false },
    { name: "JayakHub", commission: null, sub: "$99-$349", own: true, branded: true, kurdish: true, warn: false, jayak: true },
  ];
  return (
    <section id="compare" className="py-[90px] px-8 scroll-mt-20" style={{ background: C.cream }}>
      <div className="max-w-[1280px] mx-auto">
        <div className="text-center mb-14">
          <span className="inline-block text-[13px] font-semibold tracking-[0.15em] uppercase mb-[14px]" style={{ color: C.orange }}>Side-by-Side</span>
          <h2 className="font-bold tracking-[-0.02em] mb-[18px]" style={{ fontSize: "clamp(30px,4vw,46px)", color: C.navy }}>What every Iraqi delivery platform charges</h2>
          <p className="text-[18px] leading-[1.65] max-w-[680px] mx-auto" style={{ color: C.muted }}>Real numbers from real platforms operating in Iraq today. Nothing hidden.</p>
        </div>
        <div className="rounded-[18px] overflow-hidden border" style={{ background: C.white, borderColor: C.line, boxShadow: "0 4px 24px rgba(0,0,0,.04)" }}>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse" style={{ minWidth: 800 }}>
              <thead>
                <tr>
                  {["Platform", "Commission", "Subscription", "You Own Customers?", "Branded App?", "Kurdish?"].map((h) => (
                    <th key={h} className="px-[22px] py-[18px] text-left text-[13px] font-semibold tracking-[0.06em] uppercase" style={{ background: C.navy, color: C.white }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr
                    key={r.name}
                    className="transition-colors"
                    style={
                      r.jayak
                        ? { background: "linear-gradient(90deg,rgba(44,95,45,.08),rgba(253,184,51,.08))" }
                        : undefined
                    }
                  >
                    <td className="px-[22px] py-[18px] font-bold border-b" style={{ borderColor: C.line, color: r.jayak ? C.green : C.ink, fontSize: r.jayak ? 17 : 15 }}>
                      {r.jayak && <span className="inline-block w-3 h-3 rounded-full mr-2.5 shrink-0" style={{ background: C.orange, boxShadow: `0 0 0 4px rgba(255,107,53,.2)` }} />}
                      {r.name}
                    </td>
                    <td className="px-[22px] py-[18px] text-[15px] border-b" style={{ borderColor: C.line }}>
                      {r.commission ? (
                        <span className="inline-block px-[10px] py-1 rounded-[6px] text-[13px] font-semibold" style={{ background: "rgba(198,40,40,.1)", color: C.red }}>{r.commission}</span>
                      ) : (
                        <span className="inline-block px-[10px] py-1 rounded-[6px] text-[13px] font-semibold" style={{ background: "rgba(44,95,45,.12)", color: C.green }}>$0 — Never</span>
                      )}
                    </td>
                    <td className="px-[22px] py-[18px] text-[15px] border-b" style={{ borderColor: C.line }}>{r.sub}</td>
                    <td className="px-[22px] py-[18px] text-[15px] border-b font-semibold" style={{ borderColor: C.line, color: r.own ? C.green : C.red }}>{r.own ? "Yes" : "No"}</td>
                    <td className="px-[22px] py-[18px] text-[15px] border-b font-semibold" style={{ borderColor: C.line, color: r.branded ? C.green : C.red }}>{r.branded ? "Yes" : "No"}</td>
                    <td className="px-[22px] py-[18px] text-[15px] border-b font-semibold" style={{ borderColor: C.line, color: r.kurdish === true ? C.green : r.kurdish === false ? C.red : C.muted }}>
                      {r.kurdish === true ? (r.jayak ? "Yes (Sorani + Kurmanji)" : "Yes") : r.kurdish === false ? "No" : "Limited"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-[22px] py-[18px] text-[13px] leading-[1.6] border-t" style={{ background: C.creamWarm, color: C.muted, borderColor: C.line }}>
            <strong style={{ color: C.ink }}>Source notes:</strong> Talabat commission per public reports & MENA industry analyses; Careem Now historical commission tier disclosures; Lezzoo & Toters per Iraqi restaurant owner reports. Rates vary by tier, location, and promotional participation. Last reviewed May 2026.
          </div>
        </div>

      </div>
    </section>
  );
}
