"use client";

import { useEffect, useState } from "react";
import {
  Check,
  ChevronRight,
  CalendarDays,
  Settings2,
  RotateCcw,
  Loader2,
  AlertTriangle,
  LogOut,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import Link from "next/link";
import { useCLC } from "@/context/CLCContext";
import { useSubscription } from "../hooks/useSubscription";
import { toggleAutoRenewAction, cancelSubscriptionAction } from "@/app/actions/restaurant/subscription";
import { getRestaurantStatusAction } from "@/app/actions/restaurant/status";

function formatHistoryDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function capitalize(str?: string) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function formatAmountInCurrency(amount: number | string, currencyCode?: string) {
  const num = Number(amount);
  if (isNaN(num)) return "—";
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: (currencyCode || "USD").toUpperCase(),
    }).format(num);
  } catch {
    return `${currencyCode ?? ""} ${num.toFixed(2)}`.trim();
  }
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function SubscriptionView() {
  const { formatPrice } = useCLC();
  const [autoRenew, setAutoRenew] = useState(false);
  const [togglingRenew, setTogglingRenew] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const {
    subscription,
    history,
    loading,
    loadingHistory,
    error,
    progressPercent,
    featureLabels,
    renewalDateFormatted,
    refetch,
  } = useSubscription();

  useEffect(() => {
    if (subscription) setAutoRenew(subscription.autoRenew ?? false);
  }, [subscription]);

  const handleAutoRenewToggle = async (value: boolean) => {
    setAutoRenew(value);
    setTogglingRenew(true);
    try {
      const res = await toggleAutoRenewAction(value);
      if (!res.success) {
        setAutoRenew(!value);
      } else {
        await refetch();
      }
    } catch {
      setAutoRenew(!value);
    } finally {
      setTogglingRenew(false);
    }
  };

  const handleCancelSubscription = async () => {
    setCancelling(true);
    try {
      const res = await cancelSubscriptionAction();
      if (!res.success) {
        toast.error(res.message || "Failed to cancel subscription");
        setCancelling(false);
        return;
      }
      toast.success("Subscription cancelled successfully");
      // /my-restaurant is the authoritative source for isCancel — refresh the
      // cookie from it so the dashboard lockdown (header/sidebar/overlay) picks
      // up the cancellation immediately.
      await getRestaurantStatusAction();
      setCancelDialogOpen(false);
      window.location.reload();
    } catch {
      toast.error("Failed to cancel subscription");
      setCancelling(false);
    }
  };

  const plan = subscription?.plan;
  const card = subscription?.paymentCard;
  const isActive = subscription?.status === "active" && !subscription?.isExpired;
  const isCancelledOrExpired =
    subscription?.status?.toLowerCase() === "cancelled" ||
    !!subscription?.isExpired;

  const paidDisplayAmount =
    subscription?.convertedPrice ?? subscription?.paidAmount;
  const paidDisplayCurrency =
    subscription?.convertedPrice != null
      ? subscription?.convertedCurrency
      : subscription?.paidCurrency;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3 text-gray-400">
          <Loader2 className="w-8 h-8 animate-spin text-[#346853]" />
          <p className="text-sm font-medium">Loading subscription...</p>
        </div>
      </div>
    );
  }

  if (error || !subscription) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-sm text-gray-400">{error ?? "No active subscription found."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-4 space-y-5 bg-gray-50/50 min-h-screen font-sans">

      {/* ── Plan Details ─────────────────────────────────────────────────── */}
      <Card className="bg-white border border-gray-100 shadow-sm rounded-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <Typography className="text-base font-semibold text-gray-900">Plan Details</Typography>
            <p className="text-xs text-gray-400 mt-0.5">Manage your subscription and usage</p>
          </div>
          <Badge
            className={`text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${isActive
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : "bg-red-50 text-red-600 border-red-200"
              }`}
          >
            ● Status: {capitalize(subscription.status)}
          </Badge>
        </div>

        {/* Three-column body */}
        <div className="grid grid-cols-1 sm:grid-cols-[0.8fr_1.4fr_0.8fr] divide-y sm:divide-y-0 sm:divide-x divide-gray-100 px-6 py-5 gap-y-5">
          {/* Current Plan */}
          <div className="sm:pr-6 flex flex-col gap-1.5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Current Plan</p>
            <p className="text-lg font-black text-gray-900">{plan?.name}</p>
            <div className="flex items-end gap-1 mt-0.5">
              <span className="text-2xl font-black text-[#346853]">
                {paidDisplayAmount != null
                  ? formatAmountInCurrency(paidDisplayAmount, paidDisplayCurrency)
                  : formatPrice(plan?.monthlyPrice ?? "0")}
              </span>
              <span className="text-xs text-gray-400 mb-0.5">/month</span>
            </div>
            <p className="text-xs text-gray-400">Billed {plan?.billingCycle ?? "monthly"}</p>
            {plan?.description && (
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">{plan.description}</p>
            )}
          </div>

          {/* Features */}
          <div className="sm:px-6 flex flex-col gap-1.5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Features</p>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2 mt-1">
              {featureLabels.length > 0 ? featureLabels.map((f, i) => (
                <li key={i} className="flex items-center gap-2 text-[13px] text-gray-600 font-medium">
                  <span className="w-4 h-4 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 text-[#346853] stroke-[3px]" />
                  </span>
                  {f}
                </li>
              )) : (
                <li className="text-xs text-gray-400 col-span-2">No features listed</li>
              )}
            </ul>
          </div>

          {/* Renewal */}
          <div className="sm:pl-6 flex flex-col gap-1.5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Renewal</p>
            <p className="text-lg font-black text-gray-900">
              {subscription.daysRemaining}{" "}
              <span className="text-sm font-semibold text-gray-500">days remaining</span>
            </p>
            {/* Progress bar */}
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mt-1">
              <div
                className="h-full bg-gradient-to-r from-[#346853] to-emerald-400 rounded-full transition-all"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              Renews automatically on{" "}
              <span className="font-semibold text-gray-600">{renewalDateFormatted}</span>
            </p>
          </div>
        </div>
      </Card>

      {/* ── Payment Method + Plan Actions ────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Primary Payment Method */}
        <Card className="bg-white border border-gray-100 shadow-sm rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <Typography className="text-base font-semibold text-gray-900">Primary Payment Method</Typography>
          </div>
          <div className="p-6 flex items-center justify-center">
            {card ? (
              <div className="w-full max-w-xs aspect-[1.586/1] rounded-2xl bg-gradient-to-br from-[#1a2e25] to-[#0d1a13] p-5 flex flex-col justify-between shadow-xl shadow-black/20 relative overflow-hidden">
                {/* Shimmer circles */}
                <div className="absolute -top-8 -right-8 w-36 h-36 rounded-full bg-white/5" />
                <div className="absolute -bottom-12 -left-6 w-44 h-44 rounded-full bg-white/5" />

                {/* Top row */}
                <div className="flex items-center justify-between relative z-10">
                  <div className="w-8 h-6 rounded-sm bg-gradient-to-br from-yellow-300 to-yellow-500 opacity-90" />
                  <span className="text-white text-lg font-black italic tracking-widest opacity-90">
                    {card.brand?.toUpperCase() ?? ""}
                  </span>
                </div>

                {/* Card number */}
                <div className="relative z-10">
                  <p className="text-white/50 text-[10px] font-semibold uppercase tracking-widest mb-1.5">Card Number</p>
                  <p className="text-white font-mono text-base tracking-[0.2em] font-semibold">
                    •••• •••• •••• {card.last4}
                  </p>
                </div>

                {/* Bottom row */}
                <div className="flex items-end justify-between relative z-10">
                  <div>
                    <p className="text-white/50 text-[9px] font-bold uppercase tracking-widest mb-0.5">Card Holder</p>
                    <p className="text-white text-xs font-bold uppercase tracking-wide">{card.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white/50 text-[9px] font-bold uppercase tracking-widest mb-0.5">Expires</p>
                    <p className="text-white text-xs font-bold">{card.expiry}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-sm text-gray-400">No payment card on file</p>
              </div>
            )}
          </div>
        </Card>

        {/* Plan Actions */}
        <Card className="bg-white border border-gray-100 shadow-sm rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <Typography className="text-base font-semibold text-gray-900">Plan Actions</Typography>
          </div>
          <div className="divide-y divide-gray-100">
            {/* Auto-Renewal */}
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                  <RotateCcw className="w-4 h-4 text-[#346853]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Auto-Renewal Status</p>
                  <p className="text-xs text-gray-400">
                    {autoRenew ? `Next billing: ${renewalDateFormatted}` : "Auto-renewal is disabled"}
                  </p>
                </div>
              </div>
              {togglingRenew ? (
                <Loader2 className="w-5 h-5 animate-spin text-[#346853]" />
              ) : (
                <Switch
                  checked={autoRenew}
                  onCheckedChange={handleAutoRenewToggle}
                  disabled={togglingRenew || isCancelledOrExpired}
                  className="data-[state=checked]:bg-[#346853] disabled:opacity-50"
                />
              )}
            </div>

            {/* Manage Plan */}
            <Link
              href="/restaurant/subscription/plans"
              className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                  <Settings2 className="w-4 h-4 text-[#346853]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Manage Plan</p>
                  <p className="text-xs text-gray-400">Change plan or limits</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />
            </Link>

            {/* Cancel — hidden once the subscription is already cancelled or expired */}
            {!isCancelledOrExpired && (
              <div className="p-3">
                <button
                  onClick={() => setCancelDialogOpen(true)}
                  className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl bg-red-50 hover:bg-red-100 transition-colors"
                >
                  <LogOut className="w-4 h-4 text-red-600" />
                  <span className="text-sm font-bold text-red-600">Cancel Subscription</span>
                </button>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* ── Cancel Confirmation Dialog ───────────────────────────────────── */}
      <Dialog open={cancelDialogOpen} onOpenChange={(open) => !cancelling && setCancelDialogOpen(open)}>
        <DialogContent>
          <DialogHeader>
            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center mb-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </div>
            <DialogTitle>Cancel Subscription</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel your subscription? Your dashboard access will be
              restricted to the Subscription page only until you resubscribe. This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCancelDialogOpen(false)}
              disabled={cancelling}
            >
              Keep Subscription
            </Button>
            <Button
              onClick={handleCancelSubscription}
              disabled={cancelling}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              {cancelling ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Cancelling...
                </>
              ) : (
                "Yes, Cancel Subscription"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Connected Cards ───────────────────────────────────────────────── */}
      {card && (
        <Card className="bg-white border border-gray-100 shadow-sm rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <Typography className="text-base font-semibold text-gray-900">Connected Cards</Typography>
          </div>
          <div className="divide-y divide-gray-100">
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-7 rounded bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0">
                  <span className="text-[10px] font-black text-gray-600 italic">
                    {card.brand?.toUpperCase() ?? ""}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {capitalize(card.brand)} ending in {card.last4}
                  </p>
                  <p className="text-xs text-gray-400">Expires {card.expiry}</p>
                </div>
              </div>
              <Badge className="bg-[#346853] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border-0">
                Primary
              </Badge>
            </div>
          </div>
        </Card>
      )}

      {/* ── Billing History ───────────────────────────────────────────────── */}
      <Card className="bg-white border border-gray-100 shadow-sm rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <Typography className="text-base font-semibold text-gray-900">Billing History</Typography>
            {!loadingHistory && (
              <p className="text-xs text-gray-400 mt-0.5">{history.length} record{history.length !== 1 ? "s" : ""}</p>
            )}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                {["Subscription ID", "Date", "Amount", "Plan", "Status"].map((h) => (
                  <th
                    key={h}
                    className="px-6 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loadingHistory ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center">
                    <div className="flex items-center justify-center gap-2 text-gray-400">
                      <Loader2 className="w-4 h-4 animate-spin text-[#346853]" />
                      <span className="text-sm">Loading history...</span>
                    </div>
                  </td>
                </tr>
              ) : history.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-400">
                    No billing history found.
                  </td>
                </tr>
              ) : (
                history.map((row) => (
                  <tr key={row.subscriptionId} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-700 font-medium">{row.subscriptionId}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-2">
                        <CalendarDays className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span className="text-gray-700 font-medium">{formatHistoryDate(row.createdAt)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3.5 font-semibold text-gray-900 font-mono">
                      {row.convertedPrice != null
                        ? formatAmountInCurrency(row.convertedPrice, row.convertedCurrency ?? undefined)
                        : formatAmountInCurrency(row.amount, row.currency)}
                    </td>
                    <td className="px-6 py-3.5 text-gray-600">{row.planName}</td>
                    <td className="px-6 py-3.5">
                      <Badge
                        className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${row.status === "active"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : row.status === "cancelled"
                            ? "bg-red-50 text-red-600 border-red-200"
                            : "bg-gray-50 text-gray-600 border-gray-200"
                          }`}
                      >
                        {row.status}
                      </Badge>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
