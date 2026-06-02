"use client";

import Link from "next/link";
import { C } from "./constants";

export function Mission() {
  return (
    <section
      className="py-[90px] px-8 relative overflow-hidden border-b"
      style={{ background: C.creamWarm, borderColor: C.line }}
    >
      <div
        className="pointer-events-none absolute font-serif font-bold opacity-[0.08] leading-none"
        style={{ top: -30, left: "5%", fontSize: 240, color: C.orange }}
      >
        "
      </div>
      <div className="max-w-[980px] mx-auto text-center relative">
        <p className="font-medium leading-[1.35] tracking-[-0.015em] mb-7" style={{ fontSize: "clamp(26px,3.5vw,40px)", color: C.navy }}>
          I'm not here to <span className="font-semibold" style={{ color: C.green }}>kill</span> small businesses.
          <br />
          I'm here to <span className="font-semibold" style={{ color: C.green }}>help them grow</span>.
        </p>
        <div className="inline-flex items-center gap-[14px] text-[15px]" style={{ color: C.muted }}>
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-[20px]"
            style={{ background: `linear-gradient(135deg,${C.green},${C.orange})` }}
          >
            S
          </div>
          <div>
            <strong className="block font-bold" style={{ color: C.ink }}>Sam</strong>
            <div className="text-[13px] opacity-80">Founder · JayakHub</div>
          </div>
        </div>


      </div>
    </section>
  );
}
