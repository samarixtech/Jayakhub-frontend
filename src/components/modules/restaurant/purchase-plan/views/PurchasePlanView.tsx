"use client";

import { Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { usePurchasePlan } from "../hooks/usePurchasePlan";
import { KEYWORD_LABELS } from "@/components/modules/restaurant/subscription/hooks/useSubscription";
import type { RestaurantPlan } from "@/app/actions/public/plans";

export default function PurchasePlanView() {
  const { plans, loadingPlans, handleBuy, isCheckingOut, checkingOutId } =
    usePurchasePlan();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-emerald-50/30 flex flex-col items-center justify-center p-4 sm:p-8">
      {/* Header */}
      <div className="text-center mb-12 max-w-lg">
        <Typography
          variant="h2"
          className="text-3xl sm:text-4xl font-black text-gray-900 mb-3 tracking-tight"
        >
          Choose Your Plan
        </Typography>
        <Typography className="text-gray-400 text-sm sm:text-base leading-relaxed">
          Select a subscription to activate your restaurant and start accepting
          orders.
        </Typography>
      </div>

      {/* Plans */}
      {loadingPlans ? (
        <div className="flex flex-col items-center gap-3 text-gray-400">
          <Loader2 className="w-7 h-7 animate-spin text-emerald-500" />
          <span className="text-sm font-medium">Loading plans...</span>
        </div>
      ) : plans.length === 0 ? (
        <div className="text-center p-10">
          <Typography className="text-gray-400 text-sm">
            No plans available at the moment. Please try again later.
          </Typography>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
          {plans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              onBuy={() => handleBuy(plan.id)}
              isLoading={isCheckingOut && checkingOutId === plan.id}
              disabled={isCheckingOut}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function PlanCard({
  plan,
  onBuy,
  isLoading,
  disabled,
}: {
  plan: RestaurantPlan;
  onBuy: () => void;
  isLoading: boolean;
  disabled: boolean;
}) {
  const cycleLabel = plan.billingCycle === "monthly" ? "mo" : plan.billingCycle;

  const keywordLabels = (plan.keywords ?? []).map(
    (k) => KEYWORD_LABELS[k] ?? k.replace(/_/g, " "),
  );
  const allFeatures = [
    ...(plan.features ?? []),
    ...keywordLabels.filter((l) => !(plan.features ?? []).includes(l)),
  ];

  return (
    <Card className="relative flex flex-col rounded-2xl overflow-hidden transition-all duration-300 border-2 border-[#346853] shadow-sm hover:shadow-md">
      <div className="p-7 flex flex-col gap-5 flex-1">
        {/* Plan name */}
        <div>
          <Typography className="text-xl font-black text-gray-900">
            {plan.name}
          </Typography>
          {plan.description && (
            <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">
              {plan.description}
            </p>
          )}
        </div>

        {/* Price */}
        <div className="flex items-end gap-1">
          <span className="text-4xl font-black text-gray-900 leading-none">
            $ {Number(plan.monthlyPrice).toFixed(2)}
          </span>
          <span className="text-sm text-gray-400 font-semibold mb-0.5">
            /{cycleLabel}
          </span>
        </div>

        <div className="h-px bg-gray-100" />

        {/* Features */}
        <ul className="space-y-3 flex-1">
          {allFeatures.length > 0 ? (
            allFeatures.map((feature, i) => (
              <li key={i} className="flex items-center gap-3">
                <span className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 stroke-[3px] text-[#346853]" />
                </span>
                <span className="text-xs font-medium text-gray-600">
                  {feature}
                </span>
              </li>
            ))
          ) : (
            <li className="text-xs text-gray-400">No features listed</li>
          )}
        </ul>

        {/* Buy button */}
        <div className="mt-auto pt-2">
          <Button
            className="w-full h-11 rounded-xl font-semibold text-sm bg-[#346853] hover:bg-[#2a5542] text-white"
            disabled={disabled}
            onClick={onBuy}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              `Choose ${plan.name}`
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
}
