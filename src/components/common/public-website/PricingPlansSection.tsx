"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { Check, type LucideIcon } from "lucide-react";

export interface PricingPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  billingCycle?: string | null;
  features: string[];
  numericPrice?: boolean;
}

interface PricingPlansSectionProps {
  badge: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  plans: PricingPlan[];
  noPlansText: string;
  planFallbackLabel: string;
  ctaLabel: (plan: PricingPlan) => React.ReactNode;
  ctaHref?: string;
  ArrowIcon: LucideIcon;
}

export default function PricingPlansSection({
  badge,
  title,
  description,
  plans,
  noPlansText,
  planFallbackLabel,
  ctaLabel,
  ctaHref = "/contact",
  ArrowIcon,
}: PricingPlansSectionProps) {
  const [activePlanIndex, setActivePlanIndex] = useState(0);
  const plansScrollRef = useRef<HTMLDivElement>(null);

  const handlePlansScroll = () => {
    const el = plansScrollRef.current;
    if (!el || !plans.length) return;
    const cardWidth = el.scrollWidth / plans.length;
    setActivePlanIndex(Math.round(el.scrollLeft / cardWidth));
  };

  return (
    <>
      <div className="text-center mb-16">
        <span className="inline-block bg-white/10 text-white/80 text-sm font-semibold px-4 py-2 rounded-full mb-6 border border-white/10">
          {badge}
        </span>
        <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
          {title}
        </h2>
        {description && (
          <p className="text-white/60 mx-auto whitespace-nowrap">
            {description}
          </p>
        )}
      </div>

      {plans.length === 0 ? (
        <p className="text-center text-white/50 py-8">{noPlansText}</p>
      ) : (
        <>
          <div
            ref={plansScrollRef}
            onScroll={handlePlansScroll}
            className="flex flex-wrap justify-center gap-5 pb-4"
          >
            {plans.map((plan, idx) => {
              const isLight = idx % 2 === 0;
              return (
                <div
                  key={plan.id}
                  className={`relative flex-none w-[calc(100%-8px)] sm:w-[calc(50%-10px)] lg:w-[calc(30%-14px)] flex flex-col rounded-2xl px-9 pb-9 pt-6 transition-transform duration-300 hover:-translate-y-1 ${
                    isLight
                      ? "bg-white shadow-[0_20px_60px_rgba(0,0,0,0.2)]"
                      : "bg-white/[0.07] border border-white/15"
                  }`}
                >
                  {/* billing cycle label */}
                  <p
                    className={`text-xs font-semibold uppercase tracking-widest mb-1 ${
                      isLight ? "text-primary/60" : "text-white/40"
                    }`}
                  >
                    {plan.billingCycle || planFallbackLabel}
                  </p>

                  {/* plan name */}
                  <h3
                    className={`text-3xl font-bold mb-5 capitalize leading-tight ${
                      isLight ? "text-foreground" : "text-white"
                    }`}
                  >
                    {plan.name}
                  </h3>

                  {/* price */}
                  <div
                    className={`flex items-end gap-1 mb-3 pb-3 border-b ${
                      isLight ? "border-gray-100" : "border-white/10"
                    }`}
                  >
                    {plan.numericPrice !== false && (
                      <span
                        className={`text-5xl font-extrabold leading-none ${
                          isLight ? "text-primary" : "text-white"
                        }`}
                      >
                        $
                      </span>
                    )}
                    <span
                      className={`text-5xl font-extrabold leading-none ${
                        isLight ? "text-primary" : "text-white"
                      }`}
                    >
                      {plan.price}
                    </span>
                    <span
                      className={`text-sm font-medium mb-1 ${
                        isLight ? "text-[#94A3B8]" : "text-white/50"
                      }`}
                    >
                      {plan.period}
                    </span>
                  </div>

                  {/* features */}
                  <ul className="space-y-3 mb-8 flex-1">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3">
                        <span
                          className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                            isLight ? "bg-primary/10" : "bg-white/10"
                          }`}
                        >
                          <Check
                            className={`w-3 h-3 ${isLight ? "text-primary" : "text-white"}`}
                          />
                        </span>
                        <span
                          className={`text-base capitalize ${
                            isLight ? "text-[#475569]" : "text-white/70"
                          }`}
                        >
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* cta */}
                  <Link
                    href={ctaHref}
                    className={`w-full py-4 rounded-xl font-semibold text-base flex justify-center items-center gap-2 transition-all mt-auto ${
                      isLight
                        ? "bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20"
                        : "bg-white/10 text-white hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    {ctaLabel(plan)}
                    <ArrowIcon className="w-4 h-4" />
                  </Link>
                </div>
              );
            })}
          </div>

          {/* progress bar */}
          {plans.length > 1 && (
            <div className="flex justify-center mt-6">
              <div className="w-24 h-1.5 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-all duration-300"
                  style={{
                    width: `${((activePlanIndex + 1) / plans.length) * 100}%`,
                  }}
                />
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}
