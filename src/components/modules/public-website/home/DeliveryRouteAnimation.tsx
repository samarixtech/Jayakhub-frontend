"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import restaurantImg from "../../../../../public/restaurant.png";
import homeImg from "../../../../../public/home.png";
import riderImg from "../../../../../public/rider.png";

const CYCLE_MS = 7000;
const RESTAURANT_OFFSET = 40; // px left of the container's horizontal center
const HOME_OFFSET = 80; // px left of the container's right edge

const CONFETTI_COLORS = ["#8FE3C0", "#FE8C34", "#FFFFFF", "#FDE68A", "#60A5FA"];
const CONFETTI_PIECES = [
  { dx: -22, dy: -26, rot: -45 },
  { dx: -10, dy: -32, rot: 30 },
  { dx: 4, dy: -34, rot: -20 },
  { dx: 16, dy: -28, rot: 60 },
  { dx: 24, dy: -14, rot: -60 },
  { dx: -18, dy: -12, rot: 90 },
  { dx: 10, dy: -18, rot: 15 },
  { dx: -4, dy: -30, rot: -80 },
];

function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

// Bubble entrance/exit curve: returns { opacity, translateY, scale } for a
// popup that pops in at the start of its window and (optionally) fades out.
function bubbleState(local: number, fadeOut: boolean) {
  if (local < 0.18) {
    const l = local / 0.18;
    return { opacity: l, ty: 6 - l * 10, scale: 0.6 + l * 0.48 };
  }
  if (local < 0.32) {
    const l = (local - 0.18) / 0.14;
    return { opacity: 1, ty: -4 + l * 4, scale: 1.08 - l * 0.08 };
  }
  if (!fadeOut || local < 0.8) {
    return { opacity: 1, ty: 0, scale: 1 };
  }
  const l = (local - 0.8) / 0.2;
  return { opacity: 1 - l, ty: -l * 6, scale: 1 - l * 0.2 };
}

interface DeliveryRouteAnimationProps {
  /** Tailwind text-color class applied to the "Restaurant" / "Home" route labels. Defaults to white (for dark backgrounds) — pass e.g. "text-navy" when placing this on a light background. */
  labelColor?: string;
}

export default function DeliveryRouteAnimation({
  labelColor = "text-white",
}: DeliveryRouteAnimationProps) {
  const t = useTranslations("Home.delivery_route");
  const containerRef = useRef<HTMLDivElement>(null);
  const riderRef = useRef<HTMLDivElement>(null);
  const pickupRef = useRef<HTMLDivElement>(null);
  const deliveredRef = useRef<HTMLDivElement>(null);
  const confettiRefs = useRef<Array<HTMLSpanElement | null>>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let width = container.clientWidth;
    const ro = new ResizeObserver(() => {
      width = container.clientWidth;
    });
    ro.observe(container);

    const start = performance.now();
    let rafId: number;

    const tick = (now: number) => {
      const p = ((now - start) % CYCLE_MS) / CYCLE_MS;

      // ---- Rider position + opacity ----
      let x = 0;
      let riderOpacity = 1;
      const restaurantX = width / 2 - RESTAURANT_OFFSET;
      const homeX = width - HOME_OFFSET;

      if (p < 0.08) {
        riderOpacity = p / 0.08;
      } else if (p < 0.4) {
        x = easeInOut((p - 0.08) / 0.32) * restaurantX;
      } else if (p < 0.55) {
        x = restaurantX;
      } else if (p < 0.92) {
        x = restaurantX + easeInOut((p - 0.55) / 0.37) * (homeX - restaurantX);
      } else {
        x = homeX;
        riderOpacity = 1 - (p - 0.92) / 0.08;
      }

      if (riderRef.current) {
        riderRef.current.style.transform = `translateY(-50%) translateX(${x}px)`;
        riderRef.current.style.opacity = String(riderOpacity);
      }

      // ---- "Order Picked Up" bubble: visible ~0.34 - 0.60 ----
      if (pickupRef.current) {
        const win = { from: 0.34, to: 0.6 };
        if (p >= win.from && p < win.to) {
          const { opacity, ty, scale } = bubbleState((p - win.from) / (win.to - win.from), true);
          pickupRef.current.style.opacity = String(opacity);
          pickupRef.current.style.transform = `translate(-50%, ${ty}px) scale(${scale})`;
        } else {
          pickupRef.current.style.opacity = "0";
        }
      }

      // ---- "Delivered" bubble + confetti: visible ~0.90 - 1.0 ----
      const deliveredFrom = 0.9;
      if (p >= deliveredFrom) {
        const local = (p - deliveredFrom) / (1 - deliveredFrom);
        const { opacity, ty, scale } = bubbleState(local, false);
        if (deliveredRef.current) {
          deliveredRef.current.style.opacity = String(opacity);
          deliveredRef.current.style.transform = `translate(-50%, ${ty}px) scale(${scale})`;
        }
        const confettiLocal = Math.min(1, local / 0.6);
        confettiRefs.current.forEach((el, i) => {
          if (!el) return;
          const piece = CONFETTI_PIECES[i];
          const dx = piece.dx * confettiLocal;
          const dy = piece.dy * confettiLocal;
          const rot = piece.rot * confettiLocal;
          el.style.opacity = String(confettiLocal <= 0 ? 0 : 1 - confettiLocal * 0.8);
          el.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) rotate(${rot}deg) scale(${0.5 + confettiLocal * 0.5})`;
        });
      } else {
        if (deliveredRef.current) deliveredRef.current.style.opacity = "0";
        confettiRefs.current.forEach((el) => {
          if (el) el.style.opacity = "0";
        });
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[70px] sm:h-[90px] md:h-[100px] lg:h-[110px]"
    >
      {/* Straight dotted route */}
      <svg
        className="absolute inset-x-6 sm:inset-x-8 md:inset-x-10 top-1/2 -translate-y-1/2 w-[calc(100%-48px)] sm:w-[calc(100%-64px)] md:w-[calc(100%-80px)] h-6"
        viewBox="0 0 1000 24"
        preserveAspectRatio="none"
        fill="none"
      >
        <line
          x1="0"
          y1="12"
          x2="1000"
          y2="12"
          stroke="#8FE3C0"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray="2 16"
        />
      </svg>

      {/* Restaurant marker (pickup point, centered on the route) */}
      <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1 sm:gap-1.5 z-10">
        <div className="relative w-7 h-7 sm:w-9 sm:h-9 md:w-11 md:h-11 lg:w-12 lg:h-12">
          <Image src={restaurantImg} alt="Restaurant" fill className="object-contain" />
        </div>
        <span className={`text-[10px] sm:text-xs md:text-sm font-bold whitespace-nowrap ${labelColor}`}>
          {t("restaurant_label")}
        </span>
      </div>

      {/* Customer home marker (end) */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1 sm:gap-1.5 z-10">
        <div className="relative w-7 h-7 sm:w-9 sm:h-9 md:w-11 md:h-11 lg:w-12 lg:h-12">
          <Image src={homeImg} alt="Home" fill className="object-contain" />
        </div>
        <span className={`text-[10px] sm:text-xs md:text-sm font-bold whitespace-nowrap ${labelColor}`}>
          {t("customer_label")}
        </span>
      </div>

      {/* Animated rider: starts off, rides to the restaurant, pauses, then rides to home.
          The outer box is sized exactly to the rider icon (no shadow/bubbles inside its
          flow) so `top-1/2 -translate-y-1/2` centers the icon itself on the route line. */}
      <div
        ref={riderRef}
        className="absolute left-0 top-1/2 z-20 w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 drop-shadow-lg"
        style={{ opacity: 0, transform: "translateY(-50%)" }}
      >
        <Image src={riderImg} alt="Rider" fill className="object-contain" />

        {/* Grounded shadow, anchored just below the icon */}
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-0.5 w-3 sm:w-4 h-1 sm:h-1.5 bg-black/25 rounded-full blur-[2px]" />

        {/* "Order Picked Up" popup */}
        <div
          ref={pickupRef}
          className="absolute bottom-full left-1/2 mb-1 pointer-events-none"
          style={{ opacity: 0 }}
        >
          <span className="bg-white text-primary text-[9px] sm:text-[11px] md:text-xs font-bold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full shadow-lg whitespace-nowrap">
            {t("order_picked_up")}
          </span>
        </div>

        {/* "Delivered" popup + confetti */}
        <div
          ref={deliveredRef}
          className="absolute bottom-full left-1/2 mb-1 pointer-events-none"
          style={{ opacity: 0 }}
        >
          <span className="bg-white text-primary text-[9px] sm:text-[11px] md:text-xs font-bold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full shadow-lg whitespace-nowrap">
            {t("delivered")}
          </span>
          {CONFETTI_PIECES.map((piece, i) => (
            <span
              key={i}
              ref={(el) => {
                confettiRefs.current[i] = el;
              }}
              className="absolute top-0 left-1/2 w-[5px] h-[5px] rounded-[1px]"
              style={{ backgroundColor: CONFETTI_COLORS[i % CONFETTI_COLORS.length], opacity: 0 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
