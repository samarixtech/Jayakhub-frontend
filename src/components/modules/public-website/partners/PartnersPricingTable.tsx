"use client";

import { Check, X } from "lucide-react";

export interface PartnersPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  billingCycle?: string | null;
  features: string[];
  freeTrialDays?: number | null;
}

interface PartnersPricingTableProps {
  plans: PartnersPlan[];
  noPlansText: string;
  planLabel: string;
  priceLabel: string;
  daysFreeLabel?: (days: number) => string;
}

function hasFeature(plan: PartnersPlan, feature: string) {
  const target = feature.trim().toLowerCase();
  return plan.features.some((f) => f.trim().toLowerCase() === target);
}

export default function PartnersPricingTable({
  plans,
  noPlansText,
  planLabel,
  priceLabel,
  daysFreeLabel,
}: PartnersPricingTableProps) {
  if (plans.length === 0) {
    return <p className="text-center text-white/50 py-8">{noPlansText}</p>;
  }

  // The plan with the most features becomes the master feature list — every
  // other plan is compared against it with a check/cross per feature.
  const richestPlan = plans.reduce((a, b) =>
    b.features.length > a.features.length ? b : a,
  );
  const allFeatures = richestPlan.features;

  return (
    <div className="relative rounded-2xl bg-white shadow-xl">
      <p className="sm:hidden text-center text-[11px] font-semibold text-[#0F2942]/50 pt-3 pb-1">
        ← Swipe to compare plans →
      </p>
      <div className="overflow-x-auto rounded-2xl [-webkit-overflow-scrolling:touch] snap-x snap-mandatory">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-[#FFF8E6]">
              <th className="min-w-[96px] sm:min-w-[140px] px-3 py-3 sm:px-5 sm:py-4 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#0F2942] whitespace-nowrap snap-start">
                {planLabel}
              </th>
              {plans.map((plan) => (
                <th
                  key={plan.id}
                  className="min-w-[128px] sm:min-w-[170px] px-3 py-3 sm:px-5 sm:py-4 text-[#0F2942] snap-start"
                >
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 font-bold text-xs sm:text-base">
                    <span className="whitespace-nowrap">{plan.name}</span>
                    {plan.freeTrialDays ? (
                      <span className="inline-block bg-amber-100 text-amber-700 text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full whitespace-nowrap">
                        {daysFreeLabel
                          ? daysFreeLabel(plan.freeTrialDays)
                          : `${plan.freeTrialDays}-day trial`}
                      </span>
                    ) : null}
                  </div>
                  <div className="mt-1 text-[10px] sm:text-xs font-semibold text-[#0F2942]/70 whitespace-nowrap">
                    {priceLabel}: ${plan.price} {plan.period}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {allFeatures.map((feature, idx) => {
              const rowBg = idx % 2 === 1 ? "#F9FAFB" : "#FFFFFF";
              return (
                <tr key={feature} className="border-t border-[#F1F5F9]">
                  <td
                    className="px-3 py-3 sm:px-5 sm:py-4 text-xs sm:text-sm font-bold text-[#0F2942] capitalize whitespace-nowrap snap-start"
                    style={{ backgroundColor: rowBg }}
                  >
                    {feature}
                  </td>
                  {plans.map((plan) => (
                    <td
                      key={plan.id}
                      className="px-2 py-3 sm:px-4 sm:py-4 text-center snap-start"
                      style={{ backgroundColor: rowBg }}
                    >
                      {hasFeature(plan, feature) ? (
                        <Check
                          aria-label="Included"
                          strokeWidth={3}
                          className="w-4 h-4 sm:w-5 sm:h-5 text-forest-green inline-block"
                        />
                      ) : (
                        <X
                          aria-label="Not included"
                          strokeWidth={3}
                          className="w-4 h-4 sm:w-5 sm:h-5 text-red-400 inline-block"
                        />
                      )}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
