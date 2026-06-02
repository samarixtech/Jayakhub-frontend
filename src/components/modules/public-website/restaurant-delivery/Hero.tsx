"use client";

import Link from "next/link";
import { C } from "./constants";

export function Hero() {
  return (
    <section
      className="relative overflow-hidden py-[70px] px-8 pb-[100px]"
      style={{ background: C.green, color: C.white }}
    >
      {/* Decorative blobs */}
      <div
        className="pointer-events-none absolute"
        style={{
          top: "-10%", right: "-8%", width: 600, height: 600,
          background: "radial-gradient(circle,rgba(253,184,51,.18),transparent 60%)",
        }}
      />
      <div
        className="pointer-events-none absolute"
        style={{
          bottom: "-40%", left: "-10%", width: 700, height: 700,
          background: "radial-gradient(circle,rgba(255,107,53,.14),transparent 60%)",
        }}
      />

      <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-[1.3fr_1fr] gap-[60px] items-center relative z-10">
        {/* Left */}
        <div className="animate-fadeUp">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-semibold mb-7"
            style={{
              background: "rgba(253,184,51,.18)",
              border: "1px solid rgba(253,184,51,.4)",
              color: C.gold,
            }}
          >
            <span>🇮🇶</span> Built in Iraq · Owned by Iraqis
          </div>

          <h1 className="font-bold leading-[1.05] tracking-[-0.03em] mb-7" style={{ fontSize: "clamp(38px,5.5vw,64px)" }}>
            Your restaurant&apos;s own delivery platform.
            <br />
            <span className="relative opacity-70">
              28% commission.
              <span
                className="absolute rounded-[3px]"
                style={{
                  left: "-3%", right: "-3%", top: "50%",
                  height: 6, background: C.orange, transform: "rotate(-3deg)",
                }}
              />
            </span>{" "}
            <span style={{ color: C.orange }}>$0.</span>
          </h1>

          <p className="text-[19px] opacity-[0.92] leading-[1.6] max-w-[580px] mb-9">
            Stop paying 18-28% commission to Talabat, Careem, Lezzoo, and Toters. Get your own branded ordering
            app, your own customer data, and your own future — for just{" "}
            <strong>$99/month</strong>. Flat fee. No commission. Ever.
          </p>

          <div className="flex gap-[14px] flex-wrap mb-12">
            <Link
              href="/restaurant-register"
              className="inline-flex items-center gap-2 px-7 py-4 rounded-[10px] font-semibold text-white text-[16px] transition-all duration-200 hover:-translate-y-0.5"
              style={{ background: C.orange, boxShadow: "0 4px 14px rgba(255,107,53,.4)" }}
            >
              Get Started →
            </Link>
            <a
              href="#calculator"
              className="inline-flex items-center gap-2 px-7 py-4 rounded-[10px] font-semibold text-white text-[16px] transition-all duration-200"
              style={{ border: "2px solid rgba(255,255,255,.4)" }}
            >
              Calculate My Savings
            </a>
          </div>

          {/* Trust numbers */}
          <div className="flex gap-8 flex-wrap pt-8 border-t border-white/15">
            {[
              { num: "$0", lbl: "Commission, ever" },
              { num: "$99", lbl: "Starting per month" },
              { num: "$2", lbl: "Flat per delivery" },
            ].map(({ num, lbl }) => (
              <div key={lbl}>
                <div className="text-[28px] font-bold tracking-[-0.02em]" style={{ color: C.gold }}>{num}</div>
                <div className="text-[13px] opacity-80 mt-1">{lbl}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Hero card */}
        <div
          className="animate-fadeUp bg-white rounded-[20px] p-8 transition-transform duration-300 hover:rotate-0"
          style={{
            color: C.ink,
            boxShadow: "0 20px 60px rgba(0,0,0,.25)",
            transform: "rotate(1.5deg)",
          }}
        >
          <div className="text-[12px] font-semibold tracking-[0.1em] uppercase mb-1" style={{ color: C.orange }}>
            Example: Medium Restaurant
          </div>
          <div className="text-[18px] font-semibold mb-5" style={{ color: C.navy }}>
            250 orders/month at $30 avg
          </div>
          {[
            { lbl: "Talabat (28% commission)", val: "$2,100/mo", bad: true },
            { lbl: "Careem Now (~22%)", val: "$1,650/mo", bad: true },
            { lbl: "JayakHub Pro", val: "$917/mo", bad: false },
          ].map(({ lbl, val, bad }) => (
            <div key={lbl} className="flex justify-between py-[11px] border-b text-[14px]" style={{ borderColor: C.line }}>
              <span style={{ color: C.muted }}>{lbl}</span>
              <span className="font-semibold" style={{ color: bad ? C.red : C.green }}>{val}</span>
            </div>
          ))}
          <div className="flex justify-between items-baseline mt-[10px] pt-4 border-t-2" style={{ borderColor: C.green }}>
            <span className="text-[14px] font-semibold">You save</span>
            <span className="text-[28px] font-bold tracking-[-0.02em]" style={{ color: C.green }}>$14,196/yr</span>
          </div>
        </div>
      </div>
    </section>
  );
}
