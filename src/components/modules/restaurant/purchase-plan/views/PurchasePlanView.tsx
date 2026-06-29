"use client";

import { Check, Loader2, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { usePurchasePlan } from "../hooks/usePurchasePlan";

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
          {plans.map((plan, index) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              featured={index === 0}
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
  featured,
  onBuy,
  isLoading,
  disabled,
}: {
  plan: import("@/app/actions/public/plans").RestaurantPlan;
  featured: boolean;
  onBuy: () => void;
  isLoading: boolean;
  disabled: boolean;
}) {
  const price = parseFloat(plan.monthlyPrice);
  const formattedPrice = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);

  const cycleLabel = plan.billingCycle === "monthly" ? "mo" : plan.billingCycle;

  return (
    <Card
      className={`relative flex flex-col rounded-3xl overflow-hidden border-0 transition-all duration-300 hover:-translate-y-1 ${featured
          ? "bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-2xl shadow-emerald-200/60"
          : "bg-white shadow-lg shadow-gray-100/80 hover:shadow-xl hover:shadow-gray-200/60"
        }`}
    >
      {featured && (
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
      )}

      <div className="p-7 flex flex-col gap-5 flex-1">
        {/* Top row */}
        <div className="flex items-center justify-between gap-3">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${featured ? "bg-white/20" : "bg-emerald-50"
              }`}
          >
            <Sparkles
              className={`w-4 h-4 ${featured ? "text-white" : "text-emerald-500"}`}
            />
          </div>
          <span
            className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${featured
                ? "bg-white/15 text-white/90"
                : "bg-emerald-50 text-emerald-600"
              }`}
          >
            {plan.billingCycle}
          </span>
        </div>

        {/* Plan name */}
        <div>
          <Typography
            className={`text-lg font-black leading-tight ${featured ? "text-white" : "text-gray-900"
              }`}
          >
            {plan.name}
          </Typography>
          {plan.description && (
            <p
              className={`text-xs mt-1.5 leading-relaxed ${featured ? "text-white/70" : "text-gray-400"
                }`}
            >
              {plan.description}
            </p>
          )}
        </div>

        {/* Price */}
        <div
          className={`flex items-end gap-1 border-y py-4 ${featured ? "border-white/15" : "border-gray-100"
            }`}
        >
          <span
            className={`text-4xl font-black tracking-tight leading-none ${featured ? "text-white" : "text-gray-900"
              }`}
          >
            {formattedPrice}
          </span>
          <span
            className={`text-sm font-semibold mb-0.5 ${featured ? "text-white/60" : "text-gray-400"
              }`}
          >
            /{cycleLabel}
          </span>
        </div>

        {/* Features */}
        {plan.features && plan.features.length > 0 && (
          <ul className="space-y-3 flex-1">
            {plan.features.map((feature, i) => (
              <li key={i} className="flex items-center gap-3">
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${featured ? "bg-white/20" : "bg-emerald-50"
                    }`}
                >
                  <Check
                    className={`w-3 h-3 stroke-[3px] ${featured ? "text-white" : "text-emerald-600"
                      }`}
                  />
                </span>
                <span
                  className={`text-xs font-medium ${featured ? "text-white/85" : "text-gray-600"
                    }`}
                >
                  {feature}
                </span>
              </li>
            ))}
          </ul>
        )}

        {/* Buy button */}
        <Button
          onClick={onBuy}
          disabled={disabled}
          className={`w-full h-12 rounded-2xl font-bold text-sm mt-auto flex items-center justify-center gap-2 transition-all ${featured
              ? "bg-white text-emerald-700 hover:bg-emerald-50 shadow-lg shadow-black/10"
              : "bg-emerald-bg text-white hover:bg-emerald-bg-hover shadow-md shadow-emerald-200"
            } disabled:opacity-60 disabled:cursor-not-allowed`}
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              Get Started
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </Button>
      </div>
    </Card>
  );
}
