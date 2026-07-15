"use client";

import { ArrowLeft, Check, Loader2 } from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { useCLC } from "@/context/CLCContext";
import { useSubscriptionPlans } from "../hooks/useSubscriptionPlans";
import { KEYWORD_LABELS } from "../hooks/useSubscription";
import type { RestaurantPlan } from "@/app/actions/public/plans";
import type { SubscriptionDetails } from "@/app/actions/restaurant/subscription";

function getPlanAction(
  plan: RestaurantPlan,
  subscription: SubscriptionDetails | null,
): "current" | "downgrade" | "upgrade" | "contact" {
  if (!subscription?.plan) return "upgrade";
  if (plan.id === subscription.plan.id) return "current";
  if (plan.type === "custom") return "contact";
  const planPrice = parseFloat(plan.monthlyPrice);
  const currentPrice = parseFloat(subscription.plan.monthlyPrice);
  return planPrice < currentPrice ? "downgrade" : "upgrade";
}

function PlanCard({
  plan,
  subscription,
  isCheckingOut,
  checkingOutId,
  onCheckout,
  formatPrice,
}: {
  plan: RestaurantPlan;
  subscription: SubscriptionDetails | null;
  isCheckingOut: boolean;
  checkingOutId: string | null;
  onCheckout: (id: string) => void;
  formatPrice: (amount: number | string) => string;
}) {
  const action = getPlanAction(plan, subscription);
  const isCurrent = action === "current";
  const isThisLoading = isCheckingOut && checkingOutId === plan.id;

  const cycleLabel = plan.billingCycle === "monthly" ? "mo" : plan.billingCycle;

  const keywordLabels = (plan.keywords ?? []).map(
    (k) => KEYWORD_LABELS[k] ?? k.replace(/_/g, " "),
  );
  const allFeatures = [
    ...(plan.features ?? []),
    ...keywordLabels.filter((l) => !(plan.features ?? []).includes(l)),
  ];

  const buttonLabel =
    action === "current"
      ? "Current Plan"
      : action === "contact"
        ? "Contact Support"
        : action === "downgrade"
          ? `Downgrade to ${plan.name}`
          : `Upgrade to ${plan.name}`;

  return (
    <Card
      className={`relative flex flex-col rounded-2xl overflow-hidden transition-all duration-300 ${
        isCurrent
          ? "border-2 border-[#346853] shadow-lg shadow-emerald-100/60"
          : "border border-gray-200 shadow-sm hover:shadow-md"
      }`}
    >
      {/* Current plan banner */}
      {isCurrent && (
        <div className="flex justify-center pt-2">
          <span className="text-[10px] font-bold uppercase tracking-widest bg-[#346853] text-white px-4 py-1 rounded-full">
            Current Plan
          </span>
        </div>
      )}

      <div className={`px-7 pb-7 ${isCurrent ? "pt-3" : "pt-7"} flex flex-col gap-5 flex-1`}>
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

        {/* Button */}
        <div className="mt-auto pt-2">
          {action === "current" ? (
            <Button
              disabled
              className="w-full h-11 rounded-xl font-semibold text-sm bg-[#346853] text-white opacity-60 cursor-default"
            >
              Current Plan
            </Button>
          ) : action === "contact" ? (
            <Button
              className="w-full h-11 rounded-xl font-semibold text-sm bg-[#346853] hover:bg-[#2a5542] text-white"
              onClick={() => window.open("mailto:support@ifdp.com")}
            >
              Contact Support
            </Button>
          ) : action === "downgrade" ? (
            <Button
              variant="outline"
              className="w-full h-11 rounded-xl font-semibold text-sm border-gray-300 text-gray-700 hover:bg-gray-50"
              disabled={isCheckingOut}
              onClick={() => onCheckout(plan.id)}
            >
              {isThisLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                buttonLabel
              )}
            </Button>
          ) : (
            <Button
              className="w-full h-11 rounded-xl font-semibold text-sm bg-[#346853] hover:bg-[#2a5542] text-white"
              disabled={isCheckingOut}
              onClick={() => onCheckout(plan.id)}
            >
              {isThisLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                buttonLabel
              )}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}

export default function SubscriptionPlansView() {
  const { formatPrice } = useCLC();
  const {
    plans,
    subscription,
    loading,
    isCheckingOut,
    checkingOutId,
    handleCheckout,
  } = useSubscriptionPlans();

  return (
    <div className="p-3 sm:p-6 space-y-6 min-h-screen bg-gray-50/50">
      {/* Back link */}
      <div>
        <Link
          href="/restaurant/subscription"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Subscription
        </Link>
      </div>

      {/* Header */}
      <div className="text-center max-w-lg mx-auto">
        <Typography
          variant="h2"
          className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight"
        >
          Manage Your Plan
        </Typography>
        <p className="text-gray-400 text-sm mt-2 leading-relaxed">
          Renew or Switch your subscription plan at any time.
        </p>
      </div>

      {/* Plans grid */}
      {loading ? (
        <div className="flex flex-col items-center gap-3 py-20 text-gray-400">
          <Loader2 className="w-7 h-7 animate-spin text-[#346853]" />
          <span className="text-sm font-medium">Loading plans...</span>
        </div>
      ) : plans.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-sm text-gray-400">
            No plans available at the moment.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              subscription={subscription}
              isCheckingOut={isCheckingOut}
              checkingOutId={checkingOutId}
              onCheckout={handleCheckout}
              formatPrice={formatPrice}
            />
          ))}
        </div>
      )}
    </div>
  );
}
